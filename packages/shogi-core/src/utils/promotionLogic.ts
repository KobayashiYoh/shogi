import type { Position, PieceType } from '../types';

/**
 * 駒の種類が成ることができるかどうかを判定
 * @param pieceType - 駒の種類
 * @returns 王と金は成れないのでfalse、それ以外はtrue
 */
export const enablePromotionPieceType = (pieceType: PieceType): boolean => {
  return pieceType !== 'ou' && pieceType !== 'kin';
};

/**
 * 先手の敵陣かどうかを判定
 * @param row - 盤面の行番号
 * @returns 0-2行目であればtrue
 */
const isEnemyTerritoryForFirstPlayer = (row: number): boolean => {
  return row >= 0 && row <= 2;
};

/**
 * 後手の敵陣かどうかを判定
 * @param row - 盤面の行番号
 * @returns 6-8行目であればtrue
 */
const isEnemyTerritoryForSecondPlayer = (row: number): boolean => {
  return row >= 6 && row <= 8;
};

/**
 * 駒が移動後に成ることができるかどうかを判定
 * @param fromPos - 移動元の位置
 * @param toPos - 移動先の位置
 * @param pieceType - 駒の種類
 * @param isFirstPlayer - 先手かどうか
 * @returns 移動元または移動先が敵陣3段目にある場合はtrue
 */
export const enablePromotionAfterMove = (
  fromPos: Position,
  toPos: Position,
  pieceType: PieceType,
  isFirstPlayer: boolean
): boolean => {
  if (!enablePromotionPieceType(pieceType)) {
    return false;
  }

  if (isFirstPlayer) {
    // 先手の場合、移動元または移動先が0-2行目にあれば成れる
    const fromInEnemyTerritory = isEnemyTerritoryForFirstPlayer(fromPos.row);
    const toInEnemyTerritory = isEnemyTerritoryForFirstPlayer(toPos.row);
    const enablePromotion = fromInEnemyTerritory || toInEnemyTerritory;
    return enablePromotion;
  } else {
    // 後手の場合、移動元または移動先が6-8行目にあれば成れる
    const fromInEnemyTerritory = isEnemyTerritoryForSecondPlayer(fromPos.row);
    const toInEnemyTerritory = isEnemyTerritoryForSecondPlayer(toPos.row);
    const enablePromotion = fromInEnemyTerritory || toInEnemyTerritory;
    return enablePromotion;
  }
};

/**
 * 先手の駒が自動的に成るかどうかを判定（駒が成らないと動けなくなる場合）
 * @param toPos - 移動先の位置
 * @param pieceType - 駒の種類
 * @returns 歩・香は0行目、桂は0-1行目で自動的に成るのでtrue
 */
export const isAutomaticPromotionForFirstPlayer = (
  toPos: Position,
  pieceType: PieceType
): boolean => {
  if (pieceType === 'fu' || pieceType === 'kyou') {
    // 歩・香は0行目（一番奥）で必ず成る
    return toPos.row === 0;
  }
  if (pieceType === 'keima') {
    // 桂は0-1行目（奥2段）で必ず成る
    return toPos.row <= 1;
  }
  return false;
};

/**
 * 後手の駒が自動的に成るかどうかを判定（駒が成らないと動けなくなる場合）
 * @param toPos - 移動先の位置
 * @param pieceType - 駒の種類
 * @returns 歩・香は8行目、桂は7-8行目で自動的に成るのでtrue
 */
export const isAutomaticPromotionForSecondPlayer = (
  toPos: Position,
  pieceType: PieceType
): boolean => {
  if (pieceType === 'fu' || pieceType === 'kyou') {
    // 歩・香は8行目（一番奥）で必ず成る
    return toPos.row === 8;
  }
  if (pieceType === 'keima') {
    // 桂は7-8行目（奥2段）で必ず成る
    return toPos.row >= 7;
  }
  return false;
};

/**
 * 駒が自動的に成るかどうかを判定（駒が成らないと動けなくなる場合）
 * @param toPos - 移動先の位置
 * @param pieceType - 駒の種類
 * @param isFirstPlayer - 先手かどうか
 * @returns 歩・香は敵陣の一番奥、桂は敵陣の奥2段で動けなくなるのでtrue
 */
export const isAutomaticPromotion = (
  toPos: Position,
  pieceType: PieceType,
  isFirstPlayer: boolean
): boolean => {
  if (isFirstPlayer) {
    return isAutomaticPromotionForFirstPlayer(toPos, pieceType);
  }
  return isAutomaticPromotionForSecondPlayer(toPos, pieceType);
};

/**
 * 成り駒の種類の配列
 */
const PROMOTED_PIECE_TYPES: PieceType[] = [
  'ryuou',
  'ryuuma',
  'narigin',
  'narikei',
  'narikyo',
  'tokin',
];

/**
 * 駒が成り駒かどうかを判定する
 * @param type 駒の種類
 * @returns 成り駒の場合true
 */
export const isPromotedPiece = (type: PieceType): boolean => {
  return PROMOTED_PIECE_TYPES.includes(type);
};

/**
 * 元の駒から成り駒の種類を取得する
 * @param originalType 元の駒の種類
 * @returns 成り駒の種類（成れない駒の場合null）
 */
export const getPromotedPieceTypeFromOriginalPieceType = (
  originalType: PieceType
): PieceType | null => {
  switch (originalType) {
    case 'hisha':
      return 'ryuou';
    case 'kaku':
      return 'ryuuma';
    case 'gin':
      return 'narigin';
    case 'keima':
      return 'narikei';
    case 'kyou':
      return 'narikyo';
    case 'fu':
      return 'tokin';
    default:
      return null;
  }
};

/**
 * 成り駒から元の駒の種類を取得する
 * @param promotedType 成り駒の種類
 * @returns 元の駒の種類
 */
export const getOriginalPieceTypeFromPromotedPieceType = (
  promotedType: PieceType
): PieceType => {
  switch (promotedType) {
    case 'ryuou':
      return 'hisha';
    case 'ryuuma':
      return 'kaku';
    case 'narigin':
      return 'gin';
    case 'narikei':
      return 'keima';
    case 'narikyo':
      return 'kyou';
    case 'tokin':
      return 'fu';
    default:
      return promotedType;
  }
};
