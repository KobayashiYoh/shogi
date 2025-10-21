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
  canPlaceCapturedPiece,
  placeCapturedPiece,
  removeCapturedPiece,
  getMovablePositions,
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
  const [selectedCapturedPiece, setSelectedCapturedPiece] =
    useSyncedState<PieceType | null>("selectedCapturedPiece", null);
  const [possibleMoves, setPossibleMoves] = useSyncedState<Position[]>(
    "possibleMoves",
    []
  );

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
    setSelectedCapturedPiece(null);
    setPossibleMoves([]);
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
      return;
    }

    setSecondPlayerCapturedPieces([
      ...secondPlayerCapturedPieces,
      capturedPiece,
    ]);
  };

  /**
   * CPUが持ち駒を配置する
   */
  const executeCpuCapturedPiecePlacement = (
    currentBoard: Board,
    toPos: Position,
    piece: Board[number][number],
    capturedPieceType: PieceType
  ) => {
    const hasCapturedPiece =
      secondPlayerCapturedPieces.includes(capturedPieceType);
    if (!hasCapturedPiece) {
      return;
    }

    const cpuNewBoard: Board = currentBoard.map((row) => [...row]);
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
  };

  /**
   * CPUが盤上の駒を移動する
   */
  const executeCpuBoardPieceMove = (
    currentBoard: Board,
    fromPos: Position,
    toPos: Position,
    piece: Board[number][number]
  ) => {
    if (!piece) {
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
        currentBoard,
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
  };

  /**
   * CPU処理を実行する
   */
  const executeCpuMove = async (currentBoard: Board) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const cpuMove = selectCpuMove(currentBoard, secondPlayerCapturedPieces);
    if (!cpuMove) {
      return;
    }

    const { fromPos, toPos, piece, capturedPieceType } = cpuMove;

    const isCapturedPieceMove = capturedPieceType && fromPos === null;
    if (isCapturedPieceMove) {
      executeCpuCapturedPiecePlacement(
        currentBoard,
        toPos,
        piece,
        capturedPieceType
      );
      return;
    }

    if (!fromPos) {
      return;
    }

    executeCpuBoardPieceMove(currentBoard, fromPos, toPos, piece);
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
    setPossibleMoves([]);
    setIsFirstPlayerTurn(!currentPlayerIsFirst);

    const result = judgeGameResult(newBoard);
    setGameResult(result);

    const shouldExecuteCpuMove =
      gameMode === "cpu" && result === "playing_game" && currentPlayerIsFirst;

    if (shouldExecuteCpuMove) {
      await executeCpuMove(newBoard);
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
   * 持ち駒クリックハンドラー
   */
  const handleCapturedPieceClick = (pieceType: PieceType) => {
    const isCpuTurn = gameMode === "cpu" && !isFirstPlayerTurn;
    if (isCpuTurn) {
      return;
    }

    const isSamePieceClicked = selectedCapturedPiece === pieceType;
    if (isSamePieceClicked) {
      setSelectedCapturedPiece(null);
      return;
    }

    setSelectedCapturedPiece(pieceType);
    setSelectedPos(null);
    setPossibleMoves([]);
  };

  /**
   * 駒の選択処理
   */
  const handlePieceSelection = (
    clickedPos: Position,
    clickedPiece: Board[number][number]
  ) => {
    const isCpuMode = gameMode === "cpu";
    const isFirstPlayerPiece = clickedPiece?.isFirstPlayer === true;
    const isCurrentPlayerPiece =
      clickedPiece?.isFirstPlayer === isFirstPlayerTurn;

    const canSelectPiece = isCpuMode ? isFirstPlayerPiece : isCurrentPlayerPiece;

    if (!canSelectPiece) {
      return;
    }

    setSelectedPos(clickedPos);

    if (clickedPiece) {
      const moves = getMovablePositions(board, clickedPos, clickedPiece);
      setPossibleMoves(moves);
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
      setPossibleMoves([]);
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

    const isOwnPiece =
      clickedPiece?.isFirstPlayer === isFirstPlayerTurn;
    if (isOwnPiece) {
      setSelectedPos(clickedPos);
      const moves = getMovablePositions(board, clickedPos, clickedPiece);
      setPossibleMoves(moves);
      return;
    }

    setSelectedPos(null);
    setPossibleMoves([]);
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
   * 持ち駒の配置を実行する
   */
  const handleCapturedPiecePlacement = async (clickedPos: Position) => {
    if (selectedCapturedPiece === null) {
      return;
    }

    const canPlace = canPlaceCapturedPiece(board, clickedPos);
    if (!canPlace) {
      return;
    }

    const newBoard = placeCapturedPiece(
      board,
      clickedPos,
      selectedCapturedPiece,
      isFirstPlayerTurn
    );

    const capturedPiecesToUpdate = isFirstPlayerTurn
      ? firstPlayerCapturedPieces
      : secondPlayerCapturedPieces;
    const updatedCapturedPieces = removeCapturedPiece(
      capturedPiecesToUpdate,
      selectedCapturedPiece
    );

    if (isFirstPlayerTurn) {
      setFirstPlayerCapturedPieces(updatedCapturedPieces);
    } else {
      setSecondPlayerCapturedPieces(updatedCapturedPieces);
    }

    setBoard(newBoard);
    setSelectedCapturedPiece(null);

    const currentPlayerIsFirst = isFirstPlayerTurn;
    setIsFirstPlayerTurn(!currentPlayerIsFirst);

    const result = judgeGameResult(newBoard);
    setGameResult(result);

    const shouldExecuteCpuMove =
      gameMode === "cpu" && result === "playing_game" && currentPlayerIsFirst;

    if (shouldExecuteCpuMove) {
      await executeCpuMove(newBoard);
    }
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

    if (selectedCapturedPiece !== null) {
      await handleCapturedPiecePlacement(clickedPos);
      return;
    }

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
    selectedCapturedPiece,
    possibleMoves,
    handleSelectGameMode,
    handleQuit,
    handlePlayAgain,
    handleCellClick,
    handlePromotionChoice,
    handleCapturedPieceClick,
  };
}
