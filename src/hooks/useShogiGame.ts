import { useState, useCallback } from 'react';
import type { GameState } from '../types/gameState';
import type { Position, Piece, PieceType } from '../types/piece';
import { INITIAL_BOARD } from '../constants/initialBoard';
import { getMovablePositions } from '../utils/moveablePositionsLogic';
import {
  isValidMoveFromSelectedPosToTargetPos,
  calculateBoardAfterPieceMove,
  judgeGameResult,
  canPlaceCapturedPiece,
  placeCapturedPiece,
} from '../utils/gameLogic';
import {
  addCapturedPiece,
  removeCapturedPiece,
} from '../utils/capturedPiecesLogic';

/**
 * ゲームの初期状態
 */
const INITIAL_GAME_STATE: GameState = {
  board: INITIAL_BOARD,
  isFirstPlayerTurn: true,
  selectedPosition: null,
  gameResult: 'playing_game',
  capturedPiecesByFirstPlayer: [],
  capturedPiecesBySecondPlayer: [],
};


/**
 * 将棋ゲームの状態管理を行うカスタムフック
 */
export const useShogiGame = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
  const [selectedCapturedPiece, setSelectedCapturedPiece] =
    useState<PieceType | null>(null);

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
   * 駒の移動処理
   */
  const handlePieceMove = useCallback(
    (fromPosition: Position, toPosition: Position) => {
      const { newBoard, capturedPiece } = calculateBoardAfterPieceMove(
        gameState.board,
        fromPosition,
        toPosition
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
      });
      setPossibleMoves([]);
    },
    [
      gameState.board,
      gameState.isFirstPlayerTurn,
      gameState.capturedPiecesByFirstPlayer,
      gameState.capturedPiecesBySecondPlayer,
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
        handlePieceMove(selectedPosition, position);
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

      const isGameOver = gameResult !== 'playing_game';
      if (isGameOver) {
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
      handlePlaceCapturedPiece,
      handleClickWithoutSelection,
      handleClickWithSelection,
    ]
  );

  /**
   * 持ち駒がクリックされた時の処理
   */
  const handleCapturedPieceClick = useCallback((pieceType: PieceType) => {
    setGameState((prev) => ({
      ...prev,
      selectedPosition: null,
    }));
    setPossibleMoves([]);
    setSelectedCapturedPiece(pieceType);
  }, []);

  /**
   * ゲームをリセット
   */
  const resetGame = useCallback(() => {
    setGameState(INITIAL_GAME_STATE);
    setPossibleMoves([]);
    setSelectedCapturedPiece(null);
  }, []);

  return {
    gameState,
    possibleMoves,
    handleSquareClick,
    resetGame,
    selectedCapturedPiece,
    handleCapturedPieceClick,
  };
};
