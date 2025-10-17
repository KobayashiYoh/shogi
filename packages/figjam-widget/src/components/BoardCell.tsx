import type { Piece as PieceType, Position } from "@shogi/core";
import { Piece } from "./Piece";
import { BOARD_BACKGROUND, BOARD_STROKE } from "../constants/colors";

const { AutoLayout } = widget;

export interface BoardCellProps {
  position: Position;
  piece: PieceType | null;
  isSelected: boolean;
  onClick: (pos: Position) => void;
}

/**
 * 盤面のマスを表示するコンポーネント
 */
export const BoardCell = ({
  position,
  piece,
  isSelected,
  onClick,
}: BoardCellProps) => {
  const cellSize = 80;
  const backgroundColor = isSelected ? "#FFD700" : BOARD_BACKGROUND;
  const borderColor = BOARD_STROKE;

  return (
    <AutoLayout
      onClick={() => {
        onClick(position);
      }}
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      width={cellSize}
      height={cellSize}
      fill={backgroundColor}
      stroke={borderColor}
      strokeWidth={1}
    >
      {piece && <Piece piece={piece} />}
    </AutoLayout>
  );
};
