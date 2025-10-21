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
  enablePromotionAfterMove,
  isAutomaticPromotion,
  isPromotedPiece,
  selectCpuMove,
  shouldCpuPromote,
} from "shogi-core";

const { useSyncedState } = figma.widget;

/**
 * 将棋ゲームの状態管理フック
 */
export function useShogiGame() {
  const [gameMode, setGameMode] = useSyncedState<GameMode>("gameMode", null);
  const [board, setBoard] = useSyncedState<Board>("board", INITIAL_BOARD);
  const [isFirstPlayerTurn, setIsFirstPlayerTurn] = useSyncedState(
    "isFirstPlayerTurn",
    true
  );
  const [gameResult, setGameResult] = useSyncedState<GameResult>(
    "gameResult",
    "playing_game"
  );
  const [firstPlayerCapturedPieces, setFirstPlayerCapturedPieces] =
    useSyncedState<PieceType[]>("firstPlayerCapturedPieces", []);
  const [secondPlayerCapturedPieces, setSecondPlayerCapturedPieces] =
    useSyncedState<PieceType[]>("secondPlayerCapturedPieces", []);
  const [selectedPos, setSelectedPos] = useSyncedState<Position | null>(
    "selectedPos",
    null
  );
  const [pendingMove, setPendingMove] = useSyncedState<{
    from: Position;
    to: Position;
  } | null>("pendingMove", null);

  /**
   * ゲーム状態を初期化する
   */
  const resetGameState = () => {
    setBoard(INITIAL_BOARD);
    setIsFirstPlayerTurn(true);
    setGameResult("playing_game");
    setFirstPlayerCapturedPieces([]);
    setSecondPlayerCapturedPieces([]);
    setSelectedPos(null);
    setPendingMove(null);
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
   * 取得した駒を持ち駒に追加する
   */
  const addCapturedPieceToPlayer = (
    capturedPiece: PieceType,
    isFirstPlayer: boolean
  ) => {
    if (isFirstPlayer) {
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
  };

  /**
   * 駒の移動を実行する
   */
  const executePieceMove = async (
    from: Position,
    to: Position,
    shouldPromote: boolean
  ) => {
    const currentPlayerIsFirst = isFirstPlayerTurn;

    const { newBoard, capturedPiece } = calculateBoardAfterPieceMove(
      board,
      from,
      to,
      shouldPromote
    );

    setBoard(newBoard);

    if (capturedPiece) {
      addCapturedPieceToPlayer(capturedPiece, currentPlayerIsFirst);
    }

    setSelectedPos(null);
    setPendingMove(null);
    setIsFirstPlayerTurn(!currentPlayerIsFirst);

    const result = judgeGameResult(newBoard);
    setGameResult(result);

    // CPUのターンの場合、1秒後にCPUの手を実行
    const shouldExecuteCpuMove =
      gameMode === "cpu" && result === "playing_game" && currentPlayerIsFirst;

    if (shouldExecuteCpuMove) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const cpuMove = selectCpuMove(newBoard, secondPlayerCapturedPieces);
      if (!cpuMove) {
        return;
      }

      const { fromPos, toPos, piece, capturedPieceType } = cpuMove;

      // 持ち駒を使う場合
      if (capturedPieceType && fromPos === null) {
        const hasCapturedPiece =
          secondPlayerCapturedPieces.includes(capturedPieceType);
        console.log("[CPU] 持ち駒があるか:", hasCapturedPiece);
        if (!hasCapturedPiece) {
          console.log("[CPU] 持ち駒がないため配置をスキップ");
          return;
        }

        const cpuNewBoard: Board = newBoard.map((row) => [...row]);
        cpuNewBoard[toPos.row][toPos.col] = piece;

        setBoard(cpuNewBoard);

        setSecondPlayerCapturedPieces((prev) => {
          const updated = [...prev];
          const index = updated.indexOf(capturedPieceType);
          if (index > -1) {
            updated.splice(index, 1);
          }
          return updated;
        });

        setIsFirstPlayerTurn(true);

        const cpuResult = judgeGameResult(cpuNewBoard);
        setGameResult(cpuResult);
        return;
      }

      // 盤上の駒を動かす場合
      if (!fromPos) {
        return;
      }

      const shouldPromoteCpu = shouldCpuPromote(
        fromPos,
        toPos,
        piece.type,
        false
      );

      const { newBoard: cpuNewBoard, capturedPiece: cpuCapturedPiece } =
        calculateBoardAfterPieceMove(
          newBoard,
          fromPos,
          toPos,
          shouldPromoteCpu
        );

      setBoard(cpuNewBoard);

      if (cpuCapturedPiece) {
        setSecondPlayerCapturedPieces((prev) => [...prev, cpuCapturedPiece]);
      }

      setIsFirstPlayerTurn(true);

      const cpuResult = judgeGameResult(cpuNewBoard);
      setGameResult(cpuResult);
    }
  };

  /**
   * 成り選択ハンドラー
   */
  const handlePromotionChoice = async (shouldPromote: boolean) => {
    if (!pendingMove) {
      return;
    }
    await executePieceMove(pendingMove.from, pendingMove.to, shouldPromote);
  };

  /**
   * 駒の選択処理
   */
  const handlePieceSelection = (
    clickedPos: Position,
    clickedPiece: Board[number][number]
  ) => {
    const isCpuMode = gameMode === "cpu";
    const canSelectPiece = isCpuMode
      ? clickedPiece && clickedPiece.isFirstPlayer === true
      : clickedPiece && clickedPiece.isFirstPlayer === isFirstPlayerTurn;

    if (canSelectPiece) {
      setSelectedPos(clickedPos);
    }
  };

  /**
   * 駒の移動処理
   */
  const handlePieceMovement = async (
    clickedPos: Position,
    clickedPiece: Board[number][number],
    selectedPos: Position
  ) => {
    const isSamePosClicked =
      selectedPos.row === clickedPos.row && selectedPos.col === clickedPos.col;
    if (isSamePosClicked) {
      setSelectedPos(null);
      return;
    }

    const isValidMove = isValidMoveFromSelectedPosToTargetPos(
      board,
      selectedPos,
      clickedPos
    );

    if (isValidMove) {
      await handleValidMove(selectedPos, clickedPos);
      return;
    }

    // 無効な移動：別の自分の駒を選択する処理
    const isOwnPiece =
      clickedPiece && clickedPiece.isFirstPlayer === isFirstPlayerTurn;
    if (isOwnPiece) {
      setSelectedPos(clickedPos);
    } else {
      setSelectedPos(null);
    }
  };

  /**
   * 有効な移動の処理（成り判定を含む）
   */
  const handleValidMove = async (from: Position, to: Position) => {
    const movingPiece = board[from.row][from.col];
    if (!movingPiece) {
      return;
    }

    const isAlreadyPromoted = isPromotedPiece(movingPiece.type);
    if (isAlreadyPromoted) {
      await executePieceMove(from, to, false);
      return;
    }

    const mustPromote = isAutomaticPromotion(
      to,
      movingPiece.type,
      isFirstPlayerTurn
    );
    if (mustPromote) {
      await executePieceMove(from, to, true);
      return;
    }

    const canPromote = enablePromotionAfterMove(
      from,
      to,
      movingPiece.type,
      isFirstPlayerTurn
    );
    if (canPromote) {
      setPendingMove({ from, to });
      setSelectedPos(null);
      return;
    }

    await executePieceMove(from, to, false);
  };

  /**
   * マスクリック時のハンドラー
   */
  const handleCellClick = async (row: number, col: number) => {
    const isGameOver = gameResult !== "playing_game";
    if (isGameOver) {
      return;
    }

    const isCpuTurn = gameMode === "cpu" && !isFirstPlayerTurn;
    if (isCpuTurn) {
      return;
    }

    const clickedPos: Position = {
      row: row as BoardIndex,
      col: col as BoardIndex,
    };
    const clickedPiece = board[row][col];

    if (selectedPos === null) {
      handlePieceSelection(clickedPos, clickedPiece);
      return;
    }

    await handlePieceMovement(clickedPos, clickedPiece, selectedPos);
  };

  return {
    gameMode,
    board,
    isFirstPlayerTurn,
    gameResult,
    firstPlayerCapturedPieces,
    secondPlayerCapturedPieces,
    selectedPos,
    pendingMove,
    handleSelectGameMode,
    handleQuit,
    handlePlayAgain,
    handleCellClick,
    handlePromotionChoice,
  };
}
