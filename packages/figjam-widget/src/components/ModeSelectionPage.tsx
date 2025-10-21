/** @jsx figma.widget.h */

import type { GameMode } from 'shogi-core';
import { INITIAL_BOARD } from 'shogi-core';
import { COLORS, LAYOUT } from '../constants';
import { GameLayout } from './GameLayout';
import { MenuModal } from './MenuModal';

const { AutoLayout } = figma.widget;

/**
 * モード選択ページのProps
 */
export interface ModeSelectionPageProps {
  onSelectGameMode: (mode: GameMode) => void;
}

/**
 * モード選択ページ
 */
export function ModeSelectionPage({
  onSelectGameMode,
}: ModeSelectionPageProps) {
  return (
    <AutoLayout
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      width={LAYOUT.WIDTH}
      height={LAYOUT.HEIGHT}
    >
      <GameLayout
        board={INITIAL_BOARD}
        firstPlayerCapturedPieces={[]}
        secondPlayerCapturedPieces={[]}
        isBlurred={true}
      />

      <MenuModal
        title="Select game mode"
        buttons={[
          {
            title: '1 Player',
            description: 'vs CPU',
            onClick: () => onSelectGameMode('cpu'),
          },
          {
            title: '2 Player',
            description: 'vs Player',
            onClick: () => onSelectGameMode('two-player'),
          },
        ]}
      />
    </AutoLayout>
  );
}
