import type { Position, BoardIndex } from '../types/piece';

/**
 * Positionの値が有効な範囲内かチェック
 */
export const isValidPosition = (row: number, col: number): boolean => {
  const minBoundary = 0;
  const maxBoundary = 8;

  const isRowValid = row >= minBoundary && row <= maxBoundary;
  const isColValid = col >= minBoundary && col <= maxBoundary;

  return isRowValid && isColValid;
};

/**
 * 無効なPositionが渡されたときに投げるエラー
 */
export class InvalidPositionError extends Error {
  constructor(row: number, col: number) {
    super(`Invalid position: row=${row}, col=${col}`);
    this.name = 'InvalidPositionError';
  }
}

/**
 * 安全なPosition作成関数
 * @throws {InvalidPositionError} 無効な座標が渡された場合
 */
export const createPosition = (row: number, col: number): Position => {
  if (!isValidPosition(row, col)) {
    throw new InvalidPositionError(row, col);
  }
  return { row: row as BoardIndex, col: col as BoardIndex };
};
