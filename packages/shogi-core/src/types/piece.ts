/**
 * 駒の種類を表す型
 */
export type PieceType =
  | 'ou' // 王
  | 'hisha' // 飛車
  | 'kaku' // 角
  | 'kin' // 金
  | 'gin' // 銀
  | 'keima' // 桂馬
  | 'kyou' // 香車
  | 'fu' // 歩
  | 'ryuou' // 竜王（成り飛車）
  | 'ryuuma' // 竜馬（成り角）
  | 'narigin' // 成銀
  | 'narikei' // 成桂
  | 'narikyo' // 成香
  | 'tokin'; // と金（成り歩）

/**
 * 駒の情報
 */
export interface Piece {
  type: PieceType;
  isFirstPlayer: boolean;
}
