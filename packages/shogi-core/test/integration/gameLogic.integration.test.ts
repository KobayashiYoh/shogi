import { describe, it, expect } from 'vitest';
import {
  judgeGameResult,
  calculateBoardAfterPieceMove,
  canPlaceCapturedPiece,
  placeCapturedPiece,
} from '../../src/utils/gameLogic';
import type { Board, PieceType, BoardIndex } from '../../src/types';
import { INITIAL_BOARD } from '../../src/constants/initialBoard';
import {
  allScenarios,
  type Move,
  type CapturedPiecePlacement,
} from '../fixtures/gameScenarios';

/**
 * 駒の移動かどうかを判定する型ガード
 */
const isMove = (
  action: Move | CapturedPiecePlacement
): action is Move => {
  return 'from' in action;
};

/**
 * シナリオを実行してテストする共通ロジック
 */
const executeScenario = (
  scenarioMoves: (Move | CapturedPiecePlacement)[],
  expectedResult: 'first_player_wins' | 'second_player_wins'
) => {
  let board: Board = INITIAL_BOARD.map((row) => [...row]);
  let capturedPiecesFirstPlayer: PieceType[] = [];
  let capturedPiecesSecondPlayer: PieceType[] = [];

  scenarioMoves.forEach((action) => {
    if (isMove(action)) {
      const { from, to, shouldPromote } = action;
      const result = calculateBoardAfterPieceMove(
        board,
        from,
        to,
        shouldPromote
      );
      board = result.newBoard;

      if (result.capturedPiece) {
        const movingPiece = INITIAL_BOARD[from.row][from.col];
        if (movingPiece?.isFirstPlayer) {
          capturedPiecesFirstPlayer.push(result.capturedPiece);
        } else {
          capturedPiecesSecondPlayer.push(result.capturedPiece);
        }
      }
    } else {
      const { position, pieceType, isFirstPlayer } = action;
      expect(canPlaceCapturedPiece(board, position)).toBe(true);
      board = placeCapturedPiece(
        board,
        position,
        pieceType as PieceType,
        isFirstPlayer
      );

      if (isFirstPlayer) {
        capturedPiecesFirstPlayer = capturedPiecesFirstPlayer.filter(
          (p) => p !== pieceType
        );
      } else {
        capturedPiecesSecondPlayer = capturedPiecesSecondPlayer.filter(
          (p) => p !== pieceType
        );
      }
    }
  });

  const finalResult = judgeGameResult(board);
  expect(finalResult).toBe(expectedResult);

  return {
    board,
    capturedPiecesFirstPlayer,
    capturedPiecesSecondPlayer,
  };
};

describe('gameLogic integration tests', () => {
  describe('実戦対局シミュレーション', () => {
    allScenarios.forEach((scenario) => {
      it(`${scenario.name}: ${scenario.description}`, () => {
        const result = executeScenario(scenario.moves, scenario.expectedResult);

        expect(result.capturedPiecesFirstPlayer.length).toBeGreaterThanOrEqual(0);
        expect(result.capturedPiecesSecondPlayer.length).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
