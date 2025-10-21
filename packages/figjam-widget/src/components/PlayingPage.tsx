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
  possibleMoves: Position[];
  selectedCapturedPiece: PieceType | null;
  isFirstPlayerTurn: boolean;
  pendingMove: { from: Position; to: Position } | null;
  onCellClick: (row: number, col: number) => void;
  onPromotionChoice: (shouldPromote: boolean) => void;
  onCapturedPieceClick: (pieceType: PieceType) => void;
}

/**
 * ゲームプレイページ
 */
export function PlayingPage({
  board,
  firstPlayerCapturedPieces,
  secondPlayerCapturedPieces,
  selectedPos,
  possibleMoves,
  selectedCapturedPiece,
  isFirstPlayerTurn,
  pendingMove,
  onCellClick,
  onPromotionChoice,
  onCapturedPieceClick,
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
        possibleMoves={possibleMoves}
        selectedCapturedPiece={selectedCapturedPiece}
        isFirstPlayerTurn={isFirstPlayerTurn}
        isBlurred={false}
        onCellClick={onCellClick}
        onCapturedPieceClick={onCapturedPieceClick}
      />

      {pendingMove && <PromotionDialog onPromotionChoice={onPromotionChoice} />}
    </AutoLayout>
  );
}
