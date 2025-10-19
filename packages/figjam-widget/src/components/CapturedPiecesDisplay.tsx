/** @jsx figma.widget.h */

import type { PieceType } from 'shogi-core';
import type { CapturedPiecesDisplayProps } from '../types';
import { PieceDisplay } from './PieceDisplay';

const { AutoLayout, Text } = figma.widget;

/**
 * 持ち駒表示コンポーネント
 */
export function CapturedPiecesDisplay({ pieces }: CapturedPiecesDisplayProps) {
  const pieceCounts = pieces.reduce((acc, pieceType) => {
    acc[pieceType] = (acc[pieceType] || 0) + 1;
    return acc;
  }, {} as Record<PieceType, number>);

  const uniquePieces = Object.keys(pieceCounts) as PieceType[];

  return (
    <AutoLayout
      direction="vertical"
      spacing={8}
      horizontalAlignItems="start"
      verticalAlignItems="start"
    >
      {uniquePieces.map((pieceType) => (
        <AutoLayout
          key={pieceType}
          direction="horizontal"
          spacing={8}
          horizontalAlignItems="center"
          verticalAlignItems="center"
        >
          <PieceDisplay piece={{ type: pieceType, isFirstPlayer: true }} />
          {pieceCounts[pieceType] > 1 && (
            <Text fontSize={16} fill="#FFFFFF">
              ×{pieceCounts[pieceType]}
            </Text>
          )}
        </AutoLayout>
      ))}
    </AutoLayout>
  );
}
