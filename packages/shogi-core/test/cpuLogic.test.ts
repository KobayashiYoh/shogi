import { describe, it, expect } from 'vitest';
import { selectCpuMove, shouldCpuPromote } from '../src/utils/cpuLogic';
import { INITIAL_BOARD } from '../src/constants/initialBoard';
import type { Board, PieceType, BoardIndex } from '../src/types';

describe('cpuLogic', () => {
  describe('selectCpuMove', () => {
    it('初期盤面で有効な手を返す', () => {
      const move = selectCpuMove(INITIAL_BOARD);

      expect(move).not.toBeNull();
      if (move) {
        expect(move.fromPos).toBeDefined();
        expect(move.toPos).toBeDefined();
        expect(move.piece).toBeDefined();
        expect(move.piece.isFirstPlayer).toBe(false);
      }
    });

    it('王を取れる手がある場合は王を取る', () => {
      const board: Board = [
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [
          null,
          null,
          null,
          null,
          { type: 'ou', isFirstPlayer: true },
          null,
          null,
          null,
          null,
        ],
        [
          null,
          null,
          null,
          null,
          { type: 'hisha', isFirstPlayer: false },
          null,
          null,
          null,
          null,
        ],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
      ];

      const move = selectCpuMove(board);

      expect(move).not.toBeNull();
      if (move) {
        expect(move.fromPos).not.toBeNull();
        if (move.fromPos) {
          expect(move.fromPos.row).toBe(4);
          expect(move.fromPos.col).toBe(4);
        }
        expect(move.toPos.row).toBe(3);
        expect(move.toPos.col).toBe(4);
        const targetPiece = board[move.toPos.row][move.toPos.col];
        expect(targetPiece?.type).toBe('ou');
      }
    });

    it('手が指せない盤面ではnullを返す', () => {
      const emptyBoard: Board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null));

      const move = selectCpuMove(emptyBoard);

      expect(move).toBeNull();
    });

    it('複数回実行してもエラーが発生しない', () => {
      for (let i = 0; i < 10; i++) {
        const move = selectCpuMove(INITIAL_BOARD);
        expect(move).not.toBeNull();
      }
    });

    it('駒を取れる場合は確実に取る', () => {
      // プレイヤーの飛車がCPUの金の隣にある状況
      // CPUは飛車を取るべき
      const board: Board = [
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [
          null,
          null,
          null,
          { type: 'kin', isFirstPlayer: false },
          { type: 'hisha', isFirstPlayer: true },
          null,
          null,
          null,
          null,
        ],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
      ];

      const move = selectCpuMove(board);

      expect(move).not.toBeNull();
      if (move) {
        // CPUの金が飛車を取る手を選択することを確認
        expect(move.fromPos).not.toBeNull();
        if (move.fromPos) {
          expect(move.fromPos.row).toBe(3);
          expect(move.fromPos.col).toBe(3);
        }
        expect(move.toPos.row).toBe(3);
        expect(move.toPos.col).toBe(4);
        const targetPiece = board[move.toPos.row][move.toPos.col];
        expect(targetPiece?.type).toBe('hisha');
      }
    });

    it('持ち駒を使う手を選択できる', () => {
      // CPUが持ち駒を持っている場合
      const board: Board = [
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
      ];

      const capturedPieces: PieceType[] = ['fu'];
      const move = selectCpuMove(board, capturedPieces);

      expect(move).not.toBeNull();
      if (move) {
        // 持ち駒を配置する手が選ばれることを確認
        expect(move.fromPos).toBeNull();
        expect(move.capturedPieceType).toBe('fu');
        expect(move.piece.type).toBe('fu');
        expect(move.piece.isFirstPlayer).toBe(false);
      }
    });

    it('持ち駒がない場合は盤上の駒のみを動かす', () => {
      const move = selectCpuMove(INITIAL_BOARD, []);

      expect(move).not.toBeNull();
      if (move) {
        // 盤上の駒を動かす手が選ばれることを確認
        expect(move.fromPos).not.toBeNull();
        expect(move.capturedPieceType).toBeUndefined();
      }
    });
  });

  describe('shouldCpuPromote', () => {
    it('成ることができる場合は必ず成る', () => {
      // 後手（CPU）の歩が敵陣に入る場合（後手の敵陣は6〜8行目）
      const fromPos = { row: 5 as BoardIndex, col: 4 as BoardIndex };
      const toPos = { row: 6 as BoardIndex, col: 4 as BoardIndex };
      const pieceType: PieceType = 'fu';
      const isFirstPlayer = false;

      const result = shouldCpuPromote(fromPos, toPos, pieceType, isFirstPlayer);

      expect(result).toBe(true);
    });

    it('成り駒は成り判定をしない', () => {
      const fromPos = { row: 3 as BoardIndex, col: 4 as BoardIndex };
      const toPos = { row: 2 as BoardIndex, col: 4 as BoardIndex };
      const pieceType: PieceType = 'tokin';
      const isFirstPlayer = false;

      const result = shouldCpuPromote(fromPos, toPos, pieceType, isFirstPlayer);

      expect(result).toBe(false);
    });

    it('成ることができない場合はfalseを返す', () => {
      // 成る条件を満たさない移動
      const fromPos = { row: 5 as BoardIndex, col: 4 as BoardIndex };
      const toPos = { row: 4 as BoardIndex, col: 4 as BoardIndex };
      const pieceType: PieceType = 'fu';
      const isFirstPlayer = false;

      const result = shouldCpuPromote(fromPos, toPos, pieceType, isFirstPlayer);

      expect(result).toBe(false);
    });

    it('持ち駒を配置する場合は成らない', () => {
      // fromPosがnullの場合（持ち駒の配置）
      const fromPos = null;
      const toPos = { row: 6 as BoardIndex, col: 4 as BoardIndex };
      const pieceType: PieceType = 'fu';
      const isFirstPlayer = false;

      const result = shouldCpuPromote(fromPos, toPos, pieceType, isFirstPlayer);

      expect(result).toBe(false);
    });
  });
});
