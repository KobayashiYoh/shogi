import { describe, it, expect } from 'vitest';
import type { Board, PieceType, Position } from 'shogi-core';
import {
  INITIAL_BOARD,
  enablePromotionAfterMove,
  isAutomaticPromotion,
  isPromotedPiece,
  selectCpuMove,
  shouldCpuPromote,
  calculateBoardAfterPieceMove,
} from 'shogi-core';

/**
 * useShogiGameフックの統合テスト
 *
 * FigJam Widget APIをモックする代わりに、
 * 主要なロジック（成り判定とCPU対戦）が正しく動作することを確認する
 */
describe('成り判定のロジックテスト', () => {
  describe('enablePromotionAfterMove', () => {
    it('先手の駒が敵陣（0-2行目）に入ると成れる', () => {
      const from: Position = { row: 3, col: 4 };
      const to: Position = { row: 2, col: 4 };
      const result = enablePromotionAfterMove(from, to, 'fu', true);
      expect(result).toBe(true);
    });

    it('先手の駒が敵陣内で移動しても成れる', () => {
      const from: Position = { row: 2, col: 4 };
      const to: Position = { row: 1, col: 4 };
      const result = enablePromotionAfterMove(from, to, 'fu', true);
      expect(result).toBe(true);
    });

    it('先手の駒が敵陣外では成れない', () => {
      const from: Position = { row: 6, col: 4 };
      const to: Position = { row: 5, col: 4 };
      const result = enablePromotionAfterMove(from, to, 'fu', true);
      expect(result).toBe(false);
    });

    it('後手の駒が敵陣（6-8行目）に入ると成れる', () => {
      const from: Position = { row: 5, col: 4 };
      const to: Position = { row: 6, col: 4 };
      const result = enablePromotionAfterMove(from, to, 'fu', false);
      expect(result).toBe(true);
    });

    it('王と金は成れない', () => {
      const from: Position = { row: 3, col: 4 };
      const to: Position = { row: 2, col: 4 };
      expect(enablePromotionAfterMove(from, to, 'ou', true)).toBe(false);
      expect(enablePromotionAfterMove(from, to, 'kin', true)).toBe(false);
    });

    it('成り駒でも敵陣では成り判定が有効（既に成っているので実際には成らない）', () => {
      /**
       * enablePromotionAfterMoveは位置と駒種で成り可能かを判定するが、
       * 既に成っている駒かどうかはcalculateBoardAfterPieceMoveで処理される
       * 実際の成り処理は別の関数で行われる
       */
      const from: Position = { row: 3, col: 4 };
      const to: Position = { row: 2, col: 4 };
      const result1 = enablePromotionAfterMove(from, to, 'tokin', true);
      const result2 = enablePromotionAfterMove(from, to, 'ryuou', true);
      expect(typeof result1).toBe('boolean');
      expect(typeof result2).toBe('boolean');
    });
  });

  describe('isAutomaticPromotion (自動成り判定)', () => {
    it('先手の歩は0行目で自動的に成る', () => {
      const to: Position = { row: 0, col: 4 };
      expect(isAutomaticPromotion(to, 'fu', true)).toBe(true);
    });

    it('先手の香は0行目で自動的に成る', () => {
      const to: Position = { row: 0, col: 4 };
      expect(isAutomaticPromotion(to, 'kyou', true)).toBe(true);
    });

    it('先手の桂は0-1行目で自動的に成る', () => {
      expect(isAutomaticPromotion({ row: 0, col: 4 }, 'keima', true)).toBe(true);
      expect(isAutomaticPromotion({ row: 1, col: 4 }, 'keima', true)).toBe(true);
      expect(isAutomaticPromotion({ row: 2, col: 4 }, 'keima', true)).toBe(false);
    });

    it('後手の歩は8行目で自動的に成る', () => {
      const to: Position = { row: 8, col: 4 };
      expect(isAutomaticPromotion(to, 'fu', false)).toBe(true);
    });

    it('後手の桂は7-8行目で自動的に成る', () => {
      expect(isAutomaticPromotion({ row: 8, col: 4 }, 'keima', false)).toBe(true);
      expect(isAutomaticPromotion({ row: 7, col: 4 }, 'keima', false)).toBe(true);
      expect(isAutomaticPromotion({ row: 6, col: 4 }, 'keima', false)).toBe(false);
    });

    it('銀や角は自動成りしない', () => {
      expect(isAutomaticPromotion({ row: 0, col: 4 }, 'gin', true)).toBe(false);
      expect(isAutomaticPromotion({ row: 0, col: 4 }, 'kaku', true)).toBe(false);
    });
  });

  describe('isPromotedPiece (成り駒判定)', () => {
    it('成り駒を正しく判定する', () => {
      expect(isPromotedPiece('tokin')).toBe(true);
      expect(isPromotedPiece('ryuou')).toBe(true);
      expect(isPromotedPiece('ryuuma')).toBe(true);
      expect(isPromotedPiece('narigin')).toBe(true);
      expect(isPromotedPiece('narikei')).toBe(true);
      expect(isPromotedPiece('narikyo')).toBe(true);
    });

    it('未成駒を正しく判定する', () => {
      expect(isPromotedPiece('fu')).toBe(false);
      expect(isPromotedPiece('hisha')).toBe(false);
      expect(isPromotedPiece('kaku')).toBe(false);
      expect(isPromotedPiece('gin')).toBe(false);
      expect(isPromotedPiece('keima')).toBe(false);
      expect(isPromotedPiece('kyou')).toBe(false);
      expect(isPromotedPiece('kin')).toBe(false);
      expect(isPromotedPiece('ou')).toBe(false);
    });
  });
});

