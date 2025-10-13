import type { Board, BoardIndex, Piece, PieceType, Position } from "../types";
import { getMovablePositions } from "./moveablePositionsLogic";
import {
  enablePromotionAfterMove,
  isAutomaticPromotion,
  isPromotedPiece,
} from "./promotionLogic";

/**
 * 各駒の価値を表すスコア
 */
const pieceScores: Record<PieceType, number> = {
  ou: 10000,
  hisha: 10,
  kaku: 9,
  kin: 6,
  gin: 5,
  keima: 4,
  kyou: 4,
  fu: 1,
  ryuou: 12,
  ryuuma: 11,
  narigin: 6,
  narikei: 6,
  narikyo: 6,
  tokin: 6,
};

/**
 * 駒の価値を表すスコアを返す
 */
const getPieceScoreFromPieceType = (pieceType: PieceType): number => {
  return pieceScores[pieceType] || 0;
};

/**
 * 駒のスコアに符号を付けて返す評価関数
 * CPU（後手）の駒はプラス、プレイヤー（先手）の駒はマイナス
 */
const calculatePieceScore = (piece: Piece): number => {
  const pieceScore = getPieceScoreFromPieceType(piece.type);
  return piece.isFirstPlayer ? -pieceScore : pieceScore;
};

/**
 * 盤面を評価する（CPUの視点で、スコアが高いほど有利）
 */
const evaluateBoardScore = (board: Board): number => {
  let totalScore = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (!piece) {
        continue;
      }
      totalScore += calculatePieceScore(piece);
    }
  }
  return totalScore;
};

/**
 * CPUの指し手を表すインターフェース
 */
interface Move {
  /** 移動元の位置（持ち駒を使う場合はnull） */
  fromPos: Position | null;
  /** 移動先の位置 */
  toPos: Position;
  /** 移動する駒 */
  piece: Piece;
  /** 持ち駒を使う場合の駒の種類 */
  capturedPieceType?: PieceType;
}

/**
 * 特定の駒から可能な手をすべて生成する
 */
const generateAllMovesFromPiece = (
  board: Board,
  fromPos: Position,
  piece: Piece
): Move[] => {
  const moves: Move[] = [];
  const movablePositions = getMovablePositions(board, fromPos, piece);
  for (const toPos of movablePositions) {
    moves.push({ fromPos, toPos, piece });
  }
  return moves;
};

/**
 * 可能な手をすべて取得（盤上の駒の移動のみ）
 */
const getAllPossibleMoves = (board: Board, isFirstPlayer: boolean): Move[] => {
  const moves: Move[] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      const isPieceOfFirstPlayer =
        piece && piece.isFirstPlayer === isFirstPlayer;
      if (!isPieceOfFirstPlayer) {
        continue;
      }
      const fromPos: Position = {
        row: row as BoardIndex,
        col: col as BoardIndex,
      };
      const pieceMoves = generateAllMovesFromPiece(board, fromPos, piece);
      moves.push(...pieceMoves);
    }
  }
  return moves;
};

/**
 * 盤面の空きマス全てに、指定された駒を配置する手を生成する（汎用関数）
 *
 * @param board - 現在の盤面
 * @param piece - 配置する駒
 * @param fromPos - 移動元の位置（持ち駒の場合は null）
 * @param capturedPieceType - 持ち駒を使用する場合の駒タイプ（オプション）
 * @returns 生成された手の配列（各要素は1つの空きマスへの配置手）
 *
 * @example
 * // 持ち駒「fu」を配置する場合
 * // generatePlacementMoves(board, {type: "fu", isFirstPlayer: true}, null, "fu")
 * // 結果: 空きマスごとに手が生成される
 */
const generateMovesForPieceOnAllEmptyPositions = (
  board: Board,
  piece: Piece,
  fromPos: Position | null,
  capturedPieceType?: PieceType
): Move[] => {
  const moves: Move[] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== null) {
        continue;
      }
      const targetPos: Position = {
        row: row as BoardIndex,
        col: col as BoardIndex,
      };
      moves.push({
        fromPos,
        toPos: targetPos,
        piece,
        capturedPieceType,
      });
    }
  }
  return moves;
};

