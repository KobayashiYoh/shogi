import { hexToRgb } from "../utils/colorUtils";

const { AutoLayout, Text } = widget;

/**
 * ゲーム情報コンポーネント
 */
export interface GameInfoProps {
  isFirstPlayerTurn: boolean;
  isGameOver: boolean;
  winner: boolean | null;
}

/**
 * メッセージとテキスト色を取得
 */
const getGameInfoDisplay = (
  isGameOver: boolean,
  winner: boolean | null,
  isFirstPlayerTurn: boolean
): { message: string; textColor: string } => {
  if (isGameOver && winner !== null) {
    const message = winner ? "先手の勝ち！" : "後手の勝ち！";
    const textColor = winner ? "#0000FF" : "#FF0000";
    return { message, textColor };
  }

  const message = isFirstPlayerTurn ? "先手の番" : "後手の番";
  const textColor = isFirstPlayerTurn ? "#0000FF" : "#FF0000";
  return { message, textColor };
};

/**
 * ゲーム情報表示
 */
export const GameInfo = ({
  isFirstPlayerTurn,
  isGameOver,
  winner,
}: GameInfoProps) => {
  const { message, textColor } = getGameInfoDisplay(
    isGameOver,
    winner,
    isFirstPlayerTurn
  );

  return (
    <AutoLayout
      direction="vertical"
      horizontalAlignItems="center"
      padding={16}
      fill="#000000"
      cornerRadius={8}
      stroke={hexToRgb("#333333")}
      strokeWidth={2}
    >
      <Text fontSize={24} fontWeight={700} fill={textColor}>
        {message}
      </Text>
    </AutoLayout>
  );
};
