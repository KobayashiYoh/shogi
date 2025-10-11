/**
 * 駒の種類を表す型
 */
export type PieceType =
  | 'ou'
  | 'hisha'
  | 'kaku'
  | 'kin'
  | 'gin'
  | 'keima'
  | 'kyou'
  | 'fu';

/**
 * 駒の情報
 */
export interface Piece {
  type: PieceType;
  isFirstPlayer: boolean;
}

/**
 * 将棋盤の有効な座標値（0-8）
 */
export type BoardIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * 盤面の位置（0-8の座標）
 */
export interface Position {
  row: BoardIndex;
  col: BoardIndex;
}
