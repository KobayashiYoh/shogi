import type { GameMode, GameResult } from 'shogi-core';

/**
 * 勝者メッセージを生成する
 */
export function getWinnerMessage(
  gameResult: GameResult,
  gameMode: GameMode
): string {
  if (gameResult === 'first_player_wins') {
    return '1P Wins!';
  }

  if (gameResult === 'second_player_wins') {
    if (gameMode === 'cpu') {
      return 'CPU Wins!';
    }
    return '2P Wins!';
  }

  return 'Continue?';
}
