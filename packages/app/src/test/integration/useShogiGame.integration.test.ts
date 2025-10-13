import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useShogiGame } from '../../hooks/useShogiGame';
import { allScenarios } from '@shogi/core/test/fixtures/gameScenarios';
import type { BoardIndex } from '@shogi/core';

/**
 * useShogiGameの統合テスト
 * coreパッケージのテストシナリオを使用して、対局開始から終了までの一連の流れをテスト
 */
describe('useShogiGame integration tests', () => {
  describe('実戦対局シミュレーション', () => {
    allScenarios.forEach((scenario) => {
      it(`${scenario.name}: ${scenario.description}`, () => {
        const { result } = renderHook(() => useShogiGame());

        // ゲームモードを人対人に設定
        act(() => {
          result.current.setGameMode('two-player');
        });

        // シナリオの各手を実行
        scenario.moves.forEach((move) => {
          if ('from' in move) {
            // 駒の移動
            const { from, to, shouldPromote } = move;

            // 駒を選択
            act(() => {
              result.current.handleSquareClick(from);
            });

            // 選択された駒が正しいことを確認
            expect(result.current.gameState.selectedPosition).toEqual(from);

            // 駒を移動
            act(() => {
              result.current.handleSquareClick(to);
            });

            // 成り選択ダイアログが表示された場合
            if (result.current.gameState.promotionChoice) {
              act(() => {
                if (shouldPromote) {
                  result.current.handlePromote();
                } else {
                  result.current.handleDeclinePromotion();
                }
              });
            }

            expect(result.current.gameState.selectedPosition).toBeNull();
          } else {
            // 持ち駒の配置
            const { position, pieceType } = move;

            // 持ち駒を選択
            act(() => {
              result.current.handleCapturedPieceClick(pieceType as any);
            });

            // 持ち駒が選択されたことを確認
            expect(result.current.selectedCapturedPiece).toBe(pieceType);

            // 盤面に配置
            act(() => {
              result.current.handleSquareClick(position);
            });

            // 持ち駒の選択が解除されたことを確認
            expect(result.current.selectedCapturedPiece).toBeNull();
          }
        });

        // 最終的なゲーム結果を確認
        expect(result.current.gameState.gameResult).toBe(scenario.expectedResult);
      });
    });
  });

  describe('リセット機能', () => {
    it('対局途中でリセットすると初期状態に戻る', () => {
      const { result } = renderHook(() => useShogiGame());

      // ゲームモードを設定
      act(() => {
        result.current.setGameMode('two-player');
      });

      // 数手進める
      act(() => {
        result.current.handleSquareClick({ row: 6 as BoardIndex, col: 4 as BoardIndex });
      });
      act(() => {
        result.current.handleSquareClick({ row: 5 as BoardIndex, col: 4 as BoardIndex });
      });
      act(() => {
        result.current.handleSquareClick({ row: 2 as BoardIndex, col: 4 as BoardIndex });
      });
      act(() => {
        result.current.handleSquareClick({ row: 3 as BoardIndex, col: 4 as BoardIndex });
      });

      // ゲームが進んでいることを確認
      expect(result.current.gameState.isFirstPlayerTurn).toBe(true);

      // リセット
      act(() => {
        result.current.resetGame();
      });

      // 初期状態に戻っていることを確認
      expect(result.current.gameState.gameMode).toBeNull();
      expect(result.current.gameState.isFirstPlayerTurn).toBe(true);
      expect(result.current.gameState.selectedPosition).toBeNull();
      expect(result.current.gameState.gameResult).toBe('playing_game');
      expect(result.current.gameState.capturedPiecesByFirstPlayer).toEqual([]);
      expect(result.current.gameState.capturedPiecesBySecondPlayer).toEqual([]);
    });
  });
});
