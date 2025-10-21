/** @jsx figma.widget.h */

import { COLORS } from '../constants';

const { AutoLayout, Text } = figma.widget;

/**
 * メニューボタンのプロパティ
 */
export interface MenuButtonProps {
  title: string;
  description: string;
  onClick: () => void;
}

/**
 * メニューボタンコンポーネント
 */
export function MenuButton({ title, description, onClick }: MenuButtonProps) {
  return (
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
      onClick={onClick}
    >
      <Text fontSize={24} fill={COLORS.TEXT_BLACK} fontWeight={600}>
        {title}
      </Text>
      <Text
        fontSize={description.length > 20 ? 12 : 14}
        fill={COLORS.TEXT_GRAY}
        horizontalAlignText="center"
      >
        {description}
      </Text>
    </AutoLayout>
  );
}
