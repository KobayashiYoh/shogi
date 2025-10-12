import React from 'react';
import type { GameResult } from '@shogi/core';
import { GAME_TEXT } from '@shogi/core';
import './GameInfo.css';

interface GameInfoProps {
  isFirstPlayerTurn: boolean;
  gameResult: GameResult;
  onResetGame: () => void;
}

/**
 * ゲーム情報を表示するコンポーネント
 */
const GameInfo: React.FC<GameInfoProps> = ({
  isFirstPlayerTurn,
  gameResult,
  onResetGame,
}) => {
  const isGameOver = gameResult !== 'playing_game';

  if (isGameOver) {
    const winnerText =
      gameResult === 'first_player_wins'
        ? GAME_TEXT.FIRST_PLAYER
        : GAME_TEXT.SECOND_PLAYER;

    return (
      <div className="game-info">
        <div className="game-over">
          <h2>ゲーム終了</h2>
          <p className="winner">{winnerText}の勝利！</p>
          <button onClick={onResetGame} className="reset-button">
            新しいゲーム
          </button>
        </div>
      </div>
    );
  }

  const currentPlayerText = isFirstPlayerTurn
    ? GAME_TEXT.FIRST_PLAYER
    : GAME_TEXT.SECOND_PLAYER;

  return (
    <div className="game-info">
      <div className="game-status">
        <h2>現在の手番</h2>
        <p
          className={`current-player ${isFirstPlayerTurn ? 'first-player' : 'second-player'}`}
        >
          {currentPlayerText}
        </p>
      </div>
    </div>
  );
};

export default GameInfo;
