import type { Board } from '../types/gameState';
import type { Piece, Position } from '../types/piece';
import { createPosition } from './createPosition';
import {
  FU_FIRST_PLAYER_DIRECTION,
  FU_SECOND_PLAYER_DIRECTION,
  OU_DIRECTIONS,
  KIN_FIRST_PLAYER_DIRECTIONS,
  KIN_SECOND_PLAYER_DIRECTIONS,
  GIN_FIRST_PLAYER_DIRECTIONS,
  GIN_SECOND_PLAYER_DIRECTIONS,
  KEIMA_FIRST_PLAYER_DIRECTIONS,
  KEIMA_SECOND_PLAYER_DIRECTIONS,
  HISHA_DIRECTIONS,
  KAKU_DIRECTIONS,
} from '../constants/directions';

/**
 * 位置が盤面内かどうか判定
 */
const isWithinBoard = (row: number, col: number): boolean => {
  return row >= 0 && row <= 8 && col >= 0 && col <= 8;
};

/**
 * 歩兵の到達可能位置を取得
 */
export const getFuReachablePositions = (
  _board: Board,
  selectedPos: Position,
  isFirstPlayer: boolean
): Position[] => {
  const { row: selectedRow, col: selectedCol } = selectedPos;
  const direction = isFirstPlayer
    ? FU_FIRST_PLAYER_DIRECTION
    : FU_SECOND_PLAYER_DIRECTION;
  const newRow = selectedRow + direction;

  try {
    const position = createPosition(newRow, selectedCol);
    return [position];
  } catch {
    return [];
  }
};

/**
 * 王将の到達可能位置を取得
 */
export const getKingReachablePositions = (
  selectedPos: Position
): Position[] => {
  const { row: selectedRow, col: selectedCol } = selectedPos;
  const positions: Position[] = [];

  for (const [deltaRow, deltaCol] of OU_DIRECTIONS) {
    const newRow = selectedRow + deltaRow;
    const newCol = selectedCol + deltaCol;

    try {
      const position = createPosition(newRow, newCol);
      positions.push(position);
    } catch {
      // 盤面外の場合はスキップ
    }
  }

  return positions;
};

/**
 * 金将の到達可能位置を取得
 */
export const getKinReachablePositions = (
  selectedPos: Position,
  isFirstPlayer: boolean
): Position[] => {
  const { row: selectedRow, col: selectedCol } = selectedPos;
  const positions: Position[] = [];

  const directions = isFirstPlayer
    ? KIN_FIRST_PLAYER_DIRECTIONS
    : KIN_SECOND_PLAYER_DIRECTIONS;

  for (const [deltaRow, deltaCol] of directions) {
    const newRow = selectedRow + deltaRow;
    const newCol = selectedCol + deltaCol;

    try {
      const position = createPosition(newRow, newCol);
      positions.push(position);
    } catch {
      // 盤面外の場合はスキップ
    }
  }

  return positions;
};

/**
 * 銀将の到達可能位置を取得
 */
export const getGinReachablePositions = (
  selectedPos: Position,
  isFirstPlayer: boolean
): Position[] => {
  const { row: selectedRow, col: selectedCol } = selectedPos;
  const positions: Position[] = [];

  const directions = isFirstPlayer
    ? GIN_FIRST_PLAYER_DIRECTIONS
    : GIN_SECOND_PLAYER_DIRECTIONS;

  for (const [deltaRow, deltaCol] of directions) {
    const newRow = selectedRow + deltaRow;
    const newCol = selectedCol + deltaCol;

    try {
      const position = createPosition(newRow, newCol);
      positions.push(position);
    } catch {
      // 盤面外の場合はスキップ
    }
  }

  return positions;
};

/**
 * 桂馬の到達可能位置を取得
 */
export const getKeimaReachablePositions = (
  selectedPos: Position,
  isFirstPlayer: boolean
): Position[] => {
  const { row: selectedRow, col: selectedCol } = selectedPos;
  const positions: Position[] = [];

  const directions = isFirstPlayer
    ? KEIMA_FIRST_PLAYER_DIRECTIONS
    : KEIMA_SECOND_PLAYER_DIRECTIONS;

  for (const [deltaRow, deltaCol] of directions) {
    const newRow = selectedRow + deltaRow;
    const newCol = selectedCol + deltaCol;

    try {
      const position = createPosition(newRow, newCol);
      positions.push(position);
    } catch {
      // 盤面外の場合はスキップ
    }
  }

  return positions;
};

/**
 * 香車の到達可能位置を取得
 */
