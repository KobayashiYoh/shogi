import type { BoardIndex } from '../../src/types';

/**
 * テスト用の対局シナリオデータ
 */

export interface Move {
  from: { row: BoardIndex; col: BoardIndex };
  to: { row: BoardIndex; col: BoardIndex };
  shouldPromote?: boolean;
  description: string;
}

export interface CapturedPiecePlacement {
  position: { row: BoardIndex; col: BoardIndex };
  pieceType: string;
  isFirstPlayer: boolean;
  description: string;
}

export interface GameScenario {
  name: string;
  description: string;
  moves: (Move | CapturedPiecePlacement)[];
  expectedResult: 'first_player_wins' | 'second_player_wins';
}

/**
 * シナリオ1: 最短決着（シンプルな対局）
 * 飛車と角を使った基本的な詰み筋
 */
export const scenario1: GameScenario = {
  name: 'シナリオ1',
  description: '最短決着で先手勝利（動作確認用）',
  expectedResult: 'first_player_wins',
  moves: [
    // 飛車の道を開く
    {
      from: { row: 6 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 7 as BoardIndex },
      description: '1手目: 先手 歩(6,7) -> (5,7)',
    },
    {
      from: { row: 2 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 1 as BoardIndex },
      description: '2手目: 後手 歩(2,1) -> (3,1)',
    },
    // 飛車を前に出す
    {
      from: { row: 7 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 7 as BoardIndex },
      description: '3手目: 先手 飛車(7,7) -> (6,7)',
    },
    {
      from: { row: 1 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 1 as BoardIndex },
      description: '4手目: 後手 飛車(1,1) -> (2,1)',
    },
    // 飛車で横に移動
    {
      from: { row: 6 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 4 as BoardIndex },
      description: '5手目: 先手 飛車(6,7) -> (6,4)',
    },
    {
      from: { row: 2 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 4 as BoardIndex },
      description: '6手目: 後手 飛車(2,1) -> (2,4)',
    },
    // 飛車で敵陣へ
    {
      from: { row: 6 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 4 as BoardIndex },
      description: '7手目: 先手 飛車(6,4) -> (2,4) 後手の歩と飛車を取る',
    },
    {
      from: { row: 0 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 4 as BoardIndex },
      description: '8手目: 後手 金(0,3) -> (1,4)',
    },
    // 角の道を開く
    {
      from: { row: 6 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 6 as BoardIndex },
      description: '9手目: 先手 歩(6,6) -> (5,6)',
    },
    {
      from: { row: 0 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 5 as BoardIndex },
      description: '10手目: 後手 金(0,5) -> (1,5)',
    },
    // 角を前に出す
    {
      from: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 3 as BoardIndex },
      description: '11手目: 先手 角(7,1) -> (5,3)',
    },
    {
      from: { row: 1 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 5 as BoardIndex },
      description: '12手目: 後手 金(1,5) -> (2,5)',
    },
    // 角で王手
    {
      from: { row: 5 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 7 as BoardIndex },
      description: '13手目: 先手 角(5,3) -> (1,7) 後手の角を取る',
    },
    {
      from: { row: 0 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 7 as BoardIndex },
      description: '14手目: 後手 銀(0,6) -> (1,7) 角を取る',
    },
    // 飛車で詰み
    {
      from: { row: 2 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 0 as BoardIndex, col: 4 as BoardIndex },
      description: '15手目: 先手 飛車(2,4) -> (0,4) 王を取る',
    },
  ],
};

/**
 * シナリオ2: 飛車成りで後手勝利（持ち駒なし）
 */
