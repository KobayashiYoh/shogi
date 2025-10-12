import { describe, it, expect } from 'vitest';
import {
  addCapturedPiece,
  removeCapturedPiece,
} from '../utils/capturedPiecesLogic';
import type { PieceType } from '../types';

describe('capturedPiecesLogic', () => {
  describe('addCapturedPiece', () => {
    it('持ち駒リストに駒を追加できる', () => {
      const capturedPieces: PieceType[] = ['fu', 'kin'];

      const result = addCapturedPiece(capturedPieces, 'gin');

      expect(result).toEqual(['fu', 'kin', 'gin']);
    });

    it('空の持ち駒リストに駒を追加できる', () => {
      const capturedPieces: PieceType[] = [];

      const result = addCapturedPiece(capturedPieces, 'fu');

      expect(result).toEqual(['fu']);
    });

    it('元の配列を変更しない', () => {
      const capturedPieces: PieceType[] = ['fu'];

      addCapturedPiece(capturedPieces, 'kin');

      expect(capturedPieces).toEqual(['fu']);
    });
  });

  describe('removeCapturedPiece', () => {
    it('持ち駒リストから駒を削除できる', () => {
      const capturedPieces: PieceType[] = ['fu', 'kin', 'gin'];

      const result = removeCapturedPiece(capturedPieces, 'kin');

      expect(result).toEqual(['fu', 'gin']);
    });

    it('同じ駒が複数ある場合は1つだけ削除する', () => {
      const capturedPieces: PieceType[] = ['fu', 'fu', 'kin'];

      const result = removeCapturedPiece(capturedPieces, 'fu');

      expect(result).toEqual(['fu', 'kin']);
    });

    it('存在しない駒を削除しようとしても何も変わらない', () => {
      const capturedPieces: PieceType[] = ['fu', 'kin'];

      const result = removeCapturedPiece(capturedPieces, 'hisha');

      expect(result).toEqual(['fu', 'kin']);
    });

    it('元の配列を変更しない', () => {
      const capturedPieces: PieceType[] = ['fu', 'kin'];

      removeCapturedPiece(capturedPieces, 'fu');

      expect(capturedPieces).toEqual(['fu', 'kin']);
    });
  });
});
