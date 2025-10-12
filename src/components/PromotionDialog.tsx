import React from 'react';
import type { PieceType } from '../types';
import { getPieceDisplayText } from '../utils/pieceDisplay';
import { getPromotedPieceTypeFromOriginalPieceType } from '../utils/promotionLogic';
import './PromotionDialog.css';

interface PromotionDialogProps {
  pieceType: PieceType;
  onPromote: () => void;
  onDecline: () => void;
  mustPromote: boolean;
}

/**
 * 成り選択ダイアログコンポーネント
 */
const PromotionDialog: React.FC<PromotionDialogProps> = ({
  pieceType,
  onPromote,
  onDecline,
  mustPromote,
}) => {
  const promotedType = getPromotedPieceTypeFromOriginalPieceType(pieceType);

  return (
    <div className="promotion-dialog-overlay">
      <div className="promotion-dialog">
        <h3>成りますか？</h3>
        <div className="promotion-options">
          <button className="promotion-button promote" onClick={onPromote}>
            成る
            <br />
            {promotedType && getPieceDisplayText(promotedType)}
          </button>
          {!mustPromote && (
            <button className="promotion-button decline" onClick={onDecline}>
              成らない
              <br />
              {getPieceDisplayText(pieceType)}
            </button>
          )}
        </div>
        {mustPromote && (
          <p className="must-promote-message">この位置では成る必要があります</p>
        )}
      </div>
    </div>
  );
};

export default PromotionDialog;