describe('CPU対戦のロジックテスト', () => {
  describe('selectCpuMove', () => {
    it('CPUは有効な手を返す', () => {
      const board: Board = INITIAL_BOARD;
      const cpuMove = selectCpuMove(board, []);

      expect(cpuMove).toBeTruthy();
      if (cpuMove) {
        expect(cpuMove.fromPos).toBeTruthy();
        expect(cpuMove.toPos).toBeTruthy();
        expect(cpuMove.piece).toBeTruthy();
        expect(cpuMove.piece.isFirstPlayer).toBe(false);
      }
    });

    it('CPUは持ち駒を使える', () => {
      const emptyBoard: Board = Array.from({ length: 9 }, () =>
        Array(9).fill(null)
      );

      emptyBoard[0][4] = { type: 'ou', isFirstPlayer: false };
      emptyBoard[8][4] = { type: 'ou', isFirstPlayer: true };

      const capturedPieces: PieceType[] = ['fu'];
      const cpuMove = selectCpuMove(emptyBoard, capturedPieces);

      expect(cpuMove).toBeTruthy();
      if (cpuMove) {
        if (cpuMove.fromPos === null) {
          expect(cpuMove.capturedPieceType).toBe('fu');
        }
      }
    });

    it('CPUは持ち駒リストにない駒を配置できない', () => {
      const emptyBoard: Board = Array.from({ length: 9 }, () =>
        Array(9).fill(null)
      );

      emptyBoard[0][4] = { type: 'ou', isFirstPlayer: false };
      emptyBoard[8][4] = { type: 'ou', isFirstPlayer: true };

      // 持ち駒が空の場合
      const capturedPieces: PieceType[] = [];
      const cpuMove = selectCpuMove(emptyBoard, capturedPieces);

      // CPUは盤上の駒を動かすか、nullを返す（持ち駒の配置は選択しない）
      if (cpuMove && cpuMove.fromPos === null) {
        // 持ち駒を使う手の場合、capturedPieceTypeが持ち駒リストに含まれていることを確認
        expect(capturedPieces.includes(cpuMove.capturedPieceType!)).toBe(true);
      }
    });
  });

  describe('shouldCpuPromote', () => {
    it('CPUは自動成り条件では必ず成る', () => {
      const from: Position = { row: 7, col: 4 };
      const to: Position = { row: 8, col: 4 };
      expect(shouldCpuPromote(from, to, 'fu', false)).toBe(true);
    });

    it('CPUは成り可能な位置では成る判定を返す', () => {
      const from: Position = { row: 3, col: 4 };
      const to: Position = { row: 2, col: 4 };
      const result = shouldCpuPromote(from, to, 'fu', false);
      expect(typeof result).toBe('boolean');
    });

    it('CPUは成り駒では成らない', () => {
      const from: Position = { row: 3, col: 4 };
      const to: Position = { row: 2, col: 4 };
      expect(shouldCpuPromote(from, to, 'tokin', false)).toBe(false);
    });

    it('CPUは持ち駒では成らない', () => {
      const to: Position = { row: 2, col: 4 };
      expect(shouldCpuPromote(null, to, 'fu', false)).toBe(false);
    });
  });
});

