/** @jsx figma.widget.h */

import type {
  Board as BoardType,
  GameMode,
  GameResult,
  PieceType,
  Position,
} from "shogi-core";
import { LAYOUT } from "../constants";
import { CapturedPiecesArea } from "./CapturedPiecesArea";
import { Board } from "./Board";

const { AutoLayout } = figma.widget;

/**
 * ゲームレイアウトのProps
 */
export interface GameLayoutProps {
  board: BoardType;
  firstPlayerCapturedPieces: PieceType[];
  secondPlayerCapturedPieces: PieceType[];
  selectedPos?: Position | null;
  possibleMoves?: Position[];
  selectedCapturedPiece?: PieceType | null;
  isFirstPlayerTurn?: boolean;
  isBlurred: boolean;
  onCellClick?: (row: number, col: number) => void;
  onCapturedPieceClick?: (pieceType: PieceType) => void;
}

/**
 * ゲームレイアウトコンポーネント（盤面と持ち駒エリア）
 */
export function GameLayout({
  board,
  firstPlayerCapturedPieces,
  secondPlayerCapturedPieces,
  selectedPos = null,
  possibleMoves = [],
  selectedCapturedPiece = null,
  isFirstPlayerTurn = true,
  isBlurred,
  onCellClick = () => {},
  onCapturedPieceClick = () => {},
}: GameLayoutProps) {
  return (
    <AutoLayout
      direction="horizontal"
      width={LAYOUT.WIDTH}
      height={LAYOUT.HEIGHT}
      effect={{ type: "layer-blur", blur: isBlurred ? 8 : 0 }}
    >
      <AutoLayout direction="vertical" height="fill-parent">
        <CapturedPiecesArea
          pieces={secondPlayerCapturedPieces}
          isFirstPlayer={false}
          selectedPiece={!isFirstPlayerTurn ? selectedCapturedPiece : null}
          onPieceClick={!isFirstPlayerTurn ? onCapturedPieceClick : undefined}
        />
        <AutoLayout height="fill-parent" />
      </AutoLayout>
      <Board
        board={board}
        selectedPos={selectedPos}
        possibleMoves={possibleMoves}
        onCellClick={onCellClick}
      />
      <AutoLayout direction="vertical" height="fill-parent">
        <AutoLayout height="fill-parent" />
        <CapturedPiecesArea
          pieces={firstPlayerCapturedPieces}
          isFirstPlayer={true}
          selectedPiece={isFirstPlayerTurn ? selectedCapturedPiece : null}
          onPieceClick={isFirstPlayerTurn ? onCapturedPieceClick : undefined}
        />
      </AutoLayout>
    </AutoLayout>
  );
}
