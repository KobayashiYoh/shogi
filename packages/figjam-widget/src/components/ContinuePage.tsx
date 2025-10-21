/** @jsx figma.widget.h */

import type { Board, GameMode, GameResult, PieceType } from 'shogi-core';
import { LAYOUT } from '../constants';
import { getWinnerMessage } from '../utils';
import { GameLayout } from './GameLayout';
import { MenuModal } from './MenuModal';

const { AutoLayout } = figma.widget;

/**
 * ゲーム終了ページのProps
 */
export interface ContinuePageProps {
  onQuit: () => void;
  onPlayAgain: () => void;
  board: Board;
  firstPlayerCapturedPieces: PieceType[];
  secondPlayerCapturedPieces: PieceType[];
  gameResult: GameResult;
  gameMode: GameMode;
}

/**
 * ゲーム終了ページ
 */
export function ContinuePage({
  onQuit,
  onPlayAgain,
  board,
  firstPlayerCapturedPieces,
  secondPlayerCapturedPieces,
  gameResult,
  gameMode,
}: ContinuePageProps) {
  const title = getWinnerMessage(gameResult, gameMode);

  return (
    <AutoLayout
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      width={LAYOUT.WIDTH}
      height={LAYOUT.HEIGHT}
    >
      <GameLayout
        board={board}
        firstPlayerCapturedPieces={firstPlayerCapturedPieces}
        secondPlayerCapturedPieces={secondPlayerCapturedPieces}
        isBlurred={true}
      />

      <MenuModal
        title={title}
        buttons={[
          {
            title: 'Quit',
            description: `Back to game\nmode selection.`,
            onClick: onQuit,
          },
          {
            title: 'Play again',
            description: `Play again with\nthe same mode.`,
            onClick: onPlayAgain,
          },
        ]}
      />
    </AutoLayout>
  );
}
