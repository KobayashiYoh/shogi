/** @jsx figma.widget.h */

import { ContinuePage, ModeSelectionPage, PlayingPage } from './components';
import { useShogiGame } from './hooks/useShogiGame';

export default function () {
  figma.widget.register(ShogiWidget);
}

/**
 * 将棋Widget メインコンポーネント
 */
function ShogiWidget() {
  const {
    gameMode,
    board,
    gameResult,
    firstPlayerCapturedPieces,
    secondPlayerCapturedPieces,
    selectedPos,
    handleSelectGameMode,
    handleQuit,
    handlePlayAgain,
    handleCellClick,
  } = useShogiGame();

  // シーン分岐
  if (gameMode === null) {
    return <ModeSelectionPage onSelectGameMode={handleSelectGameMode} />;
  }

  if (gameResult !== 'playing_game') {
    return (
      <ContinuePage
        onQuit={handleQuit}
        onPlayAgain={handlePlayAgain}
        firstPlayerCapturedPieces={firstPlayerCapturedPieces}
        secondPlayerCapturedPieces={secondPlayerCapturedPieces}
      />
    );
  }

  return (
    <PlayingPage
      board={board}
      firstPlayerCapturedPieces={firstPlayerCapturedPieces}
      secondPlayerCapturedPieces={secondPlayerCapturedPieces}
      selectedPos={selectedPos}
      onCellClick={handleCellClick}
    />
  );
}
