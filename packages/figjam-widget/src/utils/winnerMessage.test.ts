import { describe, it, expect } from 'vitest';
import { getWinnerMessage } from './winnerMessage';

/**
 * 勝者メッセージ生成のユニットテスト
 */
describe('getWinnerMessage', () => {
  describe('1Pが勝利した場合', () => {
    it('first_player_winsの場合は"1P Wins!"を返す', () => {
      const result = getWinnerMessage('first_player_wins', 'two-player');
      expect(result).toBe('1P Wins!');
    });

    it('CPUモードでfirst_player_winsの場合も"1P Wins!"を返す', () => {
      const result = getWinnerMessage('first_player_wins', 'cpu');
      expect(result).toBe('1P Wins!');
    });
  });

  describe('2P/CPUが勝利した場合', () => {
    it('two-playerモードでsecond_player_winsの場合は"2P Wins!"を返す', () => {
      const result = getWinnerMessage('second_player_wins', 'two-player');
      expect(result).toBe('2P Wins!');
    });

    it('cpuモードでsecond_player_winsの場合は"CPU Wins!"を返す', () => {
      const result = getWinnerMessage('second_player_wins', 'cpu');
      expect(result).toBe('CPU Wins!');
    });
  });

  describe('ゲーム中の場合', () => {
    it('playing_gameの場合は"Continue?"を返す', () => {
      const result = getWinnerMessage('playing_game', 'two-player');
      expect(result).toBe('Continue?');
    });

    it('CPUモードでplaying_gameの場合も"Continue?"を返す', () => {
      const result = getWinnerMessage('playing_game', 'cpu');
      expect(result).toBe('Continue?');
    });
  });
});
