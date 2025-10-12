import React from 'react';
import type { Position } from '../types/position';
import type { Piece } from '../types/piece';
import { getPieceDisplayTextFromPiece } from '../utils/pieceDisplay';
import './Square.css';

interface SquareProps {
  piece: Piece | null;
  position: Position;
  isSelected: boolean;
  isPossibleMove: boolean;
  onSquareClick: (position: Position) => void;
}

/**
 * 将棋盤の1マスを表示するコンポーネント
 */
const Square: React.FC<SquareProps> = ({
  piece,
  position,
  isSelected,
  isPossibleMove,
  onSquareClick,
}) => {
  const handleClick = () => {
    onSquareClick(position);
  };

  const getSquareClass = () => {
    let className = 'square';

    if (isSelected) {
      className += ' selected';
    }

    if (isPossibleMove) {
      className += ' possible-move';
    }

    return className;
  };

  return (
    <div className={getSquareClass()} onClick={handleClick}>
      {piece && (
        <div
          className={`piece ${piece.isFirstPlayer ? 'first-player' : 'second-player'}`}
        >
          {getPieceDisplayTextFromPiece(piece)}
        </div>
      )}
    </div>
  );
};

export default Square;
