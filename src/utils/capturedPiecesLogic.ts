import type { PieceType } from '../types/piece';

/**
 * 持ち駒リストに駒を追加する
 */
export const addCapturedPiece = (
  capturedPieces: PieceType[],
  pieceType: PieceType
): PieceType[] => {
  return [...capturedPieces, pieceType];
};

/**
 * 持ち駒リストから駒を1つ削除する
 */
export const removeCapturedPiece = (
  capturedPieces: PieceType[],
  pieceType: PieceType
): PieceType[] => {
  const newList = [...capturedPieces];
  const index = newList.indexOf(pieceType);
  if (index > -1) {
    newList.splice(index, 1);
  }
  return newList;
};
