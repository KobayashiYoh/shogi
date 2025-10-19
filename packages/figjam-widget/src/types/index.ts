import type { Board, GameMode, GameResult, PieceType, Position } from 'shogi-core';

/**
 * モード選択ページのProps
 */
export interface ModeSelectionPageProps {
  onSelectGameMode: (mode: GameMode) => void;
}

/**
 * ゲームプレイページのProps
 */
export interface PlayingPageProps {
  board: Board;
  firstPlayerCapturedPieces: PieceType[];
  secondPlayerCapturedPieces: PieceType[];
  selectedPos: Position | null;
  onCellClick: (row: number, col: number) => void;
}

/**
 * ゲーム終了ページのProps
 */
export interface ContinuePageProps {
  onQuit: () => void;
  onPlayAgain: () => void;
  firstPlayerCapturedPieces: PieceType[];
  secondPlayerCapturedPieces: PieceType[];
}

/**
 * 駒表示コンポーネントのProps
 */
export interface PieceDisplayProps {
  piece: { type: PieceType; isFirstPlayer: boolean };
}

/**
 * 持ち駒表示コンポーネントのProps
 */
export interface CapturedPiecesDisplayProps {
  pieces: PieceType[];
}

/**
 * 将棋ゲームの状態
 */
export interface ShogiGameState {
  gameMode: GameMode | null;
  board: Board;
  isFirstPlayerTurn: boolean;
  gameResult: GameResult;
  firstPlayerCapturedPieces: PieceType[];
  secondPlayerCapturedPieces: PieceType[];
  selectedPos: Position | null;
}
