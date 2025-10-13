import type { BoardIndex } from "../../src/types";

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
  expectedResult: "first_player_wins" | "second_player_wins";
}

const scenario: GameScenario = {
  name: "最短決着",
  description: "先手の歩で後手勝利",
  expectedResult: "second_player_wins",
  moves: [
    // 先手 ２六歩 (6,1 → 5,1)
    {
      from: { row: 6, col: 1 },
      to: { row: 5, col: 1 },
      description: "先手 ２六歩",
    },

    // 後手 ４二玉 (0,4 → 1,4)
    {
      from: { row: 0, col: 4 },
      to: { row: 1, col: 4 },
      description: "後手 ４二玉",
    },

    // 先手 ２五歩 (5,1 → 4,1)
    {
      from: { row: 5, col: 1 },
      to: { row: 4, col: 1 },
      description: "先手 ２五歩",
    },

    // 後手 ３二玉 (1,4 → 2,4)
    {
      from: { row: 1, col: 4 },
      to: { row: 2, col: 4 },
      description: "後手 ３二玉",
    },

    // 先手 ２四歩 (4,1 → 3,1)
    {
      from: { row: 4, col: 1 },
      to: { row: 3, col: 1 },
      description: "先手 ２四歩",
    },

    // 後手 ４二飛 (1,1 → 3,1)
    {
      from: { row: 1, col: 1 },
      to: { row: 3, col: 1 },
      description: "後手 ４二飛",
    },

    // 先手 ２三歩成 (3,1 → 2,1, 成り)
    {
      from: { row: 3, col: 1 },
      to: { row: 2, col: 1 },
      shouldPromote: true,
      description: "先手 ２三歩成",
    },
  ],
};

export const allScenarios = [scenario];
