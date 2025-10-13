import ShogiBoard from './components/ShogiBoard';
import GameInfo from './components/GameInfo';
import { CapturedPieces } from './components/CapturedPieces';
import PromotionDialog from './components/PromotionDialog';
import ModeSelection from './components/ModeSelection';
import { useShogiGame } from './hooks/useShogiGame';
import './App.css';

/**
 * メインアプリケーションコンポーネント
 */
function App() {
  const {
    gameState,
    possibleMoves,
    handleSquareClick,
    resetGame,
    selectedCapturedPiece,
    handleCapturedPieceClick,
    handlePromote,
    handleDeclinePromotion,
    setGameMode,
  } = useShogiGame();

  const handleSelectSinglePlayer = () => {
    setGameMode('cpu');
  };

  const handleSelectTwoPlayer = () => {
    setGameMode('two-player');
  };

  if (!gameState.gameMode) {
    return (
      <ModeSelection
        onSelectSinglePlayer={handleSelectSinglePlayer}
        onSelectTwoPlayer={handleSelectTwoPlayer}
      />
    );
  }

  return (
    <div className="app">
      <div className="game-container">
        <GameInfo
          isFirstPlayerTurn={gameState.isFirstPlayerTurn}
          gameResult={gameState.gameResult}
          onResetGame={resetGame}
        />
        <CapturedPieces
          capturedPieces={gameState.capturedPiecesBySecondPlayer}
          isFirstPlayer={false}
          isMyTurn={!gameState.isFirstPlayerTurn}
          selectedPiece={selectedCapturedPiece}
          onPieceClick={handleCapturedPieceClick}
        />
        <ShogiBoard
          board={gameState.board}
          selectedPosition={gameState.selectedPosition}
          possibleMoves={possibleMoves}
          onSquareClick={handleSquareClick}
        />
        <CapturedPieces
          capturedPieces={gameState.capturedPiecesByFirstPlayer}
          isFirstPlayer={true}
          isMyTurn={gameState.isFirstPlayerTurn}
          selectedPiece={selectedCapturedPiece}
          onPieceClick={handleCapturedPieceClick}
        />
      </div>
      {gameState.promotionChoice && (
        <PromotionDialog
          pieceType={gameState.promotionChoice.pieceType}
          onPromote={handlePromote}
          onDecline={handleDeclinePromotion}
          mustPromote={gameState.promotionChoice.mustPromote}
        />
      )}
    </div>
  );
}

export default App;