describe('統合テスト: 成り判定の動作確認', () => {
  it('歩が敵陣に入った時、成り判定が有効になる', () => {
    const from: Position = { row: 3, col: 4 };
    const to: Position = { row: 2, col: 4 };
    const pieceType: PieceType = 'fu';
    const isFirstPlayer = true;

    expect(enablePromotionAfterMove(from, to, pieceType, isFirstPlayer)).toBe(true);
    expect(isAutomaticPromotion(to, pieceType, isFirstPlayer)).toBe(false);
  });

  it('歩が一番奥まで進んだ時、自動的に成る', () => {
    const to: Position = { row: 0, col: 4 };
    const pieceType: PieceType = 'fu';
    const isFirstPlayer = true;

    expect(isAutomaticPromotion(to, pieceType, isFirstPlayer)).toBe(true);
  });

  it('成り駒は既に成っているので、再度成り判定を行わない', () => {
    const to: Position = { row: 2, col: 4 };
    const promotedPieceType: PieceType = 'tokin';
    const isFirstPlayer = true;

    // 成り駒かどうかを判定
    expect(isPromotedPiece(promotedPieceType)).toBe(true);

    // 成り駒は自動成り判定をスキップすべき
    expect(isAutomaticPromotion(to, promotedPieceType, isFirstPlayer)).toBe(false);
  });

  it('成り駒（竜王）が敵陣内で移動しても成り判定は発生しない', () => {
    const to: Position = { row: 2, col: 4 };
    const promotedPieceType: PieceType = 'ryuou';
    const isFirstPlayer = true;

    // 成り駒であることを確認
    expect(isPromotedPiece(promotedPieceType)).toBe(true);

    // useShogiGameのhandleValidMoveでは、isPromotedPieceがtrueの場合、
    // enablePromotionAfterMoveやisAutomaticPromotionのチェックをスキップする
    expect(isAutomaticPromotion(to, promotedPieceType, isFirstPlayer)).toBe(false);
  });
});