/**
 * 特定の持ち駒を盤面に配置する手をすべて生成する
 *
 * @param board - 現在の盤面
 * @param pieceType - 持ち駒の駒タイプ
 * @param isFirstPlayer - 先手かどうか
 * @returns 生成された手の配列
 */
const generateMovesForCapturedPieceOnAllEmptyPositions = (
  board: Board,
  pieceType: PieceType,
  isFirstPlayer: boolean
): Move[] => {
  const piece: Piece = { type: pieceType, isFirstPlayer };
  return generateMovesForPieceOnAllEmptyPositions(
    board,
    piece,
    null,
    pieceType
  );
};

/**
 * 持ち駒リストから重複を除いた各駒タイプについて、配置可能な全ての手を取得する
 *
 * @param board - 現在の盤面
 * @param capturedPieces - 持ち駒のリスト（重複を含む可能性がある）
 * @param isFirstPlayer - 先手かどうか
 * @returns 全ての持ち駒について生成された手の配列
 *
 * @example
 * // 持ち駒が [fu, fu, kaku] の場合
 * // 1. ユニークな駒タイプ [fu, kaku] を抽出
 * // 2. 各駒タイプについて generateMovesFromCapturedPiece を呼び出し
 * // 3. 全ての手を結合して返す
 */
const getAllPossibleCapturedPieceMoves = (
  board: Board,
  capturedPieces: PieceType[],
  isFirstPlayer: boolean
): Move[] => {
  const moves: Move[] = [];

  if (capturedPieces.length === 0) {
    return moves;
  }

  const uniquePieceTypes = Array.from(new Set(capturedPieces));
  for (const pieceType of uniquePieceTypes) {
    const capturedPieceMoves = generateMovesForCapturedPieceOnAllEmptyPositions(
      board,
      pieceType,
      isFirstPlayer
    );
    moves.push(...capturedPieceMoves);
  }

  return moves;
};

/**
 * 手を実行した後の盤面を取得（簡易版）
 */
const getBoardAfterApplyMove = (
  board: Board,
  move: Move,
  shouldPromote: boolean
): Board => {
  const newBoard: Board = board.map((row) => [...row]);
  const { fromPos, toPos, piece } = move;

  let movedPiece = piece;
  const canPromotePiece = shouldPromote && !isPromotedPiece(piece.type);
  if (canPromotePiece) {
    const promotedType = getPromotedType(piece.type);
    if (promotedType) {
      movedPiece = { ...piece, type: promotedType };
    }
  }

  newBoard[toPos.row][toPos.col] = movedPiece;

  // 持ち駒の配置でない場合のみ、移動元をクリア
  if (fromPos !== null) {
    newBoard[fromPos.row][fromPos.col] = null;
  }

  return newBoard;
};

/**
 * 駒の成り後の駒タイプを取得
 */
const getPromotedType = (pieceType: PieceType): PieceType | null => {
  const promotionMap: Record<string, PieceType> = {
    hisha: "ryuou",
    kaku: "ryuuma",
    gin: "narigin",
    keima: "narikei",
    kyou: "narikyo",
    fu: "tokin",
  };
  return promotionMap[pieceType] || null;
};

/**
 * その駒が持ち駒かどうかを判定する
 */
const isCapturedPiece = (fromPos: Position | null): boolean => {
  return fromPos === null;
};

/**
 * CPUが駒を動かすときに成るかどうかを判定する
 */
export const shouldCpuPromote = (
  fromPos: Position | null,
  toPos: Position,
  pieceType: PieceType,
  isFirstPlayer: boolean
): boolean => {
  if (isCapturedPiece(fromPos)) {
    return false;
  }

  if (isPromotedPiece(pieceType)) {
    return false;
  }

  const canPromote = enablePromotionAfterMove(
    fromPos as Position,
    toPos,
    pieceType,
    isFirstPlayer
  );
  if (!canPromote) {
    return false;
  }

  const isAutomatic = isAutomaticPromotion(toPos, pieceType, isFirstPlayer);
  if (isAutomatic) {
    return true;
  }

  return true;
};

