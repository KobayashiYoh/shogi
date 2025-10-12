/**
 * 駒の移動方向定数
 * [row方向の変化, col方向の変化] の配列
 */

/**
 * 歩兵の移動方向
 */
export const FU_FIRST_PLAYER_DIRECTION = -1;
export const FU_SECOND_PLAYER_DIRECTION = 1;

/**
 * 王将・玉将の移動方向（8方向）
 */
export const OU_DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const;

/**
 * 金将の移動方向
 */
export const KIN_FIRST_PLAYER_DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, 0],
] as const;

export const KIN_SECOND_PLAYER_DIRECTIONS = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const;

/**
 * 銀将の移動方向
 */
export const GIN_FIRST_PLAYER_DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],

  [1, -1],
  [1, 1],
] as const;

export const GIN_SECOND_PLAYER_DIRECTIONS = [
  [-1, -1],
  [-1, 1],

  [1, -1],
  [1, 0],
  [1, 1],
] as const;

/**
 * 桂馬の移動方向
 */
export const KEIMA_FIRST_PLAYER_DIRECTIONS = [
  [-2, -1],
  [-2, 1],
] as const;

export const KEIMA_SECOND_PLAYER_DIRECTIONS = [
  [2, -1],
  [2, 1],
] as const;

/**
 * 飛車の移動方向（4方向）
 */
export const HISHA_DIRECTIONS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
] as const;

/**
 * 角行の移動方向（4方向）
 */
export const KAKU_DIRECTIONS = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
] as const;
