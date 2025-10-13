import './ModeSelection.css';

/**
 * モード選択画面のプロパティ
 */
export interface ModeSelectionProps {
  onSelectSinglePlayer: () => void;
  onSelectTwoPlayer: () => void;
}

/**
 * ゲームモード選択画面コンポーネント
 */
function ModeSelection({
  onSelectSinglePlayer,
  onSelectTwoPlayer,
}: ModeSelectionProps) {
  return (
    <div className="mode-selection">
      <h1 className="mode-selection__title">将棋</h1>
      <div className="mode-selection__buttons">
        <button
          className="mode-selection__button"
          onClick={onSelectSinglePlayer}
        >
          1人で遊ぶ
          <span className="mode-selection__button-description">vs CPU</span>
        </button>
        <button className="mode-selection__button" onClick={onSelectTwoPlayer}>
          2人で遊ぶ
          <span className="mode-selection__button-description">
            ローカル対戦
          </span>
        </button>
      </div>
    </div>
  );
}

export default ModeSelection;
