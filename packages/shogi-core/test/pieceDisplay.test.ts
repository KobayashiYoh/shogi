import { describe, it, expect } from 'vitest';
import { getPieceDisplayText } from '../src/utils/pieceDisplay';
import type { PieceType } from '../src/types';

describe('pieceDisplay', () => {
  describe('getPieceDisplayText', () => {
    it('王将の表示文字を取得', () => {
      const result = getPieceDisplayText('ou');
      expect(result).toBe('王将');
    });

    it('飛車の表示文字を取得', () => {
      const result = getPieceDisplayText('hisha');
      expect(result).toBe('飛車');
    });

    it('角行の表示文字を取得', () => {
      const result = getPieceDisplayText('kaku');
      expect(result).toBe('角行');
    });

    it('金将の表示文字を取得', () => {
      const result = getPieceDisplayText('kin');
      expect(result).toBe('金将');
    });

    it('銀将の表示文字を取得', () => {
      const result = getPieceDisplayText('gin');
      expect(result).toBe('銀将');
    });

    it('桂馬の表示文字を取得', () => {
      const result = getPieceDisplayText('keima');
      expect(result).toBe('桂馬');
    });

    it('香車の表示文字を取得', () => {
      const result = getPieceDisplayText('kyou');
      expect(result).toBe('香車');
    });

    it('歩兵の表示文字を取得', () => {
      const result = getPieceDisplayText('fu');
      expect(result).toBe('歩兵');
    });

    it('すべての駒の種類に対応する表示文字が存在する', () => {
      const pieceTypes: PieceType[] = [
        'ou',
        'hisha',
        'kaku',
        'kin',
        'gin',
        'keima',
        'kyou',
        'fu',
      ];

      pieceTypes.forEach((pieceType) => {
        const result = getPieceDisplayText(pieceType);
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });
});
