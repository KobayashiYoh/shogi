import type { Piece, Position, PieceType } from './piece';
import type { GameResult } from './gameResult';

/**
 * 盤面の状態（9x9のマス、各マスには駒があるかnull）
 */
export type Board = (Piece | null)[][];

/**
 * ゲームの状態
 */
export interface GameState {
  board: Board;
  isFirstPlayerTurn: boolean;
  selectedPosition: Position | null;
  gameResult: GameResult;
  capturedPiecesByFirstPlayer: PieceType[];
  capturedPiecesBySecondPlayer: PieceType[];
}
