import type { Piece as PieceType, Position } from "@shogi/core";
import { PIECE_DISPLAY_MAP } from "@shogi/core";
import { BOARD_BACKGROUND, BOARD_STROKE } from "../constants/colors";
import { hexToRgb } from "../utils/colorUtils";

const { widget } = figma;
const { AutoLayout, Text } = widget;

/**
 * 盤面のセルコンポーネント
 */
export interface BoardCellProps {
  position: Position;
  piece: PieceType | null;
  isSelected: boolean;
  onClick: (pos: Position) => void;
}

const CELL_SIZE = 80;
const SELECTED_CELL_COLOR = "#FFD700";

/**
 * 盤面のセル
 */
export const BoardCell = ({
  position,
  piece,
  isSelected,
  onClick,
}: BoardCellProps) => {
  const backgroundColor = isSelected ? SELECTED_CELL_COLOR : BOARD_BACKGROUND;

  return (
    <AutoLayout
      onClick={() => {
        onClick(position);
      }}
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      width={CELL_SIZE}
      height={CELL_SIZE}
      fill={backgroundColor}
      stroke={hexToRgb(BOARD_STROKE)}
      strokeWidth={1}
    >
      {piece && (
        <Text fontSize={32} fill="#000000">
          {PIECE_DISPLAY_MAP[piece.type]}
        </Text>
      )}
    </AutoLayout>
  );
};
