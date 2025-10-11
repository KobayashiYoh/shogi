import ShogiBoard from './components/ShogiBoard';
import GameInfo from './components/GameInfo';
import { useShogiGame } from './hooks/useShogiGame';
import './App.css';

/**
 * メインアプリケーションコンポーネント
 */
function App() {
  const { gameState, possibleMoves, handleSquareClick, resetGame } =
    useShogiGame();

  return (
    <div className="app">
      <div className="game-container">
        <GameInfo
          isFirstPlayerTurn={gameState.isFirstPlayerTurn}
          gameResult={gameState.gameResult}
          onResetGame={resetGame}
        />
        <ShogiBoard
          board={gameState.board}
          selectedPosition={gameState.selectedPosition}
          possibleMoves={possibleMoves}
          onSquareClick={handleSquareClick}
        />
      </div>
    </div>
  );
}

export default App;
