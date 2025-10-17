import type { BoardIndex, Board as BoardType, Position } from "@shogi/core";
import { BoardCell } from "./BoardCell";
import { hexToRgb } from "../utils/colorUtils";

const { AutoLayout } = widget;

/**
 * 将棋盤コンポーネント
 */
export interface BoardProps {
  board: BoardType;
  selectedPos: Position | null;
  onCellClick: (pos: Position) => void;
}

/**
 * 将棋盤
 */
export const Board = ({ board, selectedPos, onCellClick }: BoardProps) => {
  return (
    <AutoLayout
      direction="vertical"
      spacing={0}
      padding={10}
      fill="#B9823E"
      stroke={hexToRgb("#333333")}
      strokeWidth={1}
    >
      {board.map((row, rowIndex) => (
        <AutoLayout key={`row-${rowIndex}`} direction="horizontal" spacing={0}>
          {row.map((piece, colIndex) => {
            const position: Position = {
              row: rowIndex as BoardIndex,
              col: colIndex as BoardIndex,
            };
            const isSelected =
              selectedPos !== null &&
              selectedPos.row === rowIndex &&
              selectedPos.col === colIndex;

            return (
              <BoardCell
                key={`cell-${rowIndex}-${colIndex}`}
                position={position}
                piece={piece}
                isSelected={isSelected}
                onClick={onCellClick}
              />
            );
          })}
        </AutoLayout>
      ))}
    </AutoLayout>
  );
};
