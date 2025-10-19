/** @jsx figma.widget.h */

import { CELL_SIZE, COLORS, LAYOUT } from '../constants';
import type { PlayingPageProps } from '../types';
import { CapturedPiecesDisplay } from './CapturedPiecesDisplay';
import { PieceDisplay } from './PieceDisplay';

const { AutoLayout } = figma.widget;

/**
 * ゲームプレイページ
 */
export function PlayingPage({
  board,
  firstPlayerCapturedPieces,
  secondPlayerCapturedPieces,
  selectedPos,
  onCellClick,
}: PlayingPageProps) {
  return (
    <AutoLayout
      direction="horizontal"
      width={LAYOUT.WIDTH}
      height={LAYOUT.HEIGHT}
      fill={COLORS.BACKGROUND}
      horizontalAlignItems="center"
      verticalAlignItems="center"
    >
      {/* 左側持ち駒エリア（先手） */}
      <AutoLayout
        direction="vertical"
        width={LAYOUT.CAPTURED_PIECES_AREA_WIDTH}
        height={LAYOUT.HEIGHT}
        fill={COLORS.CAPTURED_AREA}
        horizontalAlignItems="center"
        verticalAlignItems="center"
        padding={16}
      >
        <CapturedPiecesDisplay pieces={secondPlayerCapturedPieces} />
      </AutoLayout>

      {/* 中央将棋盤エリア */}
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
                    width={CELL_SIZE}
                    height={CELL_SIZE}
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

      {/* 右側持ち駒エリア（後手） */}
      <AutoLayout
        direction="vertical"
        width={LAYOUT.CAPTURED_PIECES_AREA_WIDTH}
        height={LAYOUT.HEIGHT}
        fill={COLORS.CAPTURED_AREA}
        horizontalAlignItems="center"
        verticalAlignItems="center"
        padding={16}
      >
        <CapturedPiecesDisplay pieces={firstPlayerCapturedPieces} />
      </AutoLayout>
    </AutoLayout>
  );
}
