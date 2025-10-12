import { describe, it, expect } from 'vitest';
import {
  judgeGameResult,
  isValidMoveFromSelectedPosToTargetPos,
  calculateBoardAfterPieceMove,
  canPlaceCapturedPiece,
  placeCapturedPiece,
} from '../utils/gameLogic';
import type { Board, Piece, BoardIndex } from '../types';

describe('gameLogic', () => {
  const createEmptyBoard = (): Board => {
    return Array(9)
      .fill(null)
      .map(() => Array(9).fill(null));
  };

  describe('judgeGameResult', () => {
    it('両方の王が存在する場合はplaying_game', () => {
      const board = createEmptyBoard();
      board[0][4] = { type: 'ou', isFirstPlayer: false };
      board[8][4] = { type: 'ou', isFirstPlayer: true };

      const result = judgeGameResult(board);

      expect(result).toBe('playing_game');
    });

    it('先手の王がいない場合は後手勝利', () => {
      const board = createEmptyBoard();
      board[0][4] = { type: 'ou', isFirstPlayer: false };

      const result = judgeGameResult(board);

      expect(result).toBe('second_player_wins');
    });

    it('後手の王がいない場合は先手勝利', () => {
      const board = createEmptyBoard();
      board[8][4] = { type: 'ou', isFirstPlayer: true };

      const result = judgeGameResult(board);

      expect(result).toBe('first_player_wins');
    });
  });

  describe('calculateBoardAfterPieceMove', () => {
    it('駒が正しく移動する', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'fu',
        isFirstPlayer: true,
      };
      board[6][4] = piece;

      const { newBoard, capturedPiece } = calculateBoardAfterPieceMove(
        board,
        { row: 6 as BoardIndex, col: 4 as BoardIndex },
        { row: 5 as BoardIndex, col: 4 as BoardIndex }
      );

      expect(newBoard[6][4]).toBeNull();
      expect(newBoard[5][4]).toEqual(piece);
      expect(capturedPiece).toBeNull();
    });

    it('移動先に相手の駒がある場合は取る', () => {
      const board = createEmptyBoard();
      const firstPlayerPiece: Piece = {
        type: 'fu',
        isFirstPlayer: true,
      };
      const secondPlayerPiece: Piece = {
        type: 'fu',
        isFirstPlayer: false,
      };
      board[6][4] = firstPlayerPiece;
      board[5][4] = secondPlayerPiece;

      const { newBoard, capturedPiece } = calculateBoardAfterPieceMove(
        board,
        { row: 6 as BoardIndex, col: 4 as BoardIndex },
        { row: 5 as BoardIndex, col: 4 as BoardIndex }
      );

      expect(newBoard[6][4]).toBeNull();
      expect(newBoard[5][4]).toEqual(firstPlayerPiece);
      expect(capturedPiece).toBe('fu');
    });
  });

  describe('isValidMoveFromSelectedPosToTargetPos', () => {
    it('歩の正常な移動はtrue', () => {
      const board = createEmptyBoard();
      board[6][4] = { type: 'fu', isFirstPlayer: true };

      const isValid = isValidMoveFromSelectedPosToTargetPos(
        board,
        { row: 6 as BoardIndex, col: 4 as BoardIndex },
        { row: 5 as BoardIndex, col: 4 as BoardIndex }
      );

      expect(isValid).toBe(true);
    });

    it('駒がない位置からの移動はfalse', () => {
      const board = createEmptyBoard();

      const isValid = isValidMoveFromSelectedPosToTargetPos(
        board,
        { row: 6 as BoardIndex, col: 4 as BoardIndex },
        { row: 5 as BoardIndex, col: 4 as BoardIndex }
      );

      expect(isValid).toBe(false);
    });

    it('無効な移動はfalse', () => {
      const board = createEmptyBoard();
      board[6][4] = { type: 'fu', isFirstPlayer: true };

      const isValid = isValidMoveFromSelectedPosToTargetPos(
        board,
        { row: 6 as BoardIndex, col: 4 as BoardIndex },
        { row: 4 as BoardIndex, col: 4 as BoardIndex }
      );

      expect(isValid).toBe(false);
    });
  });

  describe('canPlaceCapturedPiece', () => {
    it('空いているマスにはtrue', () => {
      const board = createEmptyBoard();

      const canPlace = canPlaceCapturedPiece(board, {
        row: 4 as BoardIndex,
        col: 4 as BoardIndex,
      });

      expect(canPlace).toBe(true);
    });

    it('駒があるマスにはfalse', () => {
      const board = createEmptyBoard();
      board[4][4] = { type: 'fu', isFirstPlayer: true };

      const canPlace = canPlaceCapturedPiece(board, {
        row: 4 as BoardIndex,
        col: 4 as BoardIndex,
      });

      expect(canPlace).toBe(false);
    });
  });

  describe('placeCapturedPiece', () => {
    it('持ち駒を正しく配置できる', () => {
      const board = createEmptyBoard();

      const newBoard = placeCapturedPiece(
        board,
        { row: 4 as BoardIndex, col: 4 as BoardIndex },
        'fu',
        true
      );

      expect(newBoard[4][4]).toEqual({
        type: 'fu',
        isFirstPlayer: true,
      });
    });

    it('元の盤面は変更しない', () => {
      const board = createEmptyBoard();

      placeCapturedPiece(
        board,
        { row: 4 as BoardIndex, col: 4 as BoardIndex },
        'fu',
        true
      );

      expect(board[4][4]).toBeNull();
    });

    it('後手の駒も正しく配置できる', () => {
      const board = createEmptyBoard();

      const newBoard = placeCapturedPiece(
        board,
        { row: 2 as BoardIndex, col: 3 as BoardIndex },
        'kin',
        false
      );

      expect(newBoard[2][3]).toEqual({
        type: 'kin',
        isFirstPlayer: false,
      });
    });
  });
});
