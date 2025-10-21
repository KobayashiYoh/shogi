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
    isFirstPlayerTurn,
    gameResult,
    firstPlayerCapturedPieces,
    secondPlayerCapturedPieces,
    selectedPos,
    pendingMove,
    selectedCapturedPiece,
    possibleMoves,
    handleSelectGameMode,
    handleQuit,
    handlePlayAgain,
    handleCellClick,
    handlePromotionChoice,
    handleCapturedPieceClick,
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
        board={board}
        firstPlayerCapturedPieces={firstPlayerCapturedPieces}
        secondPlayerCapturedPieces={secondPlayerCapturedPieces}
        gameResult={gameResult}
        gameMode={gameMode}
      />
    );
  }

  return (
    <PlayingPage
      board={board}
      firstPlayerCapturedPieces={firstPlayerCapturedPieces}
      secondPlayerCapturedPieces={secondPlayerCapturedPieces}
      selectedPos={selectedPos}
      possibleMoves={possibleMoves}
      selectedCapturedPiece={selectedCapturedPiece}
      isFirstPlayerTurn={isFirstPlayerTurn}
      pendingMove={pendingMove}
      onCellClick={handleCellClick}
      onPromotionChoice={handlePromotionChoice}
      onCapturedPieceClick={handleCapturedPieceClick}
    />
  );
}
