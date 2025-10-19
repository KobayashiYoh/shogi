/** @jsx figma.widget.h */

import type { PieceType } from 'shogi-core';
import { PIECE_IMAGES } from '../constants';

const { AutoLayout, Image } = figma.widget;

/**
 * 駒表示コンポーネントのProps
 */
export interface PieceDisplayProps {
  piece: { type: PieceType; isFirstPlayer: boolean };
}

/**
 * 駒表示コンポーネント
 */
export function PieceDisplay({ piece }: PieceDisplayProps) {
  const imageData = PIECE_IMAGES[piece.type];

  return (
    <AutoLayout
      width={60}
      height={60}
      horizontalAlignItems="center"
      verticalAlignItems="center"
      rotation={piece.isFirstPlayer ? 0 : 180}
    >
      <Image src={imageData} width={60} height={60} />
    </AutoLayout>
  );
}
