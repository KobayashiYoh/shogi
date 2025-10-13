import type { BoardIndex, Position, GameResult } from '../../src/types';

/**
 * テスト用の対局シナリオデータ
 */

export interface Move {
  from: Position;
  to: Position;
  shouldPromote?: boolean;
  description: string;
}

export interface CapturedPiecePlacement {
  position: Position;
  pieceType: string;
  isFirstPlayer: boolean;
  description: string;
}

export interface GameScenario {
  name: string;
  description: string;
  moves: (Move | CapturedPiecePlacement)[];
  expectedResult: GameResult;
}

/**
 * 戦型: 矢倉
 * 結果: 94手で先手投了、後手勝ち
 *
 * 将棋の筋と段の座標系:
 * - 筋（横）: 9～1（右から左）→ col: 0～8（左から右）
 * - 段（縦）: 1～9（上から下）→ row: 0～8（上から下）
 * - 例: ７六 = 7筋6段 = col:2, row:5
 */
export const realGameScenario1: GameScenario = {
  name: '94手で先手投了、後手勝ち',
  description: '後手勝利（94手）',
  expectedResult: 'second_player_wins',
  moves: [
    // 1手目: ７六歩(77)
    {
      from: { row: 6 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 2 as BoardIndex },
      description: '1手目: 先手 ７六歩',
    },
    // 2手目: ８四歩(83)
    {
      from: { row: 2 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 1 as BoardIndex },
      description: '2手目: 後手 ８四歩',
    },
    // 3手目: ６八銀(79)
    {
      from: { row: 8 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 3 as BoardIndex },
      description: '3手目: 先手 ６八銀',
    },
    // 4手目: ３四歩(33)
    {
      from: { row: 2 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 6 as BoardIndex },
      description: '4手目: 後手 ３四歩',
    },
    // 5手目: ７七銀(68)
    {
      from: { row: 7 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 2 as BoardIndex },
      description: '5手目: 先手 ７七銀',
    },
    // 6手目: ７二銀(71)
    {
      from: { row: 0 as BoardIndex, col: 8 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 2 as BoardIndex },
      description: '6手目: 後手 ７二銀',
    },
    // 7手目: ２六歩(27)
    {
      from: { row: 6 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 7 as BoardIndex },
      description: '7手目: 先手 ２六歩',
    },
    // 8手目: ７四歩(73)
    {
      from: { row: 2 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 2 as BoardIndex },
      description: '8手目: 後手 ７四歩',
    },
    // 9手目: ２五歩(26)
    {
      from: { row: 5 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 7 as BoardIndex },
      description: '9手目: 先手 ２五歩',
    },
    // 10手目: ３二金(41)
    {
      from: { row: 0 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 7 as BoardIndex },
      description: '10手目: 後手 ３二金',
    },
    // 11手目: ７八金(69)
    {
      from: { row: 8 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      description: '11手目: 先手 ７八金',
    },
    // 12手目: ７三銀(72)
    {
      from: { row: 1 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 2 as BoardIndex },
      description: '12手目: 後手 ７三銀',
    },
    // 13手目: ２四歩(25)
    {
      from: { row: 4 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 7 as BoardIndex },
      description: '13手目: 先手 ２四歩',
    },
    // 14手目: 同　歩(23)
    {
      from: { row: 2 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 7 as BoardIndex },
      description: '14手目: 後手 同　歩',
    },
    // 15手目: 同　飛(28)
    {
      from: { row: 7 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 7 as BoardIndex },
      description: '15手目: 先手 同　飛',
    },
    // 16手目: ８五歩(84)
    {
      from: { row: 3 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 1 as BoardIndex },
      description: '16手目: 後手 ８五歩',
    },
    // 17手目: ３八銀(39)
    {
      from: { row: 8 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 7 as BoardIndex },
      description: '17手目: 先手 ３八銀',
    },
    // 18手目: ４二銀(31)
    {
      from: { row: 0 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 3 as BoardIndex },
      description: '18手目: 後手 ４二銀',
    },
    // 19手目: ４六歩(47)
    {
      from: { row: 6 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 3 as BoardIndex },
      description: '19手目: 先手 ４六歩',
    },
    // 20手目: ４一玉(51)
    {
      from: { row: 0 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 0 as BoardIndex, col: 3 as BoardIndex },
      description: '20手目: 後手 ４一玉',
    },
    // 21手目: ４七銀(38)
    {
      from: { row: 7 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 6 as BoardIndex },
      description: '21手目: 先手 ４七銀',
    },
    // 22手目: ６四銀(73)
    {
      from: { row: 2 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 5 as BoardIndex },
      description: '22手目: 後手 ６四銀',
    },
    // 23手目: ２八飛(24)
    {
      from: { row: 3 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 7 as BoardIndex },
      description: '23手目: 先手 ２八飛',
    },
    // 24手目: ２三歩打
    {
      position: { row: 2 as BoardIndex, col: 7 as BoardIndex },
      pieceType: 'fu',
      isFirstPlayer: false,
      description: '24手目: 後手 ２三歩打',
    },
    // 25手目: ５六銀(47)
    {
      from: { row: 6 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 5 as BoardIndex },
      description: '25手目: 先手 ５六銀',
    },
    // 26手目: ３一玉(41)
    {
      from: { row: 0 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 0 as BoardIndex, col: 6 as BoardIndex },
      description: '26手目: 後手 ３一玉',
    },
    // 27手目: ４五銀(56)
    {
      from: { row: 5 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 4 as BoardIndex },
      description: '27手目: 先手 ４五銀',
    },
    // 28手目: ３三銀(42)
    {
      from: { row: 1 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 6 as BoardIndex },
      description: '28手目: 後手 ３三銀',
    },
    // 29手目: ５八金(49)
    {
      from: { row: 8 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 3 as BoardIndex },
      description: '29手目: 先手 ５八金',
    },
    // 30手目: ５二金(61)
    {
      from: { row: 0 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 4 as BoardIndex },
      description: '30手目: 後手 ５二金',
    },
    // 31手目: ６六歩(67)
    {
      from: { row: 6 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 3 as BoardIndex },
      description: '31手目: 先手 ６六歩',
    },
    // 32手目: １四歩(13)
    {
      from: { row: 2 as BoardIndex, col: 8 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 8 as BoardIndex },
      description: '32手目: 後手 １四歩',
    },
    // 33手目: １六歩(17)
    {
      from: { row: 6 as BoardIndex, col: 8 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 8 as BoardIndex },
      description: '33手目: 先手 １六歩',
    },
    // 34手目: ４二金(52)
    {
      from: { row: 1 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 3 as BoardIndex },
      description: '34手目: 後手 ４二金',
    },
    // 35手目: ６九玉(59)
    {
      from: { row: 8 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 8 as BoardIndex, col: 2 as BoardIndex },
      description: '35手目: 先手 ６九玉',
    },
    // 36手目: ７五歩(74)
    {
      from: { row: 3 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 2 as BoardIndex },
      description: '36手目: 後手 ７五歩',
    },
    // 37手目: ５六銀(45)
    {
      from: { row: 4 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 5 as BoardIndex },
      description: '37手目: 先手 ５六銀',
    },
    // 38手目: ７六歩(75)
    {
      from: { row: 4 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 2 as BoardIndex },
      description: '38手目: 後手 ７六歩',
    },
    // 39手目: 同　銀(77)
    {
      from: { row: 6 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 2 as BoardIndex },
      description: '39手目: 先手 同　銀',
    },
    // 40手目: ８六歩(85)
    {
      from: { row: 4 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 1 as BoardIndex },
      description: '40手目: 後手 ８六歩',
    },
    // 41手目: 同　歩(87)
    {
      from: { row: 6 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 1 as BoardIndex },
      description: '41手目: 先手 同　歩',
    },
    // 42手目: 同　飛(82)
    {
      from: { row: 1 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 1 as BoardIndex },
      description: '42手目: 後手 同　飛',
    },
    // 43手目: ６五歩(66)
    {
      from: { row: 5 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 3 as BoardIndex },
      description: '43手目: 先手 ６五歩',
    },
    // 44手目: ７六飛(86)
    {
      from: { row: 5 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 2 as BoardIndex },
      description: '44手目: 後手 ７六飛',
    },
    // 45手目: ６四歩(65)
    {
      from: { row: 4 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 3 as BoardIndex },
      description: '45手目: 先手 ６四歩',
    },
    // 46手目: 同　歩(63)
    {
      from: { row: 2 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 3 as BoardIndex, col: 3 as BoardIndex },
      description: '46手目: 後手 同　歩',
    },
    // 47手目: ６三歩打
    {
      position: { row: 2 as BoardIndex, col: 5 as BoardIndex },
      pieceType: 'fu',
      isFirstPlayer: true,
      description: '47手目: 先手 ６三歩打',
    },
    // 48手目: ８六飛(76)
    {
      from: { row: 5 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 1 as BoardIndex },
      description: '48手目: 後手 ８六飛',
    },
    // 49手目: ６七金(58)
    {
      from: { row: 7 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 2 as BoardIndex },
      description: '49手目: 先手 ６七金',
    },
    // 50手目: ５二金(42)
    {
      from: { row: 1 as BoardIndex, col: 3 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 4 as BoardIndex },
      description: '50手目: 後手 ５二金',
    },
    // 51手目: １七桂(29)
    {
      from: { row: 8 as BoardIndex, col: 8 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 7 as BoardIndex },
      description: '51手目: 先手 １七桂',
    },
    // 52手目: ６三金(52)
    {
      from: { row: 1 as BoardIndex, col: 4 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 5 as BoardIndex },
      description: '52手目: 後手 ６三金',
    },
    // 53手目: ２五桂(17)
    {
      from: { row: 6 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 6 as BoardIndex },
      description: '53手目: 先手 ２五桂',
    },
    // 54手目: ４二銀(33)
    {
      from: { row: 2 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 3 as BoardIndex },
      description: '54手目: 後手 ４二銀',
    },
    // 55手目: ２二角成(88)
    {
      from: { row: 7 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 7 as BoardIndex },
      shouldPromote: true,
      description: '55手目: 先手 ２二角成',
    },
    // 56手目: 同　金(32)
    {
      from: { row: 1 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 7 as BoardIndex },
      description: '56手目: 後手 同　金',
    },
    // 57手目: ７九玉(69)
    {
      from: { row: 8 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 8 as BoardIndex, col: 0 as BoardIndex },
      description: '57手目: 先手 ７九玉',
    },
    // 58手目: ８八歩打
    {
      position: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      pieceType: 'fu',
      isFirstPlayer: false,
      description: '58手目: 後手 ８八歩打',
    },
    // 59手目: 同　金(78)
    {
      from: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      description: '59手目: 先手 同　金',
    },
    // 60手目: ８七歩打
    {
      position: { row: 6 as BoardIndex, col: 1 as BoardIndex },
      pieceType: 'fu',
      isFirstPlayer: false,
      description: '60手目: 後手 ８七歩打',
    },
    // 61手目: ７七金(88)
    {
      from: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 2 as BoardIndex },
      description: '61手目: 先手 ７七金',
    },
    // 62手目: ８八歩成(87)
    {
      from: { row: 6 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      shouldPromote: true,
      description: '62手目: 後手 ８八歩成',
    },
    // 63手目: 同　飛(28)
    {
      from: { row: 7 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      description: '63手目: 先手 同　飛',
    },
    // 64手目: 同　飛成(86)
    {
      from: { row: 5 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      shouldPromote: true,
      description: '64手目: 後手 同　飛成',
    },
    // 65手目: 同　玉(79)
    {
      from: { row: 8 as BoardIndex, col: 0 as BoardIndex },
      to: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      description: '65手目: 先手 同　玉',
    },
    // 66手目: ８五飛打
    {
      position: { row: 4 as BoardIndex, col: 1 as BoardIndex },
      pieceType: 'hisha',
      isFirstPlayer: false,
      description: '66手目: 後手 ８五飛打',
    },
    // 67手目: ８七飛打
    {
      position: { row: 6 as BoardIndex, col: 1 as BoardIndex },
      pieceType: 'hisha',
      isFirstPlayer: true,
      description: '67手目: 先手 ８七飛打',
    },
    // 68手目: 同　飛成(85)
    {
      from: { row: 4 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 1 as BoardIndex },
      shouldPromote: true,
      description: '68手目: 後手 同　飛成',
    },
    // 69手目: 同　金(77)
    {
      from: { row: 6 as BoardIndex, col: 2 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 1 as BoardIndex },
      description: '69手目: 先手 同　金',
    },
    // 70手目: ２八飛打
    {
      position: { row: 7 as BoardIndex, col: 7 as BoardIndex },
      pieceType: 'hisha',
      isFirstPlayer: false,
      description: '70手目: 後手 ２八飛打',
    },
    // 71手目: ７八歩打
    {
      position: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      pieceType: 'fu',
      isFirstPlayer: true,
      description: '71手目: 先手 ７八歩打',
    },
    // 72手目: ２五飛成(28)
    {
      from: { row: 7 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 6 as BoardIndex },
      shouldPromote: true,
      description: '72手目: 後手 ２五飛成',
    },
    // 73手目: ７一飛打
    {
      position: { row: 0 as BoardIndex, col: 8 as BoardIndex },
      pieceType: 'hisha',
      isFirstPlayer: true,
      description: '73手目: 先手 ７一飛打',
    },
    // 74手目: ３二玉(31)
    {
      from: { row: 0 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 7 as BoardIndex },
      description: '74手目: 後手 ３二玉',
    },
    // 75手目: ２六歩打
    {
      position: { row: 5 as BoardIndex, col: 7 as BoardIndex },
      pieceType: 'fu',
      isFirstPlayer: true,
      description: '75手目: 先手 ２六歩打',
    },
    // 76手目: 同　龍(25)
    {
      from: { row: 4 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 5 as BoardIndex, col: 7 as BoardIndex },
      description: '76手目: 後手 同　龍',
    },
    // 77手目: ４一角打
    {
      position: { row: 0 as BoardIndex, col: 3 as BoardIndex },
      pieceType: 'kaku',
      isFirstPlayer: true,
      description: '77手目: 先手 ４一角打',
    },
    // 78手目: ３三玉(32)
    {
      from: { row: 1 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 2 as BoardIndex, col: 6 as BoardIndex },
      description: '78手目: 後手 ３三玉',
    },
    // 79手目: ６三角成(41)
    {
      position: { row: 0 as BoardIndex, col: 3 as BoardIndex },
      pieceType: 'uma',
      isFirstPlayer: true,
      description: '79手目: 先手 ６三角成',
    },
    // 80手目: ２九龍(26)
    {
      from: { row: 5 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 8 as BoardIndex, col: 6 as BoardIndex },
      description: '80手目: 後手 ２九龍',
    },
    // 81手目: ２五歩打
    {
      position: { row: 4 as BoardIndex, col: 7 as BoardIndex },
      pieceType: 'fu',
      isFirstPlayer: true,
      description: '81手目: 先手 ２五歩打',
    },
    // 82手目: ５一桂打
    {
      position: { row: 0 as BoardIndex, col: 4 as BoardIndex },
      pieceType: 'keima',
      isFirstPlayer: false,
      description: '82手目: 後手 ５一桂打',
    },
    // 83手目: ５二馬(63)
    {
      from: { row: 2 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 4 as BoardIndex },
      description: '83手目: 先手 ５二馬',
    },
    // 84手目: ３二金(22)
    {
      from: { row: 2 as BoardIndex, col: 7 as BoardIndex },
      to: { row: 1 as BoardIndex, col: 7 as BoardIndex },
      description: '84手目: 後手 ３二金',
    },
    // 85手目: ４一銀打
    {
      position: { row: 0 as BoardIndex, col: 3 as BoardIndex },
      pieceType: 'gin',
      isFirstPlayer: true,
      description: '85手目: 先手 ４一銀打',
    },
    // 86手目: ５四角打
    {
      position: { row: 3 as BoardIndex, col: 1 as BoardIndex },
      pieceType: 'kaku',
      isFirstPlayer: false,
      description: '86手目: 後手 ５四角打',
    },
    // 87手目: ４五銀(56)
    {
      from: { row: 5 as BoardIndex, col: 5 as BoardIndex },
      to: { row: 4 as BoardIndex, col: 4 as BoardIndex },
      description: '87手目: 先手 ４五銀',
    },
    // 88手目: ８七角成(54)
    {
      from: { row: 3 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 1 as BoardIndex },
      shouldPromote: true,
      description: '88手目: 後手 ８七角成',
    },
    // 89手目: 同　玉(88)
    {
      from: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 1 as BoardIndex },
      description: '89手目: 先手 同　玉',
    },
    // 90手目: ８九龍(29)
    {
      from: { row: 8 as BoardIndex, col: 6 as BoardIndex },
      to: { row: 8 as BoardIndex, col: 0 as BoardIndex },
      description: '90手目: 後手 ８九龍',
    },
    // 91手目: ８八歩打
    {
      position: { row: 7 as BoardIndex, col: 1 as BoardIndex },
      pieceType: 'fu',
      isFirstPlayer: true,
      description: '91手目: 先手 ８八歩打',
    },
    // 92手目: ８六歩打
    {
      position: { row: 5 as BoardIndex, col: 1 as BoardIndex },
      pieceType: 'fu',
      isFirstPlayer: false,
      description: '92手目: 後手 ８六歩打',
    },
    // 93手目: ７七玉(87)
    {
      from: { row: 6 as BoardIndex, col: 1 as BoardIndex },
      to: { row: 6 as BoardIndex, col: 2 as BoardIndex },
      description: '93手目: 先手 ７七玉',
    },
    // 94手目: 投了
    // 投了なのでゲームは終了（後手勝利）
  ],
};

export const allScenarios = [realGameScenario1];
