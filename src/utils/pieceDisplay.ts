import type { PieceType } from '../types/piece';
import { PIECE_DISPLAY_MAP } from '../constants/pieceDisplay';

/**
 * 駒の種類から表示文字を取得
 * @param pieceType 駒の種類
 * @returns 表示用の文字
 */
export const getPieceDisplayText = (pieceType: PieceType): string => {
  return PIECE_DISPLAY_MAP[pieceType] || pieceType;
};
