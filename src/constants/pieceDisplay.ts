import type { PieceType } from '../types/piece';

/**
 * 駒の表示用文字マッピング
 */
export const PIECE_DISPLAY_MAP: Record<PieceType, string> = {
  ou: '王',
  hisha: '飛',
  kaku: '角',
  kin: '金',
  gin: '銀',
  keima: '桂',
  kyou: '香',
  fu: '歩',
} as const;
