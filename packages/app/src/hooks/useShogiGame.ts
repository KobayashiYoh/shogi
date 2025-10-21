import { useState, useCallback, useEffect } from "react";
import type {
  Piece,
  PieceType,
  Position,
  Board,
  GameResult,
  GameMode,
} from "@shogi/core";
import { INITIAL_BOARD } from "@shogi/core";
import { getMovablePositions } from "@shogi/core";
import {
  isValidMoveFromSelectedPosToTargetPos,
  calculateBoardAfterPieceMove,
  judgeGameResult,
  canPlaceCapturedPiece,
  placeCapturedPiece,
} from "@shogi/core";
import { addCapturedPiece, removeCapturedPiece } from "@shogi/core";
import {
  enablePromotionAfterMove,
  isAutomaticPromotion as checkMustPromote,
  isPromotedPiece,
} from "@shogi/core";
import { selectCpuMove, shouldCpuPromote } from "@shogi/core";

/**
 * 成り選択の状態
 */
export interface PromotionChoice {
  fromPos: Position;
  toPos: Position;
  pieceType: PieceType;
  mustPromote: boolean;
}

/**
 * ゲームの状態
 */
export interface GameState {
  board: Board;
  isFirstPlayerTurn: boolean;
  selectedPosition: Position | null;
  gameResult: GameResult;
  capturedPiecesByFirstPlayer: PieceType[];
  capturedPiecesBySecondPlayer: PieceType[];
  promotionChoice: PromotionChoice | null;
  gameMode: GameMode;
}

/**
 * ゲームの初期状態
 */
const INITIAL_GAME_STATE: GameState = {
  board: INITIAL_BOARD,
  isFirstPlayerTurn: true,
  selectedPosition: null,
  gameResult: "playing_game",
  capturedPiecesByFirstPlayer: [],
  capturedPiecesBySecondPlayer: [],
  promotionChoice: null,
  gameMode: null,
};

/**
 * 将棋ゲームの状態管理を行うカスタムフック
 */
