/** @jsx figma.widget.h */

import type { Board, PieceType } from 'shogi-core';
import { COLORS, LAYOUT } from '../constants';
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
}: ContinuePageProps) {
  return (
    <AutoLayout
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      width={LAYOUT.WIDTH}
      height={LAYOUT.HEIGHT}
      fill={COLORS.BACKGROUND}
    >
      <GameLayout
        board={board}
        firstPlayerCapturedPieces={firstPlayerCapturedPieces}
        secondPlayerCapturedPieces={secondPlayerCapturedPieces}
      />

      <MenuModal
        title="Continue?"
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