export const getKyouReachablePositions = (
  board: Board,
  selectedPos: Position,
  isFirstPlayer: boolean
): Position[] => {
  const { row: selectedRow, col: selectedCol } = selectedPos;
  const positions: Position[] = [];
  const direction = isFirstPlayer
    ? FU_FIRST_PLAYER_DIRECTION
    : FU_SECOND_PLAYER_DIRECTION;

  let currentRow = selectedRow + direction;

  while (currentRow >= 0 && currentRow <= 8) {
    try {
      const position = createPosition(currentRow, selectedCol);
      positions.push(position);

      const hasPieceAtPosition = board[currentRow][selectedCol] !== null;
      if (hasPieceAtPosition) {
        break;
      }

      currentRow += direction;
    } catch {
      break;
    }
  }

  return positions;
};

/**
 * 飛車の到達可能位置を取得
 */
export const getHishaReachablePositions = (
  board: Board,
  selectedPos: Position
): Position[] => {
  const { row: selectedRow, col: selectedCol } = selectedPos;
  const positions: Position[] = [];

  for (const [deltaRow, deltaCol] of HISHA_DIRECTIONS) {
    let currentRow = selectedRow + deltaRow;
    let currentCol = selectedCol + deltaCol;

    while (isWithinBoard(currentRow, currentCol)) {
      try {
        const position = createPosition(currentRow, currentCol);
        positions.push(position);

        const hasPieceAtPosition = board[currentRow][currentCol] !== null;
        if (hasPieceAtPosition) {
          break;
        }

        currentRow += deltaRow;
        currentCol += deltaCol;
      } catch {
        break;
      }
    }
  }

  return positions;
};

/**
 * 角行の到達可能位置を取得
 */
export const getKakuReachablePositions = (
  board: Board,
  selectedPos: Position
): Position[] => {
  const { row: selectedRow, col: selectedCol } = selectedPos;
  const positions: Position[] = [];

  for (const [deltaRow, deltaCol] of KAKU_DIRECTIONS) {
    let currentRow = selectedRow + deltaRow;
    let currentCol = selectedCol + deltaCol;

    while (isWithinBoard(currentRow, currentCol)) {
      try {
        const position = createPosition(currentRow, currentCol);
        positions.push(position);

        const hasPieceAtPosition = board[currentRow][currentCol] !== null;
        if (hasPieceAtPosition) {
          break;
        }

        currentRow += deltaRow;
        currentCol += deltaCol;
      } catch {
        break;
      }
    }
  }

  return positions;
};

/**
 * 駒の移動可能位置を取得
 */
const getReachablePositions = (
  board: Board,
  selectedPos: Position,
  piece: Piece
) => {
  const { type, isFirstPlayer } = piece;
  let positions: Position[] = [];

  switch (type) {
    case 'fu': {
      positions = getFuReachablePositions(board, selectedPos, isFirstPlayer);
      break;
    }
    case 'ou': {
      positions = getKingReachablePositions(selectedPos);
      break;
    }
    case 'kin': {
      positions = getKinReachablePositions(selectedPos, isFirstPlayer);
      break;
    }
    case 'gin': {
      positions = getGinReachablePositions(selectedPos, isFirstPlayer);
      break;
    }
    case 'keima': {
      positions = getKeimaReachablePositions(selectedPos, isFirstPlayer);
      break;
    }
    case 'kyou': {
      positions = getKyouReachablePositions(board, selectedPos, isFirstPlayer);
      break;
    }
    case 'hisha': {
      positions = getHishaReachablePositions(board, selectedPos);
      break;
    }
    case 'kaku': {
      positions = getKakuReachablePositions(board, selectedPos);
      break;
    }
  }

  return positions;
};

/**
 * 移動先が有効かどうか判定（空きマスまたは敵の駒）
 */
const isValidTargetPosition = (
  board: Board,
  position: Position,
  piece: Piece
): boolean => {
  const { row, col } = position;
  const targetPiece = board[row][col];
  const isEmptySquare = targetPiece === null;
  const isEnemyPiece =
    targetPiece !== null && targetPiece.isFirstPlayer !== piece.isFirstPlayer;

  return isEmptySquare || isEnemyPiece;
};

/**
 * 駒の移動可能な位置を取得
 */
export const getMovablePositions = (
  board: Board,
  selectedPos: Position,
  piece: Piece
): Position[] => {
  const reachablePositions = getReachablePositions(board, selectedPos, piece);
  const moveablePositions = reachablePositions.filter((position) =>
    isValidTargetPosition(board, position, piece)
  );
  return moveablePositions;
};
