import type { PieceType } from '../types/piece';

/**
 * 駒の表示用文字マッピング
 */
export const PIECE_DISPLAY_MAP: Record<PieceType, string> = {
  ou: '王将',
  hisha: '飛車',
  kaku: '角行',
  kin: '金将',
  gin: '銀将',
  keima: '桂馬',
  kyou: '香車',
  fu: '歩兵',
} as const;
