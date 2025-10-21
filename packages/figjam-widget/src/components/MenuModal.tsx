/** @jsx figma.widget.h */

import { COLORS, LAYOUT } from "../constants";
import { MenuButton } from "./MenuButton";

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
  const MODAL_WIDTH = 720;
  const MODAL_HEIGHT = 400;

  return (
    <AutoLayout
      positioning="absolute"
      x={(LAYOUT.WIDTH - MODAL_WIDTH) / 2}
      y={(LAYOUT.HEIGHT - MODAL_HEIGHT) / 2}
      width={MODAL_WIDTH}
      height={MODAL_HEIGHT}
      fill={COLORS.MENU_BACKGROUND}
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
