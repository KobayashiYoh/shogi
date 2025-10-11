import { useState, useCallback } from 'react';
import type { GameState } from '../types/gameState';
import type { Position, Piece } from '../types/piece';
import { INITIAL_BOARD } from '../constants/initialBoard';
import { getMovablePositions } from '../utils/moveablePositionsLogic';
import {
  isValidMoveFromSelectedPosToTargetPos,
  calculateBoardAfterPieceMove,
  judgeGameResult,
} from '../utils/gameLogic';

/**
 * 将棋ゲームの状態管理を行うカスタムフック
 */
export const useShogiGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: INITIAL_BOARD,
    isFirstPlayerTurn: true,
    selectedPosition: null,
    gameResult: 'playing_game',
  });

  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);

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

      setPossibleMoves((prev) => {
        const moves = getMovablePositions(gameState.board, position, piece);
        return moves;
      });
    },
    [gameState.board]
  );

  /**
   * 駒の移動処理
   */
  const handlePieceMove = useCallback(
    (fromPosition: Position, toPosition: Position) => {
      const newBoard = calculateBoardAfterPieceMove(
        gameState.board,
        fromPosition,
        toPosition
      );
      const gameResult = judgeGameResult(newBoard);

      setGameState({
        board: newBoard,
        isFirstPlayerTurn: !gameState.isFirstPlayerTurn,
        selectedPosition: null,
        gameResult,
      });
      setPossibleMoves([]);
    },
    [gameState.board, gameState.isFirstPlayerTurn]
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
    [gameState, handleClickWithoutSelection, handleClickWithSelection]
  );

  /**
   * ゲームをリセット
   */
  const resetGame = useCallback(() => {
    setGameState({
      board: INITIAL_BOARD,
      isFirstPlayerTurn: true,
      selectedPosition: null,
      gameResult: 'playing_game',
    });
    setPossibleMoves([]);
  }, []);

  return {
    gameState,
    possibleMoves,
    handleSquareClick,
    resetGame,
  };
};