/**
 * CPU（後手）の手番でスコアを最大化する
 */
const maximizeScore = (
  board: Board,
  possibleMoves: Move[],
  depth: number,
  alpha: number,
  beta: number
): number => {
  let maxScore = -Infinity;
  for (const move of possibleMoves) {
    const shouldPromote = shouldCpuPromote(
      move.fromPos,
      move.toPos,
      move.piece.type,
      false
    );
    const newBoard = getBoardAfterApplyMove(board, move, shouldPromote);
    const score = minimax(newBoard, depth - 1, false, alpha, beta);
    maxScore = Math.max(maxScore, score);
    alpha = Math.max(alpha, score);
    // βカット（これ以上探索しても最善手にならない枝を刈る）
    const shouldCutOff = beta <= alpha;
    if (shouldCutOff) {
      break;
    }
  }
  return maxScore;
};

/**
 * プレイヤー（先手）の手番でスコアを最小化する
 */
const minimizeScore = (
  board: Board,
  possibleMoves: Move[],
  depth: number,
  alpha: number,
  beta: number
): number => {
  let minScore = Infinity;
  for (const move of possibleMoves) {
    const shouldPromote = shouldCpuPromote(
      move.fromPos,
      move.toPos,
      move.piece.type,
      true
    );
    const newBoard = getBoardAfterApplyMove(board, move, shouldPromote);
    const score = minimax(newBoard, depth - 1, true, alpha, beta);
    minScore = Math.min(minScore, score);
    beta = Math.min(beta, score);
    // αカット（これ以上探索しても最善手にならない枝を刈る）
    const shouldCutOff = beta <= alpha;
    if (shouldCutOff) {
      break;
    }
  }
  return minScore;
};

/**
 * ミニマックスアルゴリズムで手を評価（深さ制限付き）
 */
const minimax = (
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number
): number => {
  const hasReachedDepthLimit = depth === 0;
  if (hasReachedDepthLimit) {
    return evaluateBoardScore(board);
  }

  const currentPlayer = !isMaximizing;
  const possibleMoves = getAllPossibleMoves(board, currentPlayer);

  const hasNoValidMoves = possibleMoves.length === 0;
  if (hasNoValidMoves) {
    return evaluateBoardScore(board);
  }

  if (isMaximizing) {
    return maximizeScore(board, possibleMoves, depth, alpha, beta);
  }
  return minimizeScore(board, possibleMoves, depth, alpha, beta);
};

/**
 * 手のスコアを評価する
 */
const evaluateMoveScore = (
  board: Board,
  move: Move
): { move: Move; score: number } => {
  const targetPiece = board[move.toPos.row][move.toPos.col];

  const canCaptureKing = targetPiece && targetPiece.type === "ou";
  if (canCaptureKing) {
    return { move, score: 1000000 };
  }

  let immediateBonus = 0;
  if (targetPiece) {
    immediateBonus = getPieceScoreFromPieceType(targetPiece.type) * 10;
  }

  const shouldPromote = shouldCpuPromote(
    move.fromPos,
    move.toPos,
    move.piece.type,
    false
  );
  const newBoard = getBoardAfterApplyMove(board, move, shouldPromote);

  const futureScore = minimax(newBoard, 2, false, -Infinity, Infinity);
  const totalScore = futureScore + immediateBonus;

  return { move, score: totalScore };
};

/**
 * CPUの手を選択する（強化版）
 */
export const selectCpuMove = (
  board: Board,
  capturedPieces: PieceType[] = []
): Move | null => {
  const possibleMoves = getAllPossibleMoves(board, false);
  const possibleCapturedPieceMoves = getAllPossibleCapturedPieceMoves(
    board,
    capturedPieces,
    false
  );
  const allMoves = [...possibleMoves, ...possibleCapturedPieceMoves];

  const hasNoValidMoves = allMoves.length === 0;
  if (hasNoValidMoves) {
    return null;
  }

  const moveScores = allMoves.map((move) => evaluateMoveScore(board, move));
  moveScores.sort((a, b) => b.score - a.score);

  return moveScores[0].move;
};
