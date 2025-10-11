import { describe, it, expect } from 'vitest';
import {
  isValidPosition,
  createPosition,
  InvalidPositionError,
} from '../utils/createPosition';

describe('positionUtils', () => {
  describe('isValidPosition', () => {
    it('有効な座標範囲内の場合はtrue', () => {
      expect(isValidPosition(0, 0)).toBe(true);
      expect(isValidPosition(4, 4)).toBe(true);
      expect(isValidPosition(8, 8)).toBe(true);
      expect(isValidPosition(0, 8)).toBe(true);
      expect(isValidPosition(8, 0)).toBe(true);
    });

    it('座標が負の値の場合はfalse', () => {
      expect(isValidPosition(-1, 0)).toBe(false);
      expect(isValidPosition(0, -1)).toBe(false);
      expect(isValidPosition(-1, -1)).toBe(false);
    });

    it('座標が8を超える場合はfalse', () => {
      expect(isValidPosition(9, 0)).toBe(false);
      expect(isValidPosition(0, 9)).toBe(false);
      expect(isValidPosition(9, 9)).toBe(false);
      expect(isValidPosition(10, 5)).toBe(false);
    });

    it('境界値の場合', () => {
      expect(isValidPosition(0, 0)).toBe(true);
      expect(isValidPosition(8, 8)).toBe(true);
      expect(isValidPosition(-1, 0)).toBe(false);
      expect(isValidPosition(0, -1)).toBe(false);
      expect(isValidPosition(9, 0)).toBe(false);
      expect(isValidPosition(0, 9)).toBe(false);
    });
  });

  describe('createPosition', () => {
    it('有効な座標の場合はPositionオブジェクトを返す', () => {
      const position = createPosition(4, 5);
      expect(position).toEqual({ row: 4, col: 5 });
    });

    it('境界値の場合はPositionオブジェクトを返す', () => {
      expect(createPosition(0, 0)).toEqual({ row: 0, col: 0 });
      expect(createPosition(8, 8)).toEqual({ row: 8, col: 8 });
      expect(createPosition(0, 8)).toEqual({ row: 0, col: 8 });
      expect(createPosition(8, 0)).toEqual({ row: 8, col: 0 });
    });

    it('無効な座標の場合はInvalidPositionErrorをthrowする', () => {
      expect(() => createPosition(-1, 0)).toThrow(InvalidPositionError);
      expect(() => createPosition(0, -1)).toThrow(InvalidPositionError);
      expect(() => createPosition(9, 0)).toThrow(InvalidPositionError);
      expect(() => createPosition(0, 9)).toThrow(InvalidPositionError);
      expect(() => createPosition(-1, -1)).toThrow(InvalidPositionError);
      expect(() => createPosition(10, 10)).toThrow(InvalidPositionError);
    });

    it('片方が有効でも片方が無効な場合はInvalidPositionErrorをthrowする', () => {
      expect(() => createPosition(5, -1)).toThrow(InvalidPositionError);
      expect(() => createPosition(-1, 5)).toThrow(InvalidPositionError);
      expect(() => createPosition(5, 9)).toThrow(InvalidPositionError);
      expect(() => createPosition(9, 5)).toThrow(InvalidPositionError);
    });
  });
});
