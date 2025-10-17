import type { GameMode } from "@shogi/core";

const { widget } = figma;
const { AutoLayout, Text } = widget;

/**
 * モード選択コンポーネント
 */
export interface ModeSelectionProps {
  onModeSelect: (mode: GameMode) => void;
}

/**
 * モード選択画面
 */
export const ModeSelection = ({ onModeSelect }: ModeSelectionProps) => {
  return (
    <AutoLayout
      direction="vertical"
      spacing={40}
      padding={60}
      horizontalAlignItems="center"
      verticalAlignItems="center"
      fill="#000000"
      cornerRadius={16}
    >
      <Text fontSize={32} fontWeight={700} fill="#FFFFFF">
        将棋ゲーム
      </Text>
      <AutoLayout direction="horizontal" spacing={20}>
        <AutoLayout
          onClick={() => {
            onModeSelect("two-player");
          }}
          direction="vertical"
          horizontalAlignItems="center"
          verticalAlignItems="center"
          padding={20}
          width={160}
          height={160}
          fill="#FFFFFF"
          cornerRadius={16}
          hoverStyle={{
            fill: "#F0F0F0",
          }}
        >
          <Text fontSize={20} fontWeight={700} fill="#333333">
            2人対戦
          </Text>
          <Text fontSize={12} fontWeight={400} fill="#666666">
            友達と対戦
          </Text>
        </AutoLayout>
        <AutoLayout
          onClick={() => {
            onModeSelect("cpu");
          }}
          direction="vertical"
          horizontalAlignItems="center"
          verticalAlignItems="center"
          padding={20}
          width={160}
          height={160}
          fill="#FFFFFF"
          cornerRadius={16}
          hoverStyle={{
            fill: "#F0F0F0",
          }}
        >
          <Text fontSize={20} fontWeight={700} fill="#333333">
            CPU対戦
          </Text>
          <Text fontSize={12} fontWeight={400} fill="#666666">
            コンピュータと対戦
          </Text>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
};
