import type { Piece as PieceType } from "@shogi/core";
import { PIECE_DISPLAY_MAP } from "@shogi/core";
import {
  PIECE_BACKGROUND,
  PIECE_STROKE,
  DEFAULT_PIECE_TEXT,
} from "../constants/colors";
import { hexToRgb } from "../utils/colorUtils";

const { AutoLayout, SVG } = widget;

const WIDTH = 64;
const HEIGHT = 68;
const TRIANGLE_HEIGHT = 16;
const STROKE_WIDTH = 1;
const FONT_SIZE = 32;

export interface PieceProps {
  piece: PieceType;
  scale?: number;
  isSelected?: boolean;
}

/**
 * 将棋の駒
 */
export const Piece = ({ piece, scale = 1, isSelected = false }: PieceProps) => {
  const width = WIDTH * scale;
  const height = HEIGHT * scale;
  const centerX = width / 2;
  const triangleHeight = TRIANGLE_HEIGHT * scale;
  const strokeWidth = STROKE_WIDTH * scale;
  const fontSize = FONT_SIZE * scale;

  // 五角形のSVG（駒の形状）+ テキストを含む
  const svgWithText = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <path d="M${centerX},0 L${width},${triangleHeight} L${width},${height} L0,${height} L0,${triangleHeight} Z"
          fill="${PIECE_BACKGROUND}"
          stroke="${isSelected ? "#FFD700" : PIECE_STROKE}"
          stroke-width="${isSelected ? 3 : strokeWidth}" />
    <text x="${centerX}"
          y="${height / 2 + fontSize / 3}"
          font-size="${fontSize}"
          fill="${DEFAULT_PIECE_TEXT}"
          text-anchor="middle"
          font-family="serif">${PIECE_DISPLAY_MAP[piece.type]}</text>
  </svg>`;

  return (
    <AutoLayout
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      rotation={piece.isFirstPlayer ? 0 : 180}
    >
      <SVG src={svgWithText} width={width} height={height} />
    </AutoLayout>
  );
};
