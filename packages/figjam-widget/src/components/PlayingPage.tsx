/** @jsx figma.widget.h */

import type { Board as BoardType, PieceType, Position } from 'shogi-core';
import { LAYOUT } from "../constants";
import { GameLayout } from "./GameLayout";
import { PromotionDialog } from "./PromotionDialog";

const { AutoLayout } = figma.widget;

/**
 * ゲームプレイページのProps
 */
export interface PlayingPageProps {
  board: BoardType;
  firstPlayerCapturedPieces: PieceType[];
  secondPlayerCapturedPieces: PieceType[];
  selectedPos: Position | null;
  pendingMove: { from: Position; to: Position } | null;
  onCellClick: (row: number, col: number) => void;
  onPromotionChoice: (shouldPromote: boolean) => void;
}

/**
 * ゲームプレイページ
 */
export function PlayingPage({
  board,
  firstPlayerCapturedPieces,
  secondPlayerCapturedPieces,
  selectedPos,
  pendingMove,
  onCellClick,
  onPromotionChoice,
}: PlayingPageProps) {
  return (
    <AutoLayout
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      width={LAYOUT.WIDTH}
      height={LAYOUT.HEIGHT}
    >
      <GameLayout
        board={board}
        firstPlayerCapturedPieces={firstPlayerCapturedPieces}
        secondPlayerCapturedPieces={secondPlayerCapturedPieces}
        selectedPos={selectedPos}
        onCellClick={onCellClick}
      />

      {pendingMove && <PromotionDialog onPromotionChoice={onPromotionChoice} />}
    </AutoLayout>
  );
}
