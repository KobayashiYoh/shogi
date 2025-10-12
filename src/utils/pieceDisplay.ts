import type { PieceType } from '../types';

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
  ryuou: '竜王',
  ryuuma: '竜馬',
  narigin: '成銀',
  narikei: '成桂',
  narikyo: '成香',
  tokin: 'と金',
} as const;

/**
 * 駒の種類から表示文字を取得
 * @param pieceType 駒の種類
 * @returns 表示用の文字
 */
export const getPieceDisplayText = (pieceType: PieceType): string => {
  return PIECE_DISPLAY_MAP[pieceType] || pieceType;
};
