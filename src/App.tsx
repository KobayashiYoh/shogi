import ShogiBoard from './components/ShogiBoard';
import GameInfo from './components/GameInfo';
import { CapturedPieces } from './components/CapturedPieces';
import PromotionDialog from './components/PromotionDialog';
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
  } = useShogiGame();

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
