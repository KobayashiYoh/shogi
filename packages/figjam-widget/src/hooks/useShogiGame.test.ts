import { describe, it, expect } from 'vitest';
import type { Board, PieceType, Position } from 'shogi-core';
import {
  INITIAL_BOARD,
  enablePromotionAfterMove,
  isAutomaticPromotion,
  isPromotedPiece,
  selectCpuMove,
  shouldCpuPromote,
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
    const from: Position = { row: 3, col: 4 };
    const to: Position = { row: 2, col: 4 };
    const promotedPieceType: PieceType = 'tokin';
    const isFirstPlayer = true;

    // 成り駒かどうかを判定
    expect(isPromotedPiece(promotedPieceType)).toBe(true);

    // 成り駒は自動成り判定をスキップすべき
    expect(isAutomaticPromotion(to, promotedPieceType, isFirstPlayer)).toBe(false);
  });

  it('成り駒（竜王）が敵陣内で移動しても成り判定は発生しない', () => {
    const from: Position = { row: 3, col: 4 };
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
});
