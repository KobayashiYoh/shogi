/** @jsx figma.widget.h */

import { LAYOUT } from '../constants';

const { AutoLayout, Text } = figma.widget;

/**
 * 成り選択ダイアログのプロパティ
 */
export interface PromotionDialogProps {
  onPromotionChoice: (shouldPromote: boolean) => void;
}

/**
 * 成り選択ダイアログコンポーネント
 */
export function PromotionDialog({ onPromotionChoice }: PromotionDialogProps) {
  return (
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
        type: "drop-shadow",
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
        Promote piece?
      </Text>

      <AutoLayout direction="horizontal" spacing={20}>
        <AutoLayout
          padding={{ vertical: 12, horizontal: 24 }}
          fill="#4CAF50"
          cornerRadius={8}
          onClick={() => onPromotionChoice(true)}
        >
          <Text fontSize={18} fontWeight={600} fill="#FFFFFF">
            Yes
          </Text>
        </AutoLayout>

        <AutoLayout
          padding={{ vertical: 12, horizontal: 24 }}
          fill="#F44336"
          cornerRadius={8}
          onClick={() => onPromotionChoice(false)}
        >
          <Text fontSize={18} fontWeight={600} fill="#FFFFFF">
            No
          </Text>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}
