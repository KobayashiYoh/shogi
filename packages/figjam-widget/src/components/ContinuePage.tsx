/** @jsx figma.widget.h */

import { COLORS, LAYOUT } from '../constants';
import type { ContinuePageProps } from '../types';
import { CapturedPiecesDisplay } from './CapturedPiecesDisplay';

const { AutoLayout, Text, Rectangle } = figma.widget;

/**
 * ゲーム終了ページ
 */
export function ContinuePage({
  onQuit,
  onPlayAgain,
  firstPlayerCapturedPieces,
  secondPlayerCapturedPieces,
}: ContinuePageProps) {
  return (
    <AutoLayout
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      width={LAYOUT.WIDTH}
      height={LAYOUT.HEIGHT}
      fill={COLORS.BACKGROUND}
    >
      <AutoLayout
        direction="horizontal"
        width={LAYOUT.WIDTH}
        height={LAYOUT.HEIGHT}
        horizontalAlignItems="center"
        verticalAlignItems="center"
      >
        {/* 左側の持ち駒エリア */}
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
              Continue?
            </Text>

            <AutoLayout direction="horizontal" spacing={24}>
              {/* Quit ボタン */}
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
                onClick={onQuit}
              >
                <Text fontSize={24} fill={COLORS.TEXT_BLACK} fontWeight={600}>
                  Quit
                </Text>
                <Text
                  fontSize={12}
                  fill={COLORS.TEXT_GRAY}
                  horizontalAlignText="center"
                >
                  Back to game{'\n'}mode selection.
                </Text>
              </AutoLayout>

              {/* Play again ボタン */}
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
                onClick={onPlayAgain}
              >
                <Text fontSize={24} fill={COLORS.TEXT_BLACK} fontWeight={600}>
                  Play again
                </Text>
                <Text
                  fontSize={12}
                  fill={COLORS.TEXT_GRAY}
                  horizontalAlignText="center"
                >
                  Play again with{'\n'}the same mode.
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

        {/* 右側の持ち駒エリア */}
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
    </AutoLayout>
  );
}
