import type { Board } from '../types/board';

/**
 * 将棋の初期盤面配置（ベタ書きで分かりやすく）
 */
export const INITIAL_BOARD: Board = [
  // 0行目: 後手の最前列
  [
    { type: 'kyou', isFirstPlayer: false },
    { type: 'keima', isFirstPlayer: false },
    { type: 'gin', isFirstPlayer: false },
    { type: 'kin', isFirstPlayer: false },
    { type: 'ou', isFirstPlayer: false },
    { type: 'kin', isFirstPlayer: false },
    { type: 'gin', isFirstPlayer: false },
    { type: 'keima', isFirstPlayer: false },
    { type: 'kyou', isFirstPlayer: false },
  ],
  // 1行目: 後手の飛車・角
  [
    null,
    { type: 'hisha', isFirstPlayer: false },
    null,
    null,
    null,
    null,
    null,
    { type: 'kaku', isFirstPlayer: false },
    null,
  ],
  // 2行目: 後手の歩
  [
    { type: 'fu', isFirstPlayer: false },
    { type: 'fu', isFirstPlayer: false },
    { type: 'fu', isFirstPlayer: false },
    { type: 'fu', isFirstPlayer: false },
    { type: 'fu', isFirstPlayer: false },
    { type: 'fu', isFirstPlayer: false },
    { type: 'fu', isFirstPlayer: false },
    { type: 'fu', isFirstPlayer: false },
    { type: 'fu', isFirstPlayer: false },
  ],
  // 3-5行目: 空きマス
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  // 6行目: 先手の歩
  [
    { type: 'fu', isFirstPlayer: true },
    { type: 'fu', isFirstPlayer: true },
    { type: 'fu', isFirstPlayer: true },
    { type: 'fu', isFirstPlayer: true },
    { type: 'fu', isFirstPlayer: true },
    { type: 'fu', isFirstPlayer: true },
    { type: 'fu', isFirstPlayer: true },
    { type: 'fu', isFirstPlayer: true },
    { type: 'fu', isFirstPlayer: true },
  ],
  // 7行目: 先手の角・飛車
  [
    null,
    { type: 'kaku', isFirstPlayer: true },
    null,
    null,
    null,
    null,
    null,
    { type: 'hisha', isFirstPlayer: true },
    null,
  ],
  // 8行目: 先手の最前列
  [
    { type: 'kyou', isFirstPlayer: true },
    { type: 'keima', isFirstPlayer: true },
    { type: 'gin', isFirstPlayer: true },
    { type: 'kin', isFirstPlayer: true },
    { type: 'ou', isFirstPlayer: true },
    { type: 'kin', isFirstPlayer: true },
    { type: 'gin', isFirstPlayer: true },
    { type: 'keima', isFirstPlayer: true },
    { type: 'kyou', isFirstPlayer: true },
  ],
];
