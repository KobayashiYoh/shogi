/**
 * レイアウト関連の定数
 */
export const LAYOUT = {
  /** 全体の幅 */
  WIDTH: 1360,
  /** 全体の高さ */
  HEIGHT: 800,
  /** 持ち駒エリアの幅 */
  CAPTURED_PIECES_AREA_WIDTH: 280,
  /** 将棋盤エリアの幅 */
  BOARD_AREA_WIDTH: 800,
  /** 将棋盤エリアの高さ */
  BOARD_AREA_HEIGHT: 800,
  /** 将棋盤のマス目のサイズ */
  CELL_SIZE: 80,
} as const;

/**
 * カラー定数
 */
export const COLORS = {
  /** 背景色（空色） */
  BACKGROUND: "#7DD3E8",
  /** 将棋盤の色 */
  BOARD: "#D4A574",
  /** 将棋盤のマス目の枠線 */
  BOARD_STROKE: "#8B6F47",
  /** 持ち駒エリアの背景色 */
  CAPTURED_AREA: "#3D2817",
  /** モーダルの背景色 */
  MODAL: "#4A7C59",
  /** 選択中のマスの色 */
  SELECTED_CELL: "#FFE4B5",
  /** テキスト色（白） */
  TEXT_WHITE: "#FFFFFF",
  /** テキスト色（黒） */
  TEXT_BLACK: "#000000",
  /** テキスト色（グレー） */
  TEXT_GRAY: "#666666",
} as const;

export { PIECE_IMAGES } from "./images";
