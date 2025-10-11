import React from 'react';
import Square from './Square';
import type { Board } from '../types/gameState';
import type { Position, BoardIndex } from '../types/piece';
import './ShogiBoard.css';

interface ShogiBoardProps {
  board: Board;
  selectedPosition: Position | null;
  possibleMoves: Position[];
  onSquareClick: (position: Position) => void;
}

/**
 * 将棋盤全体を表示するコンポーネント
 */
const ShogiBoard: React.FC<ShogiBoardProps> = ({
  board,
  selectedPosition,
  possibleMoves,
  onSquareClick,
}) => {
  const isSelected = (row: number, col: number) => {
    const isSelectedPosition =
      selectedPosition?.row === row && selectedPosition?.col === col;
    return isSelectedPosition;
  };

  const isPossibleMove = (row: number, col: number) => {
    return possibleMoves.some((move) => move.row === row && move.col === col);
  };

  return (
    <div className="shogi-board">
      <div className="column-labels">
        <div className="corner"></div>
        {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
          <div key={num} className="column-label">
            {num}
          </div>
        ))}
      </div>

      <div className="board-container">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((piece, colIndex) => (
              <Square
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                position={{ row: rowIndex as BoardIndex, col: colIndex as BoardIndex }}
                isSelected={isSelected(rowIndex, colIndex)}
                isPossibleMove={isPossibleMove(rowIndex, colIndex)}
                onSquareClick={onSquareClick}
              />
            ))}
            <div className="row-label">
              {['一', '二', '三', '四', '五', '六', '七', '八', '九'][rowIndex]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShogiBoard;
