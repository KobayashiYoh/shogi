import type { Piece } from './piece';

/**
 * 盤面の状態（9x9のマス、各マスには駒があるかnull）
 */
export type Board = (Piece | null)[][];
