import type { PieceType, Piece as PieceData } from "@shogi/core";
import { Piece } from "./Piece";
import { hexToRgb } from "../utils/colorUtils";

const { widget } = figma;
const { AutoLayout, Text } = widget;

export interface CapturedPiecesProps {
  capturedPieces: PieceType[];
  playerName: string;
  isFirstPlayer: boolean;
  selectedPiece: PieceType | null;
  onPieceClick: (pieceType: PieceType) => void;
}

/**
 * 持ち駒コンポーネント
 */
export const CapturedPieces = ({
  capturedPieces,
  playerName,
  isFirstPlayer,
  selectedPiece,
  onPieceClick,
}: CapturedPiecesProps) => {
  // 駒の種類ごとに集計
  const pieceCounts: Record<string, number> = {};
  for (const pieceType of capturedPieces) {
    pieceCounts[pieceType] = (pieceCounts[pieceType] || 0) + 1;
  }

  const uniquePieces = Array.from(new Set(capturedPieces));

  return (
    <AutoLayout
      direction="vertical"
      spacing={8}
      padding={12}
      fill="#4B281B"
      cornerRadius={8}
      stroke={hexToRgb("#333333")}
      strokeWidth={2}
    >
      <Text fontSize={16} fontWeight={600} fill="#FFFFFF">
        {playerName}の持ち駒
      </Text>
      {uniquePieces.length === 0 ? (
        <Text fontSize={14} fill="#999999">
          なし
        </Text>
      ) : (
        <AutoLayout direction="horizontal" spacing={4}>
          {uniquePieces.map((pieceType, index) => {
            const count = pieceCounts[pieceType];
            const isSelected = selectedPiece === pieceType;

            // 持ち駒用のPieceData型を作成
            const pieceData: PieceData = {
              type: pieceType,
              isFirstPlayer: isFirstPlayer,
            };

            return (
              <AutoLayout
                key={`${pieceType}-${index}`}
                onClick={() => {
                  onPieceClick(pieceType);
                }}
                direction="horizontal"
                spacing={4}
                horizontalAlignItems="center"
                verticalAlignItems="center"
              >
                {/* Pieceコンポーネントを使用 */}
                <Piece piece={pieceData} scale={0.8} isSelected={isSelected} />

                {/* 枚数表示 */}
                {count > 1 && (
                  <Text fontSize={16} fill="#FFFFFF" fontWeight={600}>
                    ×{count}
                  </Text>
                )}
              </AutoLayout>
            );
          })}
        </AutoLayout>
      )}
    </AutoLayout>
  );
};
