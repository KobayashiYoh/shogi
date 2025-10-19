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
 * 将棋ゲームの状態
 */
export interface ShogiGameState {
  gameMode: GameMode | null;
  board: Board;
  isFirstPlayerTurn: boolean;
  gameResult: GameResult;
  firstPlayerCapturedPieces: PieceType[];
  secondPlayerCapturedPieces: PieceType[];
  selectedPos: Position | null;
}

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

  /**
   * 持ち駒を使用するCPUの手を実行
   */
  const executeCpuCapturedPieceMove = (
    currentBoard: Board,
    toPos: Position,
    piece: NonNullable<Board[number][number]>,
    capturedPieceType: PieceType
  ) => {
    const newBoard: Board = currentBoard.map((row) => [...row]);
    
    newBoard[toPos.row][toPos.col] = piece;

    setBoard(newBoard);

    setSecondPlayerCapturedPieces((prev) => {
      const updated = [...prev];
      const index = updated.indexOf(capturedPieceType);
      if (index > -1) {
        updated.splice(index, 1);
      }
      return updated;
    });

    setIsFirstPlayerTurn(true);

    const result = judgeGameResult(newBoard);
    setGameResult(result);
  };

  /**
   * 盤上の駒を動かすCPUの手を実行
   */
  const executeCpuBoardPieceMove = (
    currentBoard: Board,
    fromPos: Position,
    toPos: Position,
    pieceType: PieceType
  ) => {
    const shouldPromote = shouldCpuPromote(fromPos, toPos, pieceType, false);

    const { newBoard, capturedPiece } = calculateBoardAfterPieceMove(
      currentBoard,
      fromPos,
      toPos,
      shouldPromote
    );

    setBoard(newBoard);

    if (capturedPiece) {
      setSecondPlayerCapturedPieces((prev) => [...prev, capturedPiece]);
    }

    setIsFirstPlayerTurn(true);

    const result = judgeGameResult(newBoard);
    setGameResult(result);
  };

  /**
   * CPUの手を実行する
   */
  const executeCpuMove = async (currentBoard: Board) => {
    const cpuMove = selectCpuMove(currentBoard, secondPlayerCapturedPieces);
    if (!cpuMove) {
      return;
    }

    const { fromPos, toPos, piece, capturedPieceType } = cpuMove;

    const isCapturedPieceMove = capturedPieceType && fromPos === null;
    if (isCapturedPieceMove) {
      executeCpuCapturedPieceMove(
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

    executeCpuBoardPieceMove(currentBoard, fromPos, toPos, piece.type);
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