export const scenario2: GameScenario = {
  name: 'シナリオ2',
  description: '飛車成りで後手勝利',
  expectedResult: 'second_player_wins',
  moves: [
    // 後手の飛車の道を開く
    {
      from: { row: 6 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 4 as BoardIndex },
      description: '1手目: 先手 歩(6,4) -> (5,4)',
    },
    {
      from: { row: 2 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 1 as BoardIndex },
      description: '2手目: 後手 歩(2,1) -> (3,1)',
    },
    {
      from: { row: 7 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 7 as BoardIndex },
      description: '3手目: 先手 飛車(7,7) -> (6,7)',
    },
    // 後手の飛車を前進
    {
      from: { row: 1 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 1 as BoardIndex },
      description: '4手目: 後手 飛車(1,1) -> (2,1)',
    },
    {
      from: { row: 6 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 4 as BoardIndex },
      description: '5手目: 先手 飛車(6,7) -> (6,4)',
    },
    // 後手の飛車を横移動
    {
      from: { row: 2 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 4 as BoardIndex },
      description: '6手目: 後手 飛車(2,1) -> (2,4)',
    },
    {
      from: { row: 6 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 4 as BoardIndex },
      description: '7手目: 先手 飛車(6,4) -> (5,4) 歩を取る',
    },
    // 後手の飛車で敵陣へ
    {
      from: { row: 2 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 4 as BoardIndex },
      description: '8手目: 後手 飛車(2,4) -> (5,4) 先手の飛車を取る',
    },
    {
      from: { row: 8 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 4 as BoardIndex },
      description: '9手目: 先手 金(8,3) -> (7,4)',
    },
    // 後手の飛車をさらに前進して成る
    {
      from: { row: 5 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 4 as BoardIndex },
      shouldPromote: true,
      description: '10手目: 後手 飛車(5,4) -> (7,4) 成る、金を取る',
    },
    {
      from: { row: 8 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 4 as BoardIndex },
      description: '11手目: 先手 金(8,5) -> (7,4) 龍を取る',
    },
    // 後手の角を使う
    {
      from: { row: 1 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 4 as BoardIndex },
      description: '12手目: 後手 角(1,7) -> (4,4)',
    },
    {
      from: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 2 as BoardIndex },
      description: '13手目: 先手 角(7,1) -> (6,2)',
    },
    // 後手の角で攻める
    {
      from: { row: 4 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      description: '14手目: 後手 角(4,4) -> (7,1)',
    },
    {
      from: { row: 8 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 3 as BoardIndex },
      description: '15手目: 先手 王(8,4) -> (7,3)',
    },
    // 後手の角で詰み
    {
      from: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 8 as BoardIndex, col: 2 as BoardIndex },
      description: '16手目: 後手 角(7,1) -> (8,2) 銀を取る',
    },
    {
      from: { row: 7 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 4 as BoardIndex },
      description: '17手目: 先手 金(7,4) -> (6,4)',
    },
    {
      from: { row: 8 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 3 as BoardIndex },
      description: '18手目: 後手 角(8,2) -> (7,3) 王を取る',
    },
  ],
};

/**
 * シナリオ3: 角成りと銀成りで後手勝利（持ち駒なし）
 */
