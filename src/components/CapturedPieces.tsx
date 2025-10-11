import type { PieceType } from '../types/piece';
import { getPieceDisplayText } from '../utils/pieceDisplay';
import './CapturedPieces.css';

interface CapturedPiecesProps {
  capturedPieces: PieceType[];
  isFirstPlayer: boolean;
  isMyTurn: boolean;
  selectedPiece: PieceType | null;
  onPieceClick: (pieceType: PieceType) => void;
}

/**
 * 持ち駒を表示するコンポーネント
 */
export const CapturedPieces = ({
  capturedPieces,
  isFirstPlayer,
  isMyTurn,
  selectedPiece,
  onPieceClick,
}: CapturedPiecesProps) => {
  // 駒の種類ごとにカウント
  const pieceCounts = capturedPieces.reduce(
    (acc, pieceType) => {
      acc[pieceType] = (acc[pieceType] || 0) + 1;
      return acc;
    },
    {} as Record<PieceType, number>
  );

  const sortedPieceTypes = Object.keys(pieceCounts).sort() as PieceType[];

  return (
    <div
      className={`captured-pieces ${isFirstPlayer ? 'first-player' : 'second-player'}`}
    >
      <h3>{isFirstPlayer ? '先手' : '後手'}の持ち駒</h3>
      <div className="captured-pieces-list">
        {sortedPieceTypes.length === 0 ? (
          <div className="no-pieces">なし</div>
        ) : (
          sortedPieceTypes.map((pieceType) => (
            <button
              key={pieceType}
              className={`captured-piece ${
                selectedPiece === pieceType && isMyTurn ? 'selected' : ''
              } ${!isMyTurn ? 'disabled' : ''}`}
              onClick={() => isMyTurn && onPieceClick(pieceType)}
              disabled={!isMyTurn}
            >
              <span className="piece-name">{getPieceDisplayText(pieceType)}</span>
              {pieceCounts[pieceType] > 1 && (
                <span className="piece-count">×{pieceCounts[pieceType]}</span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
