/** @jsx figma.widget.h */

import { COLORS, LAYOUT } from '../constants';
import type { ModeSelectionPageProps } from '../types';

const { AutoLayout, Text, Rectangle } = figma.widget;

/**
 * モード選択ページ
 */
export function ModeSelectionPage({
  onSelectGameMode,
}: ModeSelectionPageProps) {
  return (
    <AutoLayout
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      width={LAYOUT.WIDTH}
      height={LAYOUT.HEIGHT}
      fill={COLORS.BACKGROUND}
    >
      {/* 背景将棋盤（デザインに従う） */}
      <AutoLayout
        direction="horizontal"
        width={LAYOUT.WIDTH}
        height={LAYOUT.HEIGHT}
        horizontalAlignItems="center"
        verticalAlignItems="center"
      >
        {/* 左側の持ち駒エリア（ダークブラウン） */}
        <Rectangle
          width={LAYOUT.CAPTURED_PIECES_AREA_WIDTH}
          height={LAYOUT.HEIGHT}
          fill={COLORS.CAPTURED_AREA}
        />

        {/* 中央エリア */}
        <AutoLayout
          direction="vertical"
          width={LAYOUT.BOARD_AREA_WIDTH}
          height={LAYOUT.HEIGHT}
        >
          {/* 上部の将棋盤エリア */}
          <Rectangle
            width={LAYOUT.BOARD_AREA_WIDTH}
            height={247}
            fill={COLORS.BOARD}
          />

          {/* 中央のモーダルエリア */}
          <AutoLayout
            direction="vertical"
            width={LAYOUT.BOARD_AREA_WIDTH}
            height={316}
            fill={COLORS.MODAL}
            horizontalAlignItems="center"
            verticalAlignItems="center"
            spacing={32}
            padding={{ vertical: 56, horizontal: 32 }}
          >
            <Text fontSize={32} fill={COLORS.TEXT_WHITE} fontWeight={700}>
              Select game mode
            </Text>

            <AutoLayout direction="horizontal" spacing={24}>
              {/* 1 Player ボタン */}
              <AutoLayout
                direction="vertical"
                width={160}
                height={136}
                fill={COLORS.TEXT_WHITE}
                cornerRadius={12}
                horizontalAlignItems="center"
                verticalAlignItems="center"
                spacing={8}
                padding={16}
                onClick={() => onSelectGameMode('cpu')}
              >
                <Text fontSize={24} fill={COLORS.TEXT_BLACK} fontWeight={600}>
                  1 Player
                </Text>
                <Text fontSize={14} fill={COLORS.TEXT_GRAY}>
                  vs CPU
                </Text>
              </AutoLayout>

              {/* 2 Player ボタン */}
              <AutoLayout
                direction="vertical"
                width={160}
                height={136}
                fill={COLORS.TEXT_WHITE}
                cornerRadius={12}
                horizontalAlignItems="center"
                verticalAlignItems="center"
                spacing={8}
                padding={16}
                onClick={() => onSelectGameMode('two-player')}
              >
                <Text fontSize={24} fill={COLORS.TEXT_BLACK} fontWeight={600}>
                  2 Player
                </Text>
                <Text fontSize={14} fill={COLORS.TEXT_GRAY}>
                  vs Player
                </Text>
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>

          {/* 下部の将棋盤エリア */}
          <Rectangle
            width={LAYOUT.BOARD_AREA_WIDTH}
            height={247}
            fill={COLORS.BOARD}
          />
        </AutoLayout>

        {/* 右側の持ち駒エリア（ダークブラウン） */}
        <Rectangle
          width={LAYOUT.CAPTURED_PIECES_AREA_WIDTH}
          height={LAYOUT.HEIGHT}
          fill={COLORS.CAPTURED_AREA}
        />
      </AutoLayout>
    </AutoLayout>
  );
}
