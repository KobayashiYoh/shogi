import { describe, it, expect } from 'vitest';
import { INITIAL_BOARD } from '../../constants/initialBoard';

describe('initialBoard', () => {
  describe('INITIAL_BOARD', () => {
    it('盤面のサイズが9x9である', () => {
      expect(INITIAL_BOARD).toHaveLength(9);
      INITIAL_BOARD.forEach((row) => {
        expect(row).toHaveLength(9);
      });
    });

    it('後手の王将が0行目4列目にある', () => {
      const piece = INITIAL_BOARD[0][4];
      expect(piece).not.toBeNull();
      expect(piece?.type).toBe('ou');
      expect(piece?.isFirstPlayer).toBe(false);
    });

    it('先手の王将が8行目4列目にある', () => {
      const piece = INITIAL_BOARD[8][4];
      expect(piece).not.toBeNull();
      expect(piece?.type).toBe('ou');
      expect(piece?.isFirstPlayer).toBe(true);
    });

    it('後手の飛車が1行目1列目にある', () => {
      const piece = INITIAL_BOARD[1][1];
      expect(piece).not.toBeNull();
      expect(piece?.type).toBe('hisha');
      expect(piece?.isFirstPlayer).toBe(false);
    });

    it('先手の飛車が7行目7列目にある', () => {
      const piece = INITIAL_BOARD[7][7];
      expect(piece).not.toBeNull();
      expect(piece?.type).toBe('hisha');
      expect(piece?.isFirstPlayer).toBe(true);
    });

    it('後手の角が1行目7列目にある', () => {
      const piece = INITIAL_BOARD[1][7];
      expect(piece).not.toBeNull();
      expect(piece?.type).toBe('kaku');
      expect(piece?.isFirstPlayer).toBe(false);
    });

    it('先手の角が7行目1列目にある', () => {
      const piece = INITIAL_BOARD[7][1];
      expect(piece).not.toBeNull();
      expect(piece?.type).toBe('kaku');
      expect(piece?.isFirstPlayer).toBe(true);
    });

    it('後手の歩が2行目全体にある', () => {
      for (let col = 0; col < 9; col++) {
        const piece = INITIAL_BOARD[2][col];
        expect(piece).not.toBeNull();
        expect(piece?.type).toBe('fu');
        expect(piece?.isFirstPlayer).toBe(false);
      }
    });

    it('先手の歩が6行目全体にある', () => {
      for (let col = 0; col < 9; col++) {
        const piece = INITIAL_BOARD[6][col];
        expect(piece).not.toBeNull();
        expect(piece?.type).toBe('fu');
        expect(piece?.isFirstPlayer).toBe(true);
      }
    });

    it('3-5行目は空きマスである', () => {
      for (let row = 3; row <= 5; row++) {
        for (let col = 0; col < 9; col++) {
          expect(INITIAL_BOARD[row][col]).toBeNull();
        }
      }
    });

    it('後手の0行目に正しい駒配置がある', () => {
      const expectedPieces = [
        'kyou',
        'keima',
        'gin',
        'kin',
        'ou',
        'kin',
        'gin',
        'keima',
        'kyou',
      ];
      expectedPieces.forEach((expectedType, col) => {
        const piece = INITIAL_BOARD[0][col];
        expect(piece).not.toBeNull();
        expect(piece?.type).toBe(expectedType);
        expect(piece?.isFirstPlayer).toBe(false);
      });
    });

    it('先手の8行目に正しい駒配置がある', () => {
      const expectedPieces = [
        'kyou',
        'keima',
        'gin',
        'kin',
        'ou',
        'kin',
        'gin',
        'keima',
        'kyou',
      ];
      expectedPieces.forEach((expectedType, col) => {
        const piece = INITIAL_BOARD[8][col];
        expect(piece).not.toBeNull();
        expect(piece?.type).toBe(expectedType);
        expect(piece?.isFirstPlayer).toBe(true);
      });
    });
  });
});
