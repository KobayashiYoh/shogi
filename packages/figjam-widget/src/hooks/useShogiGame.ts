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
  selectCpuMove,
  shouldCpuPromote,
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
  const [pendingMove, setPendingMove] = useSyncedState<{
    from: Position;
    to: Position;
  } | null>('pendingMove', null);

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
   * 駒の移動を実行する
   */
  const executePieceMove = async (from: Position, to: Position, shouldPromote: boolean) => {
    const currentPlayerIsFirst = isFirstPlayerTurn;

    const { newBoard, capturedPiece } = calculateBoardAfterPieceMove(
      board,
      from,
      to,
      shouldPromote
    );

    setBoard(newBoard);

    if (capturedPiece) {
      if (currentPlayerIsFirst) {
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
    setPendingMove(null);
    setIsFirstPlayerTurn(!currentPlayerIsFirst);

    const result = judgeGameResult(newBoard);
    setGameResult(result);

    // CPU対戦モードで、現在のプレイヤーが先手（ユーザー）で、次がCPUのターンなら自動で駒を動かす
    // ただし、成り選択待ちの場合は実行しない（pendingMoveはここでnullになってる）
    if (gameMode === 'cpu' && result === 'playing_game' && currentPlayerIsFirst) {
      // CPUの手を実行
      await executeCpuMove(newBoard);
    }
  };

  /**
   * 成り選択ハンドラー
   */
  const handlePromotionChoice = async (shouldPromote: boolean) => {
    if (!pendingMove) return;
    await executePieceMove(pendingMove.from, pendingMove.to, shouldPromote);
  };

  /**
   * マスクリック時のハンドラー
   */
  const handleCellClick = async (row: number, col: number) => {
    if (gameResult !== 'playing_game') {
      return;
    }

    // CPU対戦モードで、CPUのターン（後手）の時はユーザー入力を無効化
    if (gameMode === 'cpu' && !isFirstPlayerTurn) {
      return;
    }

    const clickedPos: Position = {
      row: row as BoardIndex,
      col: col as BoardIndex,
    };
    const clickedPiece = board[row][col];

    if (selectedPos === null) {
      // 駒の選択
      // CPU対戦モードでは先手の駒のみ選択可能
      const canSelectPiece = gameMode === 'cpu'
        ? (clickedPiece && clickedPiece.isFirstPlayer === true)
        : (clickedPiece && clickedPiece.isFirstPlayer === isFirstPlayerTurn);

      if (canSelectPiece) {
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
        // 成り判定
        const movingPiece = board[selectedPos.row][selectedPos.col];
        if (!movingPiece) return;

        // 自動成り判定（成らないと動けなくなる場合）
        if (isAutomaticPromotion(clickedPos, movingPiece.type, isFirstPlayerTurn)) {
          await executePieceMove(selectedPos, clickedPos, true);
        } else if (
          // 成りが可能かチェック
          enablePromotionAfterMove(
            selectedPos,
            clickedPos,
            movingPiece.type,
            isFirstPlayerTurn
          )
        ) {
          // 成り選択待ち状態にする
          setPendingMove({ from: selectedPos, to: clickedPos });
          setSelectedPos(null);
        } else {
          // 通常の移動
          await executePieceMove(selectedPos, clickedPos, false);
        }
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

  /**
   * CPUの手を実行する
   */
  const executeCpuMove = async (currentBoard: Board) => {
    const cpuMove = selectCpuMove(currentBoard, secondPlayerCapturedPieces);
    if (!cpuMove) return;

    const { fromPos, toPos, piece, capturedPieceType } = cpuMove;

    // 持ち駒を使う場合
    if (capturedPieceType && fromPos === null) {
      const newBoard: Board = currentBoard.map((row) => [...row]);
      newBoard[toPos.row][toPos.col] = piece;

      setBoard(newBoard);

      // 使った持ち駒を削除（関数型の更新）
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
      return;
    }

    // 通常の駒の移動
    if (!fromPos) return;

    const shouldPromote = shouldCpuPromote(fromPos, toPos, piece.type, false);

    const { newBoard, capturedPiece } = calculateBoardAfterPieceMove(
      currentBoard,
      fromPos,
      toPos,
      shouldPromote
    );

    setBoard(newBoard);

    if (capturedPiece) {
      // 関数型の更新
      setSecondPlayerCapturedPieces((prev) => [...prev, capturedPiece]);
    }

    setIsFirstPlayerTurn(true);

    const result = judgeGameResult(newBoard);
    setGameResult(result);
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
