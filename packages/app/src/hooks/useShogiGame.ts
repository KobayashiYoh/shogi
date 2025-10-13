import { useState, useCallback, useEffect } from "react";
import type {
  Piece,
  PieceType,
  Position,
  Board,
  GameResult,
  GameMode,
} from "@shogi/core";
import {
  INITIAL_BOARD,
  getMovablePositions,
  isValidMoveFromSelectedPosToTargetPos,
  calculateBoardAfterPieceMove,
  judgeGameResult,
  canPlaceCapturedPiece,
  placeCapturedPiece,
  addCapturedPiece,
  removeCapturedPiece,
  enablePromotionAfterMove,
  isAutomaticPromotion as checkMustPromote,
  isPromotedPiece,
  selectCpuMove,
  shouldCpuPromote,
} from "@shogi/core";

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
    setGameState((prev) => ({ ...prev, gameMode: mode }));
  }, []);

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
   * 駒を移動する処理
   */
  const handlePieceMove = useCallback(
    (from: Position, to: Position, shouldPromote = false) => {
      setGameState((prev) => {
        const { newBoard, capturedPiece } = calculateBoardAfterPieceMove(
          prev.board,
          from,
          to,
          shouldPromote
        );
        const gameResult = judgeGameResult(newBoard);

        const newCapturedByFirst =
          capturedPiece && prev.isFirstPlayerTurn
            ? addCapturedPiece(prev.capturedPiecesByFirstPlayer, capturedPiece)
            : prev.capturedPiecesByFirstPlayer;

        const newCapturedBySecond =
          capturedPiece && !prev.isFirstPlayerTurn
            ? addCapturedPiece(prev.capturedPiecesBySecondPlayer, capturedPiece)
            : prev.capturedPiecesBySecondPlayer;

        setPossibleMoves([]);

        return {
          ...prev,
          board: newBoard,
          isFirstPlayerTurn: !prev.isFirstPlayerTurn,
          selectedPosition: null,
          gameResult,
          capturedPiecesByFirstPlayer: newCapturedByFirst,
          capturedPiecesBySecondPlayer: newCapturedBySecond,
          promotionChoice: null,
        };
      });
    },
    []
  );

  /**
   * 持ち駒を配置する処理
   */
  const handlePlaceCapturedPiece = useCallback(
    (position: Position, pieceType: PieceType, isFirstPlayerTurn: boolean) => {
      setGameState((prev) => {
        if (!canPlaceCapturedPiece(prev.board, position)) {
          return prev;
        }
        const newBoard = placeCapturedPiece(
          prev.board,
          position,
          pieceType,
          isFirstPlayerTurn
        );
        const gameResult = judgeGameResult(newBoard);

        const newCapturedByFirst = isFirstPlayerTurn
          ? removeCapturedPiece(prev.capturedPiecesByFirstPlayer, pieceType)
          : prev.capturedPiecesByFirstPlayer;

        const newCapturedBySecond = !isFirstPlayerTurn
          ? removeCapturedPiece(prev.capturedPiecesBySecondPlayer, pieceType)
          : prev.capturedPiecesBySecondPlayer;

        setSelectedCapturedPiece(null);
        setPossibleMoves([]);

        return {
          ...prev,
          board: newBoard,
          isFirstPlayerTurn: !isFirstPlayerTurn,
          selectedPosition: null,
          gameResult,
          capturedPiecesByFirstPlayer: newCapturedByFirst,
          capturedPiecesBySecondPlayer: newCapturedBySecond,
          promotionChoice: null,
        };
      });
    },
    []
  );

  /**
   * マス目がクリックされた時の処理
   */
  const handleSquareClick = useCallback(
    (position: Position) => {
      setGameState((prev) => {
        if (prev.gameResult !== "playing_game") return prev;

        // CPU思考中は無視
        if (isCpuThinking) return prev;

        // 持ち駒配置処理
        if (selectedCapturedPiece) {
          handlePlaceCapturedPiece(
            position,
            selectedCapturedPiece,
            prev.isFirstPlayerTurn
          );
          return prev;
        }

        const clickedPiece = prev.board[position.row][position.col];

        // 選択中の駒がない場合
        if (!prev.selectedPosition) {
          if (
            clickedPiece &&
            clickedPiece.isFirstPlayer === prev.isFirstPlayerTurn
          ) {
            setPossibleMoves(
              getMovablePositions(prev.board, position, clickedPiece)
            );
            return { ...prev, selectedPosition: position };
          }
          return prev;
        }

        const selPos = prev.selectedPosition;

        // 同じマスなら選択解除
        if (selPos.row === position.row && selPos.col === position.col) {
          setPossibleMoves([]);
          return { ...prev, selectedPosition: null };
        }

        // 自分の駒なら再選択
        if (
          clickedPiece &&
          clickedPiece.isFirstPlayer === prev.isFirstPlayerTurn
        ) {
          setPossibleMoves(
            getMovablePositions(prev.board, position, clickedPiece)
          );
          return { ...prev, selectedPosition: position };
        }

        // 移動可能かチェック
        if (
          !isValidMoveFromSelectedPosToTargetPos(prev.board, selPos, position)
        ) {
          return prev;
        }

        const piece = prev.board[selPos.row][selPos.col];
        if (!piece) return prev;

        const canPromote = enablePromotionAfterMove(
          selPos,
          position,
          piece.type,
          prev.isFirstPlayerTurn
        );
        const mustPromote = checkMustPromote(
          position,
          piece.type,
          prev.isFirstPlayerTurn
        );

        if (isPromotedPiece(piece.type) || !canPromote) {
          handlePieceMove(selPos, position, false);
        } else if (mustPromote) {
          handlePieceMove(selPos, position, true);
        } else {
          // 成り選択
          return {
            ...prev,
            promotionChoice: {
              fromPos: selPos,
              toPos: position,
              pieceType: piece.type,
              mustPromote: false,
            },
          };
        }

        return prev;
      });
    },
    [
      selectedCapturedPiece,
      isCpuThinking,
      handlePlaceCapturedPiece,
      handlePieceMove,
    ]
  );

  /**
   * 成りを選択したときの処理
   */
  const handlePromote = useCallback(() => {
    const { promotionChoice } = gameState;
    if (!promotionChoice) return;
    handlePieceMove(promotionChoice.fromPos, promotionChoice.toPos, true);
  }, [gameState, handlePieceMove]);

  /**
   * 成らないを選択したときの処理
   */
  const handleDeclinePromotion = useCallback(() => {
    const { promotionChoice } = gameState;
    if (!promotionChoice) return;
    handlePieceMove(promotionChoice.fromPos, promotionChoice.toPos, false);
  }, [gameState, handlePieceMove]);

  /**
   * 持ち駒がクリックされたときの処理
   */
  const handleCapturedPieceClick = useCallback((pieceType: PieceType) => {
    setSelectedCapturedPiece((prev) => (prev === pieceType ? null : pieceType));
    setGameState((prev) => ({ ...prev, selectedPosition: null }));
    setPossibleMoves([]);
  }, []);

  /**
   * CPUの手を実行
   */
  const executeCpuMove = useCallback(() => {
    setGameState((prev) => {
      const cpuMove = selectCpuMove(
        prev.board,
        prev.capturedPiecesBySecondPlayer
      );
      if (!cpuMove) {
        setIsCpuThinking(false);
        return prev;
      }

      const { fromPos, toPos, capturedPieceType } = cpuMove;

      if (fromPos === null && capturedPieceType) {
        handlePlaceCapturedPiece(toPos, capturedPieceType, false);
        setIsCpuThinking(false);
        return prev;
      }

      if (fromPos === null) {
        setIsCpuThinking(false);
        return prev;
      }

      const piece = prev.board[fromPos.row][fromPos.col];
      if (!piece) {
        setIsCpuThinking(false);
        return prev;
      }

      const shouldPromote = shouldCpuPromote(fromPos, toPos, piece.type, false);
      handlePieceMove(fromPos, toPos, shouldPromote);
      setIsCpuThinking(false);

      return prev;
    });
  }, [handlePieceMove, handlePlaceCapturedPiece]);

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

      return () => clearTimeout(timer);
    }
  }, [
    gameState.gameMode,
    gameState.isFirstPlayerTurn,
    gameState.gameResult,
    gameState.promotionChoice,
    executeCpuMove,
    isCpuThinking,
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
