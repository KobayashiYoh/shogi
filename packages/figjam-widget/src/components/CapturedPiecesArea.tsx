/** @jsx figma.widget.h */

import type { PieceType } from "shogi-core";
import { PieceDisplay } from "./PieceDisplay";
import { COLORS, LAYOUT } from "../constants";

const { AutoLayout } = figma.widget;

/**
 * 持ち駒エリアコンポーネントのProps
 */
export interface CapturedPiecesAreaProps {
  pieces: PieceType[];
  isFirstPlayer: boolean;
  selectedPiece?: PieceType | null;
  onPieceClick?: (pieceType: PieceType) => void;
}

/**
 * 持ち駒エリアコンポーネント
 */
export function CapturedPiecesArea({
  pieces,
  isFirstPlayer,
  selectedPiece = null,
  onPieceClick = () => {}
}: CapturedPiecesAreaProps) {
  const pieceCounts = pieces.reduce((acc, pieceType) => {
    acc[pieceType] = (acc[pieceType] || 0) + 1;
    return acc;
  }, {} as Record<PieceType, number>);

  const uniquePieces = Object.keys(pieceCounts) as PieceType[];

  const rows: PieceType[][] = [];
  for (let i = 0; i < uniquePieces.length; i += 3) {
    rows.push(uniquePieces.slice(i, i + 3));
  }

  return (
    <AutoLayout
      direction="vertical"
      spacing={8}
      horizontalAlignItems="center"
      verticalAlignItems="center"
      fill={COLORS.CAPTURED_AREA}
      width={LAYOUT.CAPTURED_PIECES_AREA_WIDTH}
      height={LAYOUT.CAPTURED_PIECES_AREA_WIDTH}
      rotation={isFirstPlayer ? 0 : 180}
      padding={20}
    >
      {rows.map((row, rowIndex) => (
        <AutoLayout
          key={rowIndex}
          direction="horizontal"
          spacing={8}
          horizontalAlignItems="start"
          verticalAlignItems="start"
        >
          {row.map((pieceType) => {
            const isSelected = selectedPiece === pieceType;
            return (
              <AutoLayout
                key={pieceType}
                onClick={() => onPieceClick(pieceType)}
                opacity={isSelected ? 0.7 : 1}
              >
                <PieceDisplay
                  piece={{ type: pieceType, isFirstPlayer }}
                  disableRotation={true}
                  count={pieceCounts[pieceType]}
                />
              </AutoLayout>
            );
          })}
        </AutoLayout>
      ))}
    </AutoLayout>
  );
}