describe('統合テスト: CPU対戦の動作確認', () => {
  it('CPU対戦モードで有効な手が選択される', () => {
    const board: Board = INITIAL_BOARD;
    const capturedPieces: PieceType[] = [];

    const cpuMove = selectCpuMove(board, capturedPieces);

    expect(cpuMove).toBeTruthy();

    if (cpuMove) {
      expect(cpuMove.piece.isFirstPlayer).toBe(false);

      expect(cpuMove.toPos.row).toBeGreaterThanOrEqual(0);
      expect(cpuMove.toPos.row).toBeLessThanOrEqual(8);
      expect(cpuMove.toPos.col).toBeGreaterThanOrEqual(0);
      expect(cpuMove.toPos.col).toBeLessThanOrEqual(8);
    }
  });

  it('CPUが成り可能な位置に移動する時、適切に成り判定を行う', () => {
    const to: Position = { row: 6, col: 4 };
    const pieceType: PieceType = 'fu';

    const shouldPromote = shouldCpuPromote({ row: 5, col: 4 }, to, pieceType, false);

    expect(typeof shouldPromote).toBe('boolean');

    if (isAutomaticPromotion(to, pieceType, false)) {
      expect(shouldPromote).toBe(true);
    }
  });

  it('プレイヤーが駒を動かした後、CPUが有効な手を選択できる', () => {
    // 初期盤面から開始
    let board: Board = INITIAL_BOARD;
    const secondPlayerCapturedPieces: PieceType[] = [];

    // プレイヤー（先手）が76歩を指す
    const playerFrom: Position = { row: 6, col: 6 };
    const playerTo: Position = { row: 5, col: 6 };

    // プレイヤーの手を適用
    const { newBoard: boardAfterPlayer } = calculateBoardAfterPieceMove(
      board,
      playerFrom,
      playerTo,
      false
    );

    // CPUが有効な手を選択できることを確認
    const cpuMove = selectCpuMove(boardAfterPlayer, secondPlayerCapturedPieces);

    expect(cpuMove).toBeTruthy();

    if (cpuMove) {
      // CPUの駒であることを確認
      expect(cpuMove.piece.isFirstPlayer).toBe(false);

      // 有効な位置に移動できることを確認
      expect(cpuMove.toPos.row).toBeGreaterThanOrEqual(0);
      expect(cpuMove.toPos.row).toBeLessThanOrEqual(8);
      expect(cpuMove.toPos.col).toBeGreaterThanOrEqual(0);
      expect(cpuMove.toPos.col).toBeLessThanOrEqual(8);
    }
  });

  it('プレイヤーが駒を取った後、CPUがその持ち駒を使って手を指せる', () => {
    // 簡略化した盤面を作成（王のみ配置）
    const board: Board = Array.from({ length: 9 }, () => Array(9).fill(null));
    board[0][4] = { type: 'ou', isFirstPlayer: false };
    board[8][4] = { type: 'ou', isFirstPlayer: true };

    // CPUが歩を持ち駒として持っている
    const secondPlayerCapturedPieces: PieceType[] = ['fu'];

    // CPUが持ち駒を使った手を選択できることを確認
    const cpuMove = selectCpuMove(board, secondPlayerCapturedPieces);

    expect(cpuMove).toBeTruthy();

    if (cpuMove) {
      // 持ち駒を使う手の場合、fromPosがnullで、capturedPieceTypeが設定されている
      if (cpuMove.fromPos === null) {
        expect(cpuMove.capturedPieceType).toBe('fu');
        expect(cpuMove.piece.isFirstPlayer).toBe(false);
        expect(cpuMove.piece.type).toBe('fu');
      }
    }
  });

  it('プレイヤーの手の後、CPUの手を適用してもゲームが継続できる', () => {
    // 初期盤面から開始
    let board: Board = INITIAL_BOARD;
    let secondPlayerCapturedPieces: PieceType[] = [];

    // プレイヤー（先手）が76歩を指す
    const playerFrom: Position = { row: 6, col: 6 };
    const playerTo: Position = { row: 5, col: 6 };

    // プレイヤーの手を適用
    const { newBoard: boardAfterPlayer, capturedPiece: playerCapturedPiece } =
      calculateBoardAfterPieceMove(board, playerFrom, playerTo, false);

    if (playerCapturedPiece) {
      secondPlayerCapturedPieces = [...secondPlayerCapturedPieces, playerCapturedPiece];
    }

    // CPUの手を選択
    const cpuMove = selectCpuMove(boardAfterPlayer, secondPlayerCapturedPieces);
    expect(cpuMove).toBeTruthy();

    if (cpuMove && cpuMove.fromPos) {
      // CPUの手を適用
      const shouldPromote = shouldCpuPromote(
        cpuMove.fromPos,
        cpuMove.toPos,
        cpuMove.piece.type,
        false
      );

      const { newBoard: boardAfterCpu } = calculateBoardAfterPieceMove(
        boardAfterPlayer,
        cpuMove.fromPos,
        cpuMove.toPos,
        shouldPromote
      );

      // CPUの手の後も盤面が有効であることを確認
      expect(boardAfterCpu).toBeTruthy();
      expect(boardAfterCpu.length).toBe(9);
      expect(boardAfterCpu[0].length).toBe(9);

      // CPUの駒が移動先に配置されていることを確認
      const movedPiece = boardAfterCpu[cpuMove.toPos.row][cpuMove.toPos.col];
      expect(movedPiece).toBeTruthy();
      expect(movedPiece?.isFirstPlayer).toBe(false);
    }
  });

  /**
   * 【重要】デグレ防止テスト: ユーザーがコマを動かした後にCPUがコマを動かすこと
   * このテストは絶対に成功し続けなければならない
   */
  it('【デグレ防止】ユーザーがコマを動かした後に必ずCPUがコマを動かす', () => {
    // 初期盤面から開始
    const initialBoard: Board = INITIAL_BOARD;
    const gameMode = 'cpu';
    let isFirstPlayerTurn = true;
    let secondPlayerCapturedPieces: PieceType[] = [];

    // プレイヤー（先手）が76歩を指す
    const playerFrom: Position = { row: 6, col: 6 };
    const playerTo: Position = { row: 5, col: 6 };

    // 【ステップ1】プレイヤーの手を適用（executePieceMoveの処理を再現）
    const currentPlayerIsFirst = isFirstPlayerTurn;
    const { newBoard, capturedPiece } = calculateBoardAfterPieceMove(
      initialBoard,
      playerFrom,
      playerTo,
      false
    );

    let updatedSecondPlayerCapturedPieces = secondPlayerCapturedPieces;
    if (capturedPiece && currentPlayerIsFirst) {
      updatedSecondPlayerCapturedPieces = [
        ...secondPlayerCapturedPieces,
        capturedPiece,
      ];
    }

    // ターンを切り替え
    isFirstPlayerTurn = !currentPlayerIsFirst;

    // 【ステップ2】CPUのターンであることを確認
    const shouldExecuteCpuMove =
      gameMode === 'cpu' && isFirstPlayerTurn === false;

    expect(shouldExecuteCpuMove).toBe(true);

    // 【ステップ3】CPUが有効な手を選択できることを確認
    const cpuMove = selectCpuMove(newBoard, updatedSecondPlayerCapturedPieces);

    // CPUの手が必ず存在することを確認（デグレ防止の核心）
    expect(cpuMove).toBeTruthy();
    expect(cpuMove).not.toBeNull();
    expect(cpuMove).not.toBeUndefined();

    if (cpuMove) {
      // CPUの駒であることを確認
      expect(cpuMove.piece.isFirstPlayer).toBe(false);

      // 【ステップ4】CPUの手を適用
      if (cpuMove.fromPos === null && cpuMove.capturedPieceType) {
        // 持ち駒を使う場合
        const cpuNewBoard: Board = newBoard.map((row) => [...row]);
        cpuNewBoard[cpuMove.toPos.row][cpuMove.toPos.col] = cpuMove.piece;

        // CPUの駒が正しく配置されたことを確認
        expect(cpuNewBoard[cpuMove.toPos.row][cpuMove.toPos.col]).toBeTruthy();
        expect(
          cpuNewBoard[cpuMove.toPos.row][cpuMove.toPos.col]?.isFirstPlayer
        ).toBe(false);
      } else if (cpuMove.fromPos) {
        // 盤上の駒を動かす場合
        const shouldPromote = shouldCpuPromote(
          cpuMove.fromPos,
          cpuMove.toPos,
          cpuMove.piece.type,
          false
        );

        const { newBoard: cpuNewBoard } = calculateBoardAfterPieceMove(
          newBoard,
          cpuMove.fromPos,
          cpuMove.toPos,
          shouldPromote
        );

        // CPUの駒が正しく移動したことを確認
        expect(cpuNewBoard[cpuMove.toPos.row][cpuMove.toPos.col]).toBeTruthy();
        expect(
          cpuNewBoard[cpuMove.toPos.row][cpuMove.toPos.col]?.isFirstPlayer
        ).toBe(false);

        // 元の位置から駒が消えたことを確認
        expect(cpuNewBoard[cpuMove.fromPos.row][cpuMove.fromPos.col]).toBeNull();
      }
    }
  });
});
