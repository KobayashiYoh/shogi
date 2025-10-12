import { describe, it, expect } from 'vitest';
import { getMovablePositions } from '../../utils/moveablePositionsLogic';
import type { Board, Piece, BoardIndex } from '../../types';

describe('moveablePositionsLogic', () => {
  const createEmptyBoard = (): Board => {
    return Array(9)
      .fill(null)
      .map(() => Array(9).fill(null));
  };

  describe('歩の移動', () => {
    it('先手の歩が正しく1マス前進できる', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'fu',
        isFirstPlayer: true,
      };
      const from = { row: 6 as BoardIndex, col: 4 as BoardIndex };

      const moves = getMovablePositions(board, from, piece);

      expect(moves).toEqual([{ row: 5, col: 4 }]);
    });

    it('後手の歩が正しく1マス前進できる', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'fu',
        isFirstPlayer: false,
      };
      const from = { row: 2 as BoardIndex, col: 4 as BoardIndex };

      const moves = getMovablePositions(board, from, piece);

      expect(moves).toEqual([{ row: 3, col: 4 }]);
    });

    it('先手の歩が盤面外に移動できない', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'fu',
        isFirstPlayer: true,
      };
      const from = { row: 0 as BoardIndex, col: 4 as BoardIndex };

      const moves = getMovablePositions(board, from, piece);

      expect(moves).toEqual([]);
    });

    it('後手の歩が盤面外に移動できない', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'fu',
        isFirstPlayer: false,
      };
      const from = { row: 8 as BoardIndex, col: 4 as BoardIndex };

      const moves = getMovablePositions(board, from, piece);

      expect(moves).toEqual([]);
    });

    it('先手の歩が味方の駒がある位置に移動できない', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'fu',
        isFirstPlayer: true,
      };
      board[6][4] = piece;
      board[5][4] = { type: 'fu', isFirstPlayer: true };

      const moves = getMovablePositions(
        board,
        { row: 6 as BoardIndex, col: 4 as BoardIndex },
        piece
      );

      expect(moves).toEqual([]);
    });

    it('先手の歩が敵の駒を取れる', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'fu',
        isFirstPlayer: true,
      };
      board[6][4] = piece;
      board[5][4] = { type: 'fu', isFirstPlayer: false };

      const moves = getMovablePositions(
        board,
        { row: 6 as BoardIndex, col: 4 as BoardIndex },
        piece
      );

      expect(moves).toEqual([{ row: 5, col: 4 }]);
    });
  });

  describe('王将の移動', () => {
    it('王将が8方向に移動できる', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'ou',
        isFirstPlayer: true,
      };
      const from = { row: 4 as BoardIndex, col: 4 as BoardIndex };

      const moves = getMovablePositions(board, from, piece);

      expect(moves).toHaveLength(8);
      expect(moves).toContainEqual({ row: 3, col: 3 });
      expect(moves).toContainEqual({ row: 3, col: 4 });
      expect(moves).toContainEqual({ row: 3, col: 5 });
      expect(moves).toContainEqual({ row: 4, col: 3 });
      expect(moves).toContainEqual({ row: 4, col: 5 });
      expect(moves).toContainEqual({ row: 5, col: 3 });
      expect(moves).toContainEqual({ row: 5, col: 4 });
      expect(moves).toContainEqual({ row: 5, col: 5 });
    });

    it('王将が角の位置から3方向にしか移動できない', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'ou',
        isFirstPlayer: true,
      };
      const from = { row: 0 as BoardIndex, col: 0 as BoardIndex };

      const moves = getMovablePositions(board, from, piece);

      expect(moves).toHaveLength(3);
      expect(moves).toContainEqual({ row: 0, col: 1 });
      expect(moves).toContainEqual({ row: 1, col: 0 });
      expect(moves).toContainEqual({ row: 1, col: 1 });
    });

    it('王将が味方の駒がある位置に移動できない', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'ou',
        isFirstPlayer: true,
      };
      board[4][4] = piece;
      board[3][4] = { type: 'fu', isFirstPlayer: true };
      board[4][5] = { type: 'fu', isFirstPlayer: true };

      const moves = getMovablePositions(
        board,
        { row: 4 as BoardIndex, col: 4 as BoardIndex },
        piece
      );

      expect(moves).toHaveLength(6);
      expect(moves).not.toContainEqual({ row: 3, col: 4 });
      expect(moves).not.toContainEqual({ row: 4, col: 5 });
    });
  });

  describe('飛車の移動', () => {
    it('飛車が縦横に移動できる', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'hisha',
        isFirstPlayer: true,
      };
      const from = { row: 4 as BoardIndex, col: 4 as BoardIndex };

      const moves = getMovablePositions(board, from, piece);

      expect(moves.length).toBeGreaterThan(0);
      expect(moves).toContainEqual({ row: 0, col: 4 });
      expect(moves).toContainEqual({ row: 8, col: 4 });
      expect(moves).toContainEqual({ row: 4, col: 0 });
      expect(moves).toContainEqual({ row: 4, col: 8 });
    });

    it('飛車が駒を飛び越えられない', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'hisha',
        isFirstPlayer: true,
      };
      board[4][4] = piece;
      board[4][6] = { type: 'fu', isFirstPlayer: true };

      const moves = getMovablePositions(
        board,
        { row: 4 as BoardIndex, col: 4 as BoardIndex },
        piece
      );

      expect(moves).not.toContainEqual({ row: 4, col: 7 });
      expect(moves).not.toContainEqual({ row: 4, col: 8 });
      expect(moves).toContainEqual({ row: 4, col: 5 });
    });
  });

  describe('角行の移動', () => {
    it('角行が斜めに移動できる', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'kaku',
        isFirstPlayer: true,
      };
      const from = { row: 4 as BoardIndex, col: 4 as BoardIndex };

      const moves = getMovablePositions(board, from, piece);

      expect(moves.length).toBeGreaterThan(0);
      expect(moves).toContainEqual({ row: 0, col: 0 });
      expect(moves).toContainEqual({ row: 8, col: 8 });
      expect(moves).toContainEqual({ row: 1, col: 7 });
      expect(moves).toContainEqual({ row: 7, col: 1 });
    });
  });

  describe('金将の移動', () => {
    it('先手の金将が正しく移動できる', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'kin',
        isFirstPlayer: true,
      };
      const from = { row: 4 as BoardIndex, col: 4 as BoardIndex };

      const moves = getMovablePositions(board, from, piece);

      expect(moves).toHaveLength(6);
      expect(moves).toContainEqual({ row: 3, col: 3 });
      expect(moves).toContainEqual({ row: 3, col: 4 });
      expect(moves).toContainEqual({ row: 3, col: 5 });
      expect(moves).toContainEqual({ row: 4, col: 3 });
      expect(moves).toContainEqual({ row: 4, col: 5 });
      expect(moves).toContainEqual({ row: 5, col: 4 });
    });
  });

  describe('銀将の移動', () => {
    it('先手の銀将が正しく移動できる', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'gin',
        isFirstPlayer: true,
      };
      const from = { row: 4 as BoardIndex, col: 4 as BoardIndex };

      const moves = getMovablePositions(board, from, piece);

      expect(moves).toHaveLength(5);
      expect(moves).toContainEqual({ row: 3, col: 3 });
      expect(moves).toContainEqual({ row: 3, col: 4 });
      expect(moves).toContainEqual({ row: 3, col: 5 });
      expect(moves).toContainEqual({ row: 5, col: 3 });
      expect(moves).toContainEqual({ row: 5, col: 5 });
    });
  });

  describe('桂馬の移動', () => {
    it('先手の桂馬が正しく移動できる', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'keima',
        isFirstPlayer: true,
      };
      const from = { row: 4 as BoardIndex, col: 4 as BoardIndex };

      const moves = getMovablePositions(board, from, piece);

      expect(moves).toHaveLength(2);
      expect(moves).toContainEqual({ row: 2, col: 3 });
      expect(moves).toContainEqual({ row: 2, col: 5 });
    });
  });

  describe('香車の移動', () => {
    it('先手の香車が正しく前方に移動できる', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'kyou',
        isFirstPlayer: true,
      };
      const from = { row: 6 as BoardIndex, col: 4 as BoardIndex };

      const moves = getMovablePositions(board, from, piece);

      expect(moves.length).toBeGreaterThan(0);
      expect(moves).toContainEqual({ row: 5, col: 4 });
      expect(moves).toContainEqual({ row: 4, col: 4 });
      expect(moves).toContainEqual({ row: 0, col: 4 });
    });

    it('先手の香車が駒を飛び越えられない', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'kyou',
        isFirstPlayer: true,
      };
      board[6][4] = piece;
      board[4][4] = { type: 'fu', isFirstPlayer: false };

      const moves = getMovablePositions(
        board,
        { row: 6 as BoardIndex, col: 4 as BoardIndex },
        piece
      );

      expect(moves).toContainEqual({ row: 5, col: 4 });
      expect(moves).toContainEqual({ row: 4, col: 4 });
      expect(moves).not.toContainEqual({ row: 3, col: 4 });
    });
  });
});