export const scenario3: GameScenario = {
  name: 'シナリオ3',
  description: '角成りと銀成りで後手勝利',
  expectedResult: 'second_player_wins',
  moves: [
    // 角の道を開く
    {
      from: { row: 6 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 6 as BoardIndex },
      description: '1手目: 先手 歩(6,6) -> (5,6)',
    },
    {
      from: { row: 2 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 2 as BoardIndex },
      description: '2手目: 後手 歩(2,2) -> (3,2)',
    },
    // 角を前に出す
    {
      from: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 2 as BoardIndex },
      description: '3手目: 先手 角(7,1) -> (6,2)',
    },
    {
      from: { row: 1 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 6 as BoardIndex },
      description: '4手目: 後手 角(1,7) -> (2,6)',
    },
    // 銀を前に出す
    {
      from: { row: 8 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 6 as BoardIndex },
      description: '5手目: 先手 銀(8,6) -> (7,6)',
    },
    {
      from: { row: 0 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 2 as BoardIndex },
      description: '6手目: 後手 銀(0,2) -> (1,2)',
    },
    {
      from: { row: 7 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 5 as BoardIndex },
      description: '7手目: 先手 銀(7,6) -> (6,5)',
    },
    // 後手の銀を前進させて成る
    {
      from: { row: 1 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 3 as BoardIndex },
      description: '8手目: 後手 銀(1,2) -> (2,3)',
    },
    {
      from: { row: 6 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 3 as BoardIndex },
      description: '9手目: 先手 角(6,2) -> (5,3)',
    },
    {
      from: { row: 2 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 4 as BoardIndex },
      description: '10手目: 後手 銀(2,3) -> (3,4)',
    },
    {
      from: { row: 5 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 4 as BoardIndex },
      description: '11手目: 先手 角(5,3) -> (4,4)',
    },
    // 後手の銀をさらに前進
    {
      from: { row: 3 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 5 as BoardIndex },
      description: '12手目: 後手 銀(3,4) -> (4,5)',
    },
    {
      from: { row: 4 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 5 as BoardIndex },
      description: '13手目: 先手 角(4,4) -> (5,5)',
    },
    // 後手の銀が敵陣で成る
    {
      from: { row: 4 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 6 as BoardIndex },
      shouldPromote: true,
      description: '14手目: 後手 銀(4,5) -> (5,6) 成る、歩を取る',
    },
    {
      from: { row: 6 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 6 as BoardIndex },
      description: '15手目: 先手 銀(6,5) -> (5,6) 成銀を取る',
    },
    // 後手の角を前進させて成る
    {
      from: { row: 2 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 2 as BoardIndex },
      shouldPromote: true,
      description: '16手目: 後手 角(2,6) -> (6,2) 成る',
    },
    {
      from: { row: 5 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 6 as BoardIndex },
      description: '17手目: 先手 銀(5,6) -> (6,6)',
    },
    // 後手の龍馬で攻める
    {
      from: { row: 6 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 3 as BoardIndex },
      description: '18手目: 後手 龍馬(6,2) -> (7,3)',
    },
    {
      from: { row: 8 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 3 as BoardIndex },
      description: '19手目: 先手 王(8,4) -> (7,3) 龍馬を取る',
    },
    // 後手の飛車で詰み
    {
      from: { row: 1 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      description: '20手目: 後手 飛車(1,1) -> (7,1)',
    },
    {
      from: { row: 8 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 4 as BoardIndex },
      description: '21手目: 先手 金(8,3) -> (7,4)',
    },
    {
      from: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 3 as BoardIndex },
      description: '22手目: 後手 飛車(7,1) -> (7,3) 王を取る',
    },
  ],
};

/**
 * シナリオ4: 香車成りと持ち駒打ちで先手勝利
 */
export const scenario4: GameScenario = {
  name: 'シナリオ4',
  description: '香車成りと持ち駒打ちで先手勝利',
  expectedResult: 'first_player_wins',
  moves: [
    // 香車の道を開く
    {
      from: { row: 6 as BoardIndex, col: 0 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 0 as BoardIndex },
      description: '1手目: 先手 歩(6,0) -> (5,0)',
    },
    {
      from: { row: 2 as BoardIndex, col: 8 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 8 as BoardIndex },
      description: '2手目: 後手 歩(2,8) -> (3,8)',
    },
    // 香車を前進
    {
      from: { row: 8 as BoardIndex, col: 0 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 0 as BoardIndex },
      description: '3手目: 先手 香車(8,0) -> (6,0)',
    },
    {
      from: { row: 0 as BoardIndex, col: 8 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 8 as BoardIndex },
      description: '4手目: 後手 香車(0,8) -> (2,8)',
    },
    {
      from: { row: 6 as BoardIndex, col: 0 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 0 as BoardIndex },
      description: '5手目: 先手 香車(6,0) -> (4,0)',
    },
    {
      from: { row: 2 as BoardIndex, col: 8 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 8 as BoardIndex },
      description: '6手目: 後手 香車(2,8) -> (4,8)',
    },
    {
      from: { row: 4 as BoardIndex, col: 0 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 0 as BoardIndex },
      shouldPromote: true,
      description: '7手目: 先手 香車(4,0) -> (2,0) 成る、歩を取る',
    },
    {
      from: { row: 4 as BoardIndex, col: 8 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 8 as BoardIndex },
      shouldPromote: true,
      description: '8手目: 後手 香車(4,8) -> (6,8) 成る、歩を取る',
    },
    // 飛車を前進
    {
      from: { row: 7 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 7 as BoardIndex },
      description: '9手目: 先手 飛車(7,7) -> (5,7)',
    },
    {
      from: { row: 1 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 1 as BoardIndex },
      description: '10手目: 後手 飛車(1,1) -> (3,1)',
    },
    // 飛車で横移動
    {
      from: { row: 5 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 4 as BoardIndex },
      description: '11手目: 先手 飛車(5,7) -> (5,4)',
    },
    {
      from: { row: 3 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 4 as BoardIndex },
      description: '12手目: 後手 飛車(3,1) -> (3,4)',
    },
    // 持ち駒の歩を打つ
    {
      position: { row: 4 as BoardIndex, col: 3 as BoardIndex },
      pieceType: 'fu',
      isFirstPlayer: true,
      description: '13手目: 先手 持ち駒の歩を打つ (4,3)',
    },
    {
      from: { row: 3 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 5 as BoardIndex },
      description: '14手目: 後手 飛車(3,4) -> (3,5)',
    },
    // 飛車で詰み
    {
      from: { row: 5 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 0 as BoardIndex, col: 4 as BoardIndex },
      description: '15手目: 先手 飛車(5,4) -> (0,4) 王を取る',
    },
  ],
};

