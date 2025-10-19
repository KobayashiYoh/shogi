/** @jsx figma.widget.h */

import { CELL_SIZE, COLORS, LAYOUT } from '../constants';
import type { PlayingPageProps } from '../types';
import { CapturedPiecesDisplay } from './CapturedPiecesDisplay';
import { PieceDisplay } from './PieceDisplay';

const { AutoLayout, Text, SVG } = figma.widget;

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

      {/* 成り選択ダイアログ */}
      {pendingMove && (
        <AutoLayout
          positioning="absolute"
          x={LAYOUT.WIDTH / 2 - 150}
          y={LAYOUT.HEIGHT / 2 - 100}
          direction="vertical"
          spacing={20}
          padding={30}
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth={2}
          cornerRadius={12}
          effect={{
            type: 'drop-shadow',
            color: { r: 0, g: 0, b: 0, a: 0.25 },
            offset: { x: 0, y: 4 },
            blur: 8,
          }}
        >
          <Text
            fontSize={24}
            fontWeight={700}
            fill="#000000"
            horizontalAlignText="center"
          >
            駒を成りますか？
          </Text>

          <AutoLayout direction="horizontal" spacing={20}>
            <AutoLayout
              padding={{ vertical: 12, horizontal: 24 }}
              fill="#4CAF50"
              cornerRadius={8}
              onClick={() => onPromotionChoice(true)}
            >
              <Text fontSize={18} fontWeight={600} fill="#FFFFFF">
                はい
              </Text>
            </AutoLayout>

            <AutoLayout
              padding={{ vertical: 12, horizontal: 24 }}
              fill="#F44336"
              cornerRadius={8}
              onClick={() => onPromotionChoice(false)}
            >
              <Text fontSize={18} fontWeight={600} fill="#FFFFFF">
                いいえ
              </Text>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      )}
    </AutoLayout>
  );
}
