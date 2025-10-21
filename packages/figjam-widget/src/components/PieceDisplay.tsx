/** @jsx figma.widget.h */

import type { PieceType } from 'shogi-core';
import { PIECE_IMAGES } from '../constants';

const { AutoLayout, Image, Text } = figma.widget;

/**
 * 駒表示コンポーネントのProps
 */
export interface PieceDisplayProps {
  piece: { type: PieceType; isFirstPlayer: boolean };
  disableRotation?: boolean;
  count?: number;
}

/**
 * 駒表示コンポーネント
 */
export function PieceDisplay({ piece, disableRotation = false, count }: PieceDisplayProps) {
  const imageData = PIECE_IMAGES[piece.type];

  return (
    <AutoLayout
      width={60}
      height={60}
      horizontalAlignItems="center"
      verticalAlignItems="center"
      rotation={disableRotation ? 0 : (piece.isFirstPlayer ? 0 : 180)}
    >
      <Image src={imageData} width={60} height={60} />
      {count !== undefined && count > 1 && (
        <Text
          fontSize={16}
          fill="#FFFFFF"
          fontWeight={700}
          positioning="absolute"
          x={40}
          y={40}
          rotation={piece.isFirstPlayer ? 0 : 180}
          stroke="#333333"
          strokeWidth={2}
        >
          ×{count}
        </Text>
      )}
    </AutoLayout>
  );
}
