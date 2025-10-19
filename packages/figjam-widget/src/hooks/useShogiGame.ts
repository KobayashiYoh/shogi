import {
  type Board,
  type BoardIndex,
  type GameMode,
  type GameResult,
  type PieceType,
  type Position,
  INITIAL_BOARD,
  isValidMoveFromSelectedPosToTargetPos,
  calculateBoardAfterPieceMove,
  judgeGameResult,
} from 'shogi-core';

const { useSyncedState } = figma.widget;

/**
 * 将棋ゲームの状態管理フック
 */
export function useShogiGame() {
  const [gameMode, setGameMode] = useSyncedState<GameMode>('gameMode', null);
  const [board, setBoard] = useSyncedState<Board>('board', INITIAL_BOARD);
  const [isFirstPlayerTurn, setIsFirstPlayerTurn] = useSyncedState(
    'isFirstPlayerTurn',
    true
  );
  const [gameResult, setGameResult] = useSyncedState<GameResult>(
    'gameResult',
    'playing_game'
  );
  const [firstPlayerCapturedPieces, setFirstPlayerCapturedPieces] =
    useSyncedState<PieceType[]>('firstPlayerCapturedPieces', []);
  const [secondPlayerCapturedPieces, setSecondPlayerCapturedPieces] =
    useSyncedState<PieceType[]>('secondPlayerCapturedPieces', []);
  const [selectedPos, setSelectedPos] = useSyncedState<Position | null>(
    'selectedPos',
    null
  );

  /**
   * ゲーム状態を初期化する
   */
  const resetGameState = () => {
    setBoard(INITIAL_BOARD);
    setIsFirstPlayerTurn(true);
    setGameResult('playing_game');
    setFirstPlayerCapturedPieces([]);
    setSecondPlayerCapturedPieces([]);
    setSelectedPos(null);
  };

  /**
   * ゲームモード選択ハンドラー
   */
  const handleSelectGameMode = (mode: GameMode) => {
    setGameMode(mode);
    resetGameState();
  };

  /**
   * ゲーム終了後の選択ハンドラー
   */
  const handleQuit = () => {
    setGameMode(null);
    resetGameState();
  };

  /**
   * 再プレイハンドラー
   */
  const handlePlayAgain = () => {
    resetGameState();
  };

  /**
   * マスクリック時のハンドラー
   */
  const handleCellClick = (row: number, col: number) => {
    if (gameResult !== 'playing_game') {
      return;
    }

    const clickedPos: Position = {
      row: row as BoardIndex,
      col: col as BoardIndex,
    };
    const clickedPiece = board[row][col];

    if (selectedPos === null) {
      // 駒の選択
      if (clickedPiece && clickedPiece.isFirstPlayer === isFirstPlayerTurn) {
        setSelectedPos(clickedPos);
      }
    } else {
      // 駒の移動
      const isSamePosClicked =
        selectedPos.row === row && selectedPos.col === col;
      if (isSamePosClicked) {
        setSelectedPos(null);
        return;
      }

      const isValid = isValidMoveFromSelectedPosToTargetPos(
        board,
        selectedPos,
        clickedPos
      );

      if (isValid) {
        const { newBoard, capturedPiece } = calculateBoardAfterPieceMove(
          board,
          selectedPos,
          clickedPos,
          false
        );

        setBoard(newBoard);

        if (capturedPiece) {
          if (isFirstPlayerTurn) {
            setFirstPlayerCapturedPieces([
              ...firstPlayerCapturedPieces,
              capturedPiece,
            ]);
          } else {
            setSecondPlayerCapturedPieces([
              ...secondPlayerCapturedPieces,
              capturedPiece,
            ]);
          }
        }

        setSelectedPos(null);
        setIsFirstPlayerTurn(!isFirstPlayerTurn);

        const result = judgeGameResult(newBoard);
        setGameResult(result);
      } else {
        // 別の自分の駒を選択
        if (
          clickedPiece &&
          clickedPiece.isFirstPlayer === isFirstPlayerTurn
        ) {
          setSelectedPos(clickedPos);
        } else {
          setSelectedPos(null);
        }
      }
    }
  };

  return {
    gameMode,
    board,
    isFirstPlayerTurn,
    gameResult,
    firstPlayerCapturedPieces,
    secondPlayerCapturedPieces,
    selectedPos,
    handleSelectGameMode,
    handleQuit,
    handlePlayAgain,
    handleCellClick,
  };
}