/**
 * シナリオ5: 100手程度の長期戦（複雑な局面、先手勝利）
 */
export const scenario5: GameScenario = {
  name: 'シナリオ5',
  description: '100手程度の長期戦で先手勝利',
  expectedResult: 'first_player_wins',
  moves: [
    // 序盤: 相掛かり風の立ち上がり
    {
      from: { row: 6 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 6 as BoardIndex },
      description: '1手目: 先手 歩(6,6) -> (5,6)',
    },
    {
      from: { row: 2 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 2 as BoardIndex },
      description: '2手目: 後手 歩(2,2) -> (3,2)',
    },
    {
      from: { row: 6 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 5 as BoardIndex },
      description: '3手目: 先手 歩(6,5) -> (5,5)',
    },
    {
      from: { row: 2 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 3 as BoardIndex },
      description: '4手目: 後手 歩(2,3) -> (3,3)',
    },
    {
      from: { row: 8 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 6 as BoardIndex },
      description: '5手目: 先手 銀(8,6) -> (7,6)',
    },
    {
      from: { row: 0 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 2 as BoardIndex },
      description: '6手目: 後手 銀(0,2) -> (1,2)',
    },
    {
      from: { row: 7 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 6 as BoardIndex },
      description: '7手目: 先手 銀(7,6) -> (6,6)',
    },
    {
      from: { row: 1 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 2 as BoardIndex },
      description: '8手目: 後手 銀(1,2) -> (2,2)',
    },
    {
      from: { row: 6 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 6 as BoardIndex },
      description: '9手目: 先手 銀(6,6) -> (5,6)',
    },
    {
      from: { row: 2 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 2 as BoardIndex },
      description: '10手目: 後手 銀(2,2) -> (3,2)',
    },
    // 11-20手目: 角の活用と金銀の連携
    {
      from: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 3 as BoardIndex },
      description: '11手目: 先手 角(7,1) -> (5,3)',
    },
    {
      from: { row: 1 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 5 as BoardIndex },
      description: '12手目: 後手 角(1,7) -> (3,5)',
    },
    {
      from: { row: 8 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 6 as BoardIndex },
      description: '13手目: 先手 金(8,5) -> (7,6)',
    },
    {
      from: { row: 0 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 2 as BoardIndex },
      description: '14手目: 後手 金(0,3) -> (1,2)',
    },
    {
      from: { row: 6 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 7 as BoardIndex },
      description: '15手目: 先手 歩(6,7) -> (5,7)',
    },
    {
      from: { row: 2 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 1 as BoardIndex },
      description: '16手目: 後手 歩(2,1) -> (3,1)',
    },
    {
      from: { row: 7 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 7 as BoardIndex },
      description: '17手目: 先手 飛車(7,7) -> (6,7)',
    },
    {
      from: { row: 1 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 1 as BoardIndex },
      description: '18手目: 後手 飛車(1,1) -> (2,1)',
    },
    {
      from: { row: 6 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 4 as BoardIndex },
      description: '19手目: 先手 飛車(6,7) -> (6,4)',
    },
    {
      from: { row: 2 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 4 as BoardIndex },
      description: '20手目: 後手 飛車(2,1) -> (2,4)',
    },
    // 21-40手目: 中盤の攻防
    {
      from: { row: 8 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 6 as BoardIndex },
      description: '21手目: 先手 桂馬(8,7) -> (6,6)',
    },
    {
      from: { row: 0 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 2 as BoardIndex },
      description: '22手目: 後手 桂馬(0,1) -> (2,2)',
    },
    {
      from: { row: 6 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 3 as BoardIndex },
      description: '23手目: 先手 飛車(6,4) -> (6,3)',
    },
    {
      from: { row: 2 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 5 as BoardIndex },
      description: '24手目: 後手 飛車(2,4) -> (2,5)',
    },
    {
      from: { row: 5 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 1 as BoardIndex },
      description: '25手目: 先手 角(5,3) -> (3,1) 歩を取る',
    },
    {
      from: { row: 3 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 7 as BoardIndex },
      description: '26手目: 後手 角(3,5) -> (5,7) 歩を取る',
    },
    {
      from: { row: 3 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 3 as BoardIndex },
      shouldPromote: true,
      description: '27手目: 先手 角(3,1) -> (1,3) 成る',
    },
    {
      from: { row: 5 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 5 as BoardIndex },
      shouldPromote: true,
      description: '28手目: 後手 角(5,7) -> (7,5) 成る',
    },
    {
      from: { row: 6 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 3 as BoardIndex },
      description: '29手目: 先手 飛車(6,3) -> (3,3) 歩を取る',
    },
    {
      from: { row: 2 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 5 as BoardIndex },
      description: '30手目: 後手 飛車(2,5) -> (5,5) 歩を取る',
    },
    {
      from: { row: 3 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 5 as BoardIndex },
      description: '31手目: 先手 飛車(3,3) -> (3,5)',
    },
    {
      from: { row: 5 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 3 as BoardIndex },
      description: '32手目: 後手 飛車(5,5) -> (5,3)',
    },
    {
      from: { row: 1 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 4 as BoardIndex },
      description: '33手目: 先手 龍馬(1,3) -> (2,4)',
    },
    {
      from: { row: 7 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 4 as BoardIndex },
      description: '34手目: 後手 龍馬(7,5) -> (6,4)',
    },
    {
      from: { row: 8 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 3 as BoardIndex },
      description: '35手目: 先手 金(8,3) -> (7,3)',
    },
    {
      from: { row: 0 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 5 as BoardIndex },
      description: '36手目: 後手 金(0,5) -> (1,5)',
    },
    {
      from: { row: 3 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 5 as BoardIndex },
      shouldPromote: true,
      description: '37手目: 先手 飛車(3,5) -> (2,5) 成る',
    },
    {
      from: { row: 5 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 3 as BoardIndex },
      shouldPromote: true,
      description: '38手目: 後手 飛車(5,3) -> (6,3) 成る',
    },
    {
      from: { row: 5 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 5 as BoardIndex },
      description: '39手目: 先手 銀(5,6) -> (4,5)',
    },
    {
      from: { row: 3 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 3 as BoardIndex },
      description: '40手目: 後手 銀(3,2) -> (4,3)',
    },
    // 41-60手目: 持ち駒を使った攻防
    {
      position: { row: 5 as BoardIndex, col: 2 as BoardIndex },
      pieceType: 'fu',
      isFirstPlayer: true,
      description: '41手目: 先手 持ち駒の歩を打つ (5,2)',
    },
    {
      position: { row: 4 as BoardIndex, col: 6 as BoardIndex },
      pieceType: 'fu',
      isFirstPlayer: false,
      description: '42手目: 後手 持ち駒の歩を打つ (4,6)',
    },
    {
      from: { row: 2 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 2 as BoardIndex },
      description: '43手目: 先手 龍(2,5) -> (2,2)',
    },
    {
      from: { row: 6 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 6 as BoardIndex },
      description: '44手目: 後手 龍(6,3) -> (6,6) 桂馬を取る',
    },
    {
      from: { row: 2 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 0 as BoardIndex },
      description: '45手目: 先手 龍(2,2) -> (2,0)',
    },
    {
      from: { row: 6 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 6 as BoardIndex },
      description: '46手目: 後手 龍(6,6) -> (7,6) 金を取る',
    },
    {
      from: { row: 2 as BoardIndex, col: 0 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 0 as BoardIndex },
      description: '47手目: 先手 龍(2,0) -> (1,0)',
    },
    {
      from: { row: 2 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 1 as BoardIndex },
      description: '48手目: 後手 桂馬(2,2) -> (4,1)',
    },
    {
      position: { row: 3 as BoardIndex, col: 4 as BoardIndex },
      pieceType: 'fu',
      isFirstPlayer: true,
      description: '49手目: 先手 持ち駒の歩を打つ (3,4)',
    },
    {
      position: { row: 5 as BoardIndex, col: 4 as BoardIndex },
      pieceType: 'fu',
      isFirstPlayer: false,
      description: '50手目: 後手 持ち駒の歩を打つ (5,4)',
    },
    {
      from: { row: 4 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 3 as BoardIndex },
      description: '51手目: 先手 桂馬(4,4) -> (2,3)',
    },
    {
      from: { row: 4 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 2 as BoardIndex },
      description: '52手目: 後手 桂馬(4,1) -> (6,2)',
    },
    {
      from: { row: 8 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 2 as BoardIndex },
      description: '53手目: 先手 銀(8,2) -> (7,2)',
    },
    {
      from: { row: 0 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 6 as BoardIndex },
      description: '54手目: 後手 銀(0,6) -> (1,6)',
    },
    {
      from: { row: 7 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 2 as BoardIndex },
      description: '55手目: 先手 銀(7,2) -> (6,2) 桂馬を取る',
    },
    {
      from: { row: 1 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 6 as BoardIndex },
      description: '56手目: 後手 銀(1,6) -> (2,6)',
    },
    {
      from: { row: 2 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 3 as BoardIndex },
      description: '57手目: 先手 龍馬(2,4) -> (3,3)',
    },
    {
      from: { row: 6 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 5 as BoardIndex },
      description: '58手目: 後手 龍馬(6,4) -> (5,5)',
    },
    {
      from: { row: 1 as BoardIndex, col: 0 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 0 as BoardIndex },
      description: '59手目: 先手 龍(1,0) -> (2,0)',
    },
    {
      from: { row: 7 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 3 as BoardIndex },
      description: '60手目: 後手 龍(7,6) -> (7,3) 金を取る',
    },
    // 61-80手目: 終盤戦への突入
    {
      from: { row: 8 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 0 as BoardIndex },
      description: '61手目: 先手 桂馬(8,1) -> (6,0)',
    },
    {
      from: { row: 0 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 8 as BoardIndex },
      description: '62手目: 後手 桂馬(0,7) -> (2,8)',
    },
    {
      from: { row: 8 as BoardIndex, col: 0 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 0 as BoardIndex },
      description: '63手目: 先手 香車(8,0) -> (7,0)',
    },
    {
      from: { row: 0 as BoardIndex, col: 8 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 8 as BoardIndex },
      description: '64手目: 後手 香車(0,8) -> (1,8)',
    },
    {
      from: { row: 7 as BoardIndex, col: 0 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 0 as BoardIndex },
      description: '65手目: 先手 香車(7,0) -> (5,0)',
    },
    {
      from: { row: 1 as BoardIndex, col: 8 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 8 as BoardIndex },
      description: '66手目: 後手 香車(1,8) -> (3,8)',
    },
    {
      position: { row: 4 as BoardIndex, col: 2 as BoardIndex },
      pieceType: 'keima',
      isFirstPlayer: true,
      description: '67手目: 先手 持ち駒の桂馬を打つ (4,2)',
    },
    {
      position: { row: 5 as BoardIndex, col: 6 as BoardIndex },
      pieceType: 'keima',
      isFirstPlayer: false,
      description: '68手目: 後手 持ち駒の桂馬を打つ (5,6)',
    },
    {
      from: { row: 3 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 4 as BoardIndex },
      description: '69手目: 先手 龍馬(3,3) -> (4,4)',
    },
    {
      from: { row: 5 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 4 as BoardIndex },
      description: '70手目: 後手 龍馬(5,5) -> (4,4) 龍馬を取る',
    },
    {
      from: { row: 2 as BoardIndex, col: 0 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 3 as BoardIndex },
      description: '71手目: 先手 龍(2,0) -> (2,3)',
    },
    {
      from: { row: 7 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 8 as BoardIndex, col: 3 as BoardIndex },
      description: '72手目: 後手 龍(7,3) -> (8,3)',
    },
    {
      from: { row: 6 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 3 as BoardIndex },
      description: '73手目: 先手 銀(6,2) -> (5,3)',
    },
    {
      from: { row: 2 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 5 as BoardIndex },
      description: '74手目: 後手 銀(2,6) -> (3,5)',
    },
    {
      from: { row: 4 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 5 as BoardIndex },
      description: '75手目: 先手 銀(4,5) -> (3,5) 銀を取る',
    },
    {
      from: { row: 4 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 3 as BoardIndex },
      description: '76手目: 後手 銀(4,3) -> (5,3) 銀を取る',
    },
    {
      from: { row: 2 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 2 as BoardIndex },
      description: '77手目: 先手 龍(2,3) -> (1,2) 金を取る',
    },
    {
      from: { row: 8 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 8 as BoardIndex, col: 5 as BoardIndex },
      description: '78手目: 後手 龍(8,3) -> (8,5)',
    },
    {
      from: { row: 6 as BoardIndex, col: 0 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 1 as BoardIndex },
      description: '79手目: 先手 桂馬(6,0) -> (4,1)',
    },
    {
      from: { row: 2 as BoardIndex, col: 8 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 7 as BoardIndex },
      description: '80手目: 後手 桂馬(2,8) -> (4,7)',
    },
    // 81-105手目: 最終局面
    {
      position: { row: 3 as BoardIndex, col: 0 as BoardIndex },
      pieceType: 'kin',
      isFirstPlayer: true,
      description: '81手目: 先手 持ち駒の金を打つ (3,0)',
    },
    {
      position: { row: 6 as BoardIndex, col: 8 as BoardIndex },
      pieceType: 'kin',
      isFirstPlayer: false,
      description: '82手目: 後手 持ち駒の金を打つ (6,8)',
    },
    {
      from: { row: 1 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 0 as BoardIndex, col: 2 as BoardIndex },
      description: '83手目: 先手 龍(1,2) -> (0,2)',
    },
    {
      from: { row: 8 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 8 as BoardIndex, col: 4 as BoardIndex },
      description: '84手目: 後手 龍(8,5) -> (8,4)',
    },
    {
      from: { row: 0 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 0 as BoardIndex, col: 3 as BoardIndex },
      description: '85手目: 先手 龍(0,2) -> (0,3) 金を取る',
    },
    {
      from: { row: 4 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 4 as BoardIndex },
      description: '86手目: 後手 龍馬(4,4) -> (5,4)',
    },
    {
      from: { row: 8 as BoardIndex, col: 8 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 8 as BoardIndex },
      description: '87手目: 先手 香車(8,8) -> (7,8)',
    },
    {
      from: { row: 0 as BoardIndex, col: 0 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 0 as BoardIndex },
      description: '88手目: 後手 香車(0,0) -> (1,0)',
    },
    {
      from: { row: 5 as BoardIndex, col: 0 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 0 as BoardIndex },
      description: '89手目: 先手 香車(5,0) -> (4,0)',
    },
    {
      from: { row: 3 as BoardIndex, col: 8 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 8 as BoardIndex },
      description: '90手目: 後手 香車(3,8) -> (4,8)',
    },
    {
      from: { row: 0 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 0 as BoardIndex, col: 0 as BoardIndex },
      description: '91手目: 先手 龍(0,3) -> (0,0) 香車を取る',
    },
    {
      from: { row: 5 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 4 as BoardIndex },
      description: '92手目: 後手 龍馬(5,4) -> (6,4)',
    },
    {
      from: { row: 8 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 4 as BoardIndex },
      description: '93手目: 先手 王(8,4) -> (7,4)',
    },
    {
      from: { row: 8 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 4 as BoardIndex },
      description: '94手目: 後手 龍(8,4) -> (7,4) 王を取る',
    },
  ],
};

export const allScenarios = [scenario1, scenario2, scenario3, scenario4];
