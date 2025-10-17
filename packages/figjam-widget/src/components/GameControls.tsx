import { hexToRgb } from "../utils/colorUtils";

const { widget } = figma;
const { AutoLayout, Text } = widget;

/**
 * ゲームコントロールコンポーネント
 */
export interface GameControlsProps {
  onReset: () => void;
  isGameOver: boolean;
}

/**
 * ゲームコントロール（リセットボタンなど）
 */
export const GameControls = ({ onReset, isGameOver }: GameControlsProps) => {
  return (
    <AutoLayout
      direction="horizontal"
      spacing={12}
      horizontalAlignItems="center"
    >
      <AutoLayout
        onClick={onReset}
        direction="vertical"
        horizontalAlignItems="center"
        padding={12}
        fill="#FFFFFF"
        cornerRadius={8}
        stroke={hexToRgb("#333333")}
        strokeWidth={1}
        hoverStyle={{
          fill: "#F0F0F0",
        }}
      >
        <Text fontSize={16} fontWeight={600} fill="#333333">
          {isGameOver ? "新しいゲーム" : "リセット"}
        </Text>
      </AutoLayout>
    </AutoLayout>
  );
};
