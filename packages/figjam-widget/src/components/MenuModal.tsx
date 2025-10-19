/** @jsx figma.widget.h */

import { COLORS, LAYOUT } from '../constants';
import { MenuButton } from './MenuButton';

const { AutoLayout, Text } = figma.widget;

/**
 * メニューモーダルのプロパティ
 */
export interface MenuModalProps {
  title: string;
  buttons: Array<{
    title: string;
    description: string;
    onClick: () => void;
  }>;
}

/**
 * メニューモーダルコンポーネント
 */
export function MenuModal({ title, buttons }: MenuModalProps) {
  return (
    <AutoLayout
      positioning="absolute"
      x={LAYOUT.CAPTURED_PIECES_AREA_WIDTH}
      y={0}
      width={LAYOUT.BOARD_AREA_WIDTH}
      height={LAYOUT.BOARD_AREA_HEIGHT}
      fill={{ r: 0.3, g: 0.5, b: 0.35, a: 0.9 }}
      horizontalAlignItems="center"
      verticalAlignItems="center"
    >
      <AutoLayout
        direction="vertical"
        horizontalAlignItems="center"
        verticalAlignItems="center"
        spacing={32}
        padding={{ vertical: 56, horizontal: 32 }}
      >
        <Text fontSize={32} fill={COLORS.TEXT_WHITE} fontWeight={700}>
          {title}
        </Text>

        <AutoLayout direction="horizontal" spacing={24}>
          {buttons.map((button, index) => (
            <MenuButton
              key={index}
              title={button.title}
              description={button.description}
              onClick={button.onClick}
            />
          ))}
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}