export const useShogiGame = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
  const [selectedCapturedPiece, setSelectedCapturedPiece] =
    useState<PieceType | null>(null);
  const [isCpuThinking, setIsCpuThinking] = useState(false);

  /**
   * ゲームモードを設定
   */
  const setGameMode = useCallback((mode: GameMode) => {
    setGameState((prev) => ({
      ...prev,
      gameMode: mode,
    }));
  }, []);

  /**
   * 同じマスがクリックされた場合の処理
   */
  const handleSameSquareClick = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      selectedPosition: null,
    }));
    setPossibleMoves([]);
  }, []);

  /**
   * 自分の駒がクリックされた場合の処理
   */
  const handleOwnPieceClick = useCallback(
    (position: Position, piece: Piece) => {
      setGameState((prev) => ({
        ...prev,
        selectedPosition: position,
      }));

      const moves = getMovablePositions(gameState.board, position, piece);
      setPossibleMoves(moves);
    },
    [gameState.board]
  );

  /**
   * 駒の移動処理（成り判定あり）
   */
  const handlePieceMove = useCallback(
    (fromPosition: Position, toPosition: Position, shouldPromote = false) => {
      const { newBoard, capturedPiece } = calculateBoardAfterPieceMove(
        gameState.board,
        fromPosition,
        toPosition,
        shouldPromote
      );
      const gameResult = judgeGameResult(newBoard);

      if (!capturedPiece) {
        setGameState({
          board: newBoard,
          isFirstPlayerTurn: !gameState.isFirstPlayerTurn,
          selectedPosition: null,
          gameResult,
          capturedPiecesByFirstPlayer: gameState.capturedPiecesByFirstPlayer,
          capturedPiecesBySecondPlayer: gameState.capturedPiecesBySecondPlayer,
          promotionChoice: null,
          gameMode: gameState.gameMode,
        });
        setPossibleMoves([]);
        return;
      }

      const newCapturedByFirst = gameState.isFirstPlayerTurn
        ? addCapturedPiece(gameState.capturedPiecesByFirstPlayer, capturedPiece)
        : gameState.capturedPiecesByFirstPlayer;
      const newCapturedBySecond = !gameState.isFirstPlayerTurn
        ? addCapturedPiece(
            gameState.capturedPiecesBySecondPlayer,
            capturedPiece
          )
        : gameState.capturedPiecesBySecondPlayer;

      setGameState({
        board: newBoard,
        isFirstPlayerTurn: !gameState.isFirstPlayerTurn,
        selectedPosition: null,
        gameResult,
        capturedPiecesByFirstPlayer: newCapturedByFirst,
        capturedPiecesBySecondPlayer: newCapturedBySecond,
        promotionChoice: null,
        gameMode: gameState.gameMode,
      });
      setPossibleMoves([]);
    },
    [
      gameState.board,
      gameState.isFirstPlayerTurn,
      gameState.capturedPiecesByFirstPlayer,
      gameState.capturedPiecesBySecondPlayer,
      gameState.gameMode,
    ]
  );

  /**
   * 駒が選択されていない状態でのクリック処理
   */
  const handleClickWithoutSelection = useCallback(
    (
      position: Position,
      clickedPiece: Piece | null,
      isFirstPlayerTurn: boolean
    ) => {
      const isOwnPiece =
        clickedPiece && clickedPiece.isFirstPlayer === isFirstPlayerTurn;
      if (!isOwnPiece) {
        return;
      }
      handleOwnPieceClick(position, clickedPiece);
    },
    [handleOwnPieceClick]
  );

  /**
   * 持ち駒を配置する処理
   */
  const handlePlaceCapturedPiece = useCallback(
    (position: Position, pieceType: PieceType, isFirstPlayerTurn: boolean) => {
      const { board } = gameState;

      if (!canPlaceCapturedPiece(board, position)) {
        return;
      }

      const newBoard = placeCapturedPiece(
        board,
        position,
        pieceType,
        isFirstPlayerTurn
      );
      const gameResult = judgeGameResult(newBoard);

      const newCapturedByFirst = isFirstPlayerTurn
        ? removeCapturedPiece(gameState.capturedPiecesByFirstPlayer, pieceType)
        : gameState.capturedPiecesByFirstPlayer;
      const newCapturedBySecond = !isFirstPlayerTurn
        ? removeCapturedPiece(gameState.capturedPiecesBySecondPlayer, pieceType)
        : gameState.capturedPiecesBySecondPlayer;

      setGameState({
        board: newBoard,
        isFirstPlayerTurn: !isFirstPlayerTurn,
        selectedPosition: null,
        gameResult,
        capturedPiecesByFirstPlayer: newCapturedByFirst,
        capturedPiecesBySecondPlayer: newCapturedBySecond,
        promotionChoice: null,
        gameMode: gameState.gameMode,
      });
      setSelectedCapturedPiece(null);
    },
    [gameState]
  );

  /**
   * 駒が選択されている状態でのクリック処理
   */
  const handleClickWithSelection = useCallback(
    (
      position: Position,
      clickedPiece: Piece | null,
      selectedPosition: Position,
      isFirstPlayerTurn: boolean,
      board: (Piece | null)[][]
    ) => {
      const isSameSquare =
        selectedPosition.row === position.row &&
        selectedPosition.col === position.col;

      if (isSameSquare) {
        handleSameSquareClick();
        return;
      }

      const isOwnPiece =
        clickedPiece && clickedPiece.isFirstPlayer === isFirstPlayerTurn;

      if (isOwnPiece) {
        handleOwnPieceClick(position, clickedPiece);
        return;
      }

      const isMoveValid = isValidMoveFromSelectedPosToTargetPos(
        board,
        selectedPosition,
        position
      );

      if (isMoveValid) {
        const selectedPiece = board[selectedPosition.row][selectedPosition.col];
        if (!selectedPiece) {
          return;
        }

        // 成り駒は成り判定しない
        if (isPromotedPiece(selectedPiece.type)) {
          handlePieceMove(selectedPosition, position, false);
          return;
        }

        // 成ることができるか判定
        const canPromote = enablePromotionAfterMove(
          selectedPosition,
          position,
          selectedPiece.type,
          isFirstPlayerTurn
        );

        if (!canPromote) {
          handlePieceMove(selectedPosition, position, false);
          return;
        }

        // 必ず成らないといけないか判定
        const mustPromote = checkMustPromote(
          position,
          selectedPiece.type,
          isFirstPlayerTurn
        );

        if (mustPromote) {
          // 必ず成る場合は自動的に成る
          handlePieceMove(selectedPosition, position, true);
          return;
        }

        // 成り選択ダイアログを表示
        setGameState((prev) => ({
          ...prev,
          promotionChoice: {
            fromPos: selectedPosition,
            toPos: position,
            pieceType: selectedPiece.type,
            mustPromote: false,
          },
        }));
      }
    },
    [handleSameSquareClick, handleOwnPieceClick, handlePieceMove]
  );

  /**
   * マス目がクリックされた時の処理
   */
  const handleSquareClick = useCallback(
    (position: Position): void => {
      const { board, selectedPosition, isFirstPlayerTurn, gameResult } =
        gameState;

      const isGameOver = gameResult !== "playing_game";
      if (isGameOver) {
        return;
      }

      // CPUが思考中はクリックを無視
      if (isCpuThinking) {
        return;
      }

      if (selectedCapturedPiece) {
        handlePlaceCapturedPiece(
          position,
          selectedCapturedPiece,
          isFirstPlayerTurn
        );
        return;
      }

      const clickedPiece = board[position.row][position.col];

      if (!selectedPosition) {
        handleClickWithoutSelection(position, clickedPiece, isFirstPlayerTurn);
        return;
      }

      handleClickWithSelection(
        position,
        clickedPiece,
        selectedPosition,
        isFirstPlayerTurn,
        board
      );
    },
    [
      gameState,
      selectedCapturedPiece,
      isCpuThinking,
      handlePlaceCapturedPiece,
      handleClickWithoutSelection,
      handleClickWithSelection,
    ]
  );

  /**
   * 持ち駒がクリックされた時の処理
   */
  const handleCapturedPieceClick = useCallback((pieceType: PieceType) => {
    setSelectedCapturedPiece((prev) => {
      // 同じ持ち駒がクリックされた場合は選択を解除
      if (prev === pieceType) {
        return null;
      }
      return pieceType;
    });
    setGameState((prev) => ({
      ...prev,
      selectedPosition: null,
    }));
    setPossibleMoves([]);
  }, []);

  /**
   * 成りを選択したときの処理
   */
  const handlePromote = useCallback(() => {
    const { promotionChoice } = gameState;
    if (!promotionChoice) {
      return;
    }

    handlePieceMove(promotionChoice.fromPos, promotionChoice.toPos, true);
  }, [gameState, handlePieceMove]);

  /**
   * 成らないを選択したときの処理
   */
  const handleDeclinePromotion = useCallback(() => {
    const { promotionChoice } = gameState;
    if (!promotionChoice) {
      return;
    }

    handlePieceMove(promotionChoice.fromPos, promotionChoice.toPos, false);
  }, [gameState, handlePieceMove]);

  /**
   * ゲームをリセット
   */
  const resetGame = useCallback(() => {
    setGameState(INITIAL_GAME_STATE);
    setPossibleMoves([]);
    setSelectedCapturedPiece(null);
    setIsCpuThinking(false);
  }, []);

  /**
   * CPUの手を実行
   */
  const executeCpuMove = useCallback(() => {
    console.log('executeCpuMove called');
    console.log('board:', gameState.board);
    console.log('capturedPieces:', gameState.capturedPiecesBySecondPlayer);

    const cpuMove = selectCpuMove(gameState.board, gameState.capturedPiecesBySecondPlayer);
    console.log('cpuMove:', cpuMove);

    if (!cpuMove) {
      console.log('No valid CPU move found');
      setIsCpuThinking(false);
      return;
    }

    const { fromPos, toPos, capturedPieceType } = cpuMove;

    // 持ち駒を使う場合
    if (fromPos === null && capturedPieceType) {
      console.log('Placing captured piece:', capturedPieceType, 'at', toPos);
      handlePlaceCapturedPiece(toPos, capturedPieceType, false);
      setIsCpuThinking(false);
      return;
    }

    // 盤上の駒を動かす場合
    if (fromPos === null) {
      console.log('fromPos is null but no capturedPieceType');
      setIsCpuThinking(false);
      return;
    }

    const piece = gameState.board[fromPos.row][fromPos.col];
    if (!piece) {
      console.log('No piece at fromPos:', fromPos);
      setIsCpuThinking(false);
      return;
    }

    // 成り判定
    const shouldPromote = shouldCpuPromote(fromPos, toPos, piece.type, false);
    console.log('Moving piece from', fromPos, 'to', toPos, 'shouldPromote:', shouldPromote);

    handlePieceMove(fromPos, toPos, shouldPromote);
    setIsCpuThinking(false);
  }, [gameState.board, gameState.capturedPiecesBySecondPlayer, handlePieceMove, handlePlaceCapturedPiece]);

  /**
   * CPUのターンを監視して自動で手を指す
   */
  useEffect(() => {
    const isCpuTurn =
      gameState.gameMode === "cpu" &&
      !gameState.isFirstPlayerTurn &&
      gameState.gameResult === "playing_game" &&
      !gameState.promotionChoice;

    if (isCpuTurn && !isCpuThinking) {
      setIsCpuThinking(true);
      const timer = setTimeout(() => {
        executeCpuMove();
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [
    gameState.gameMode,
    gameState.isFirstPlayerTurn,
    gameState.gameResult,
    gameState.promotionChoice,
    executeCpuMove,
  ]);

  return {
    gameState,
    possibleMoves,
    handleSquareClick,
    resetGame,
    selectedCapturedPiece,
    handleCapturedPieceClick,
    handlePromote,
    handleDeclinePromotion,
    setGameMode,
  };
};
