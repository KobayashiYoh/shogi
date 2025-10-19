/** @jsx figma.widget.h */

import type { Board as BoardType, Position } from 'shogi-core';
import { COLORS, LAYOUT } from '../constants';
import { PieceDisplay } from './PieceDisplay';

const { AutoLayout } = figma.widget;

/**
 * 将棋盤のプロパティ
 */
export interface BoardProps {
  board: BoardType;
  selectedPos: Position | null;
  onCellClick: (row: number, col: number) => void;
}

/**
 * 将棋盤コンポーネント
 */
export function Board({ board, selectedPos, onCellClick }: BoardProps) {
  return (
    <AutoLayout
      direction="vertical"
      width={LAYOUT.BOARD_AREA_WIDTH}
      height={LAYOUT.BOARD_AREA_HEIGHT}
      fill={COLORS.BOARD}
      horizontalAlignItems="center"
      verticalAlignItems="center"
      padding={{ vertical: 63, horizontal: 0 }}
    >
      <AutoLayout direction="vertical" spacing={0}>
        {board.map((row, rowIndex: number) => (
          <AutoLayout key={rowIndex} direction="horizontal" spacing={0}>
            {row.map((piece, colIndex: number) => {
              const isSelected =
                selectedPos !== null &&
                selectedPos.row === rowIndex &&
                selectedPos.col === colIndex;

              return (
                <AutoLayout
                  key={`${rowIndex}-${colIndex}`}
                  width={LAYOUT.CELL_SIZE}
                  height={LAYOUT.CELL_SIZE}
                  fill={isSelected ? COLORS.SELECTED_CELL : COLORS.BOARD}
                  stroke={COLORS.BOARD_STROKE}
                  strokeWidth={1}
                  horizontalAlignItems="center"
                  verticalAlignItems="center"
                  onClick={() => onCellClick(rowIndex, colIndex)}
                >
                  {piece && <PieceDisplay piece={piece} />}
                </AutoLayout>
              );
            })}
          </AutoLayout>
        ))}
      </AutoLayout>
    </AutoLayout>
  );
}
