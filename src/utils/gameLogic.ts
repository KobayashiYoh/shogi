import type { Board } from '../types/gameState';
import type { Position, PieceType } from '../types/piece';
import type { GameResult } from '../types/gameResult';
import { getMovablePositions } from './moveablePositionsLogic';

/**
 * 指定した移動が将棋のルール上有効かどうかを検証
 */
export const isValidMoveFromSelectedPosToTargetPos = (
  board: Board,
  selectedPos: Position,
  targetPos: Position
): boolean => {
  const selectedPiece = board[selectedPos.row][selectedPos.col];

  const isPieceExists = selectedPiece !== null;
  if (!isPieceExists) {
    return false;
  }

  const movablePositions = getMovablePositions(
    board,
    selectedPos,
    selectedPiece
  );
  const isMoveInMovablePositions = movablePositions.some(
    (targetPosition: Position) =>
      targetPosition.row === targetPos.row &&
      targetPosition.col === targetPos.col
  );

  return isMoveInMovablePositions;
};

/**
 * 駒を指定位置から指定位置に移動した後の新しい盤面状態と取った駒を計算
 */
export const calculateBoardAfterPieceMove = (
  board: Board,
  selectedPos: Position,
  targetPos: Position
): { newBoard: Board; capturedPiece: PieceType | null } => {
  const newBoard = board.map((row) => [...row]);
  const piece = newBoard[selectedPos.row][selectedPos.col];
  const targetPiece = newBoard[targetPos.row][targetPos.col];

  // 取った駒がある場合は記録（成り駒は元に戻す処理は今後実装）
  const capturedPiece = targetPiece ? targetPiece.type : null;

  newBoard[targetPos.row][targetPos.col] = piece;
  newBoard[selectedPos.row][selectedPos.col] = null;

  return { newBoard, capturedPiece };
};

/**
 * 指定したプレイヤーの王将が盤面上に存在するかどうかをチェック
 */
const hasTargetPlayersKingOnBoard = (
  board: Board,
  isFirstPlayer: boolean
): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      const hasPiece = piece !== null;
      if (!hasPiece) {
        continue;
      }

      const isOuPiece = piece.type === 'ou';
      const isTargetPlayer = piece.isFirstPlayer === isFirstPlayer;
      const isTargetPlayerOu = isOuPiece && isTargetPlayer;

      if (isTargetPlayerOu) {
        return true;
      }
    }
  }
  return false;
};

/**
 * 現在の盤面状態からゲームの勝敗結果を判定
 */
export const judgeGameResult = (board: Board): GameResult => {
  const firstPlayerHasOu = hasTargetPlayersKingOnBoard(board, true);
  const secondPlayerHasOu = hasTargetPlayersKingOnBoard(board, false);

  const firstPlayerLost = !firstPlayerHasOu;
  if (firstPlayerLost) {
    return 'second_player_wins';
  }

  const secondPlayerLost = !secondPlayerHasOu;
  if (secondPlayerLost) {
    return 'first_player_wins';
  }

  return 'playing_game';
};

/**
 * 持ち駒を盤面に配置できるかを判定
 */
export const canPlaceCapturedPiece = (
  board: Board,
  targetPos: Position
): boolean => {
  // 配置先のマスが空いているかチェック
  return board[targetPos.row][targetPos.col] === null;
};

/**
 * 持ち駒を盤面に配置する
 */
export const placeCapturedPiece = (
  board: Board,
  targetPos: Position,
  pieceType: PieceType,
  isFirstPlayer: boolean
): Board => {
  const newBoard = board.map((row) => [...row]);
  newBoard[targetPos.row][targetPos.col] = {
    type: pieceType,
    isFirstPlayer,
  };
  return newBoard;
};
