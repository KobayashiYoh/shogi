/** @jsx figma.widget.h */

import type { Board as BoardType, PieceType, Position } from 'shogi-core';
import { LAYOUT } from '../constants';
import { CapturedPiecesArea } from './CapturedPiecesArea';
import { Board } from './Board';

const { AutoLayout } = figma.widget;

/**
 * ゲームレイアウトのProps
 */
export interface GameLayoutProps {
  board: BoardType;
  firstPlayerCapturedPieces: PieceType[];
  secondPlayerCapturedPieces: PieceType[];
  selectedPos?: Position | null;
  onCellClick?: (row: number, col: number) => void;
}

/**
 * ゲームレイアウトコンポーネント（盤面と持ち駒エリア）
 */
export function GameLayout({
  board,
  firstPlayerCapturedPieces,
  secondPlayerCapturedPieces,
  selectedPos = null,
  onCellClick = () => {},
}: GameLayoutProps) {
  return (
    <AutoLayout
      direction="horizontal"
      width={LAYOUT.WIDTH}
      height={LAYOUT.HEIGHT}
    >
      <CapturedPiecesArea pieces={secondPlayerCapturedPieces} isFirstPlayer={false} />
      <Board board={board} selectedPos={selectedPos} onCellClick={onCellClick} />
      <CapturedPiecesArea pieces={firstPlayerCapturedPieces} isFirstPlayer={true} />
    </AutoLayout>
  );
}
