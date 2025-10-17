# @shogi/figjam-widget

FigJam上で動作する将棋ゲームWidget

## 概要

このWidgetはFigJam上で将棋のゲームを遊べるようにするものです。
2人対戦モードとCPU対戦モードの2つのゲームモードをサポートしています。

## 機能

- **2人対戦モード**: 2人のプレイヤーが交互に駒を動かして対戦
- **CPU対戦モード**: プレイヤー（先手）とCPU（後手）が対戦
- **駒の移動**: クリックで駒を選択し、移動先をクリックして移動
- **持ち駒の配置**: 取った駒を持ち駒として配置可能
- **成り判定**: 駒が敵陣に入ると自動的に成る（必須の場合）
- **勝敗判定**: 王将が取られたらゲーム終了

## 開発

### ビルド

```bash
npm run build
```

### 型チェック

```bash
npm run type-check
```

### テスト実行

```bash
npm run test
```

### テスト実行（ウォッチモード）

```bash
npm run test
```

### テスト実行（単発）

```bash
npm run test:run
```

## ファイル構成

```
src/
├── code.tsx                 # Widgetのエントリーポイント
├── global.d.ts             # グローバル型定義
├── components/             # UIコンポーネント
│   ├── Board.tsx           # 将棋盤コンポーネント
│   ├── BoardCell.tsx       # 盤面のセルコンポーネント
│   ├── CapturedPieces.tsx  # 持ち駒表示コンポーネント
│   ├── GameControls.tsx    # ゲームコントロール
│   ├── GameInfo.tsx        # ゲーム情報表示
│   └── ModeSelection.tsx   # モード選択画面
├── types/
│   └── widgetState.ts      # Widget状態の型定義
└── utils/
    ├── gameStateManager.ts # ゲーム状態管理ロジック
    └── pieceMapping.ts     # 駒のマッピング定義

test/
├── gameStateManager.test.ts # ゲーム状態管理のテスト
└── pieceMapping.test.ts     # 駒マッピングのテスト
```

## 技術スタック

- **TypeScript**: 型安全な開発
- **@shogi/core**: 将棋のコアロジック（共通ライブラリ）
- **Figma Widget API**: FigJam Widget開発用API
- **Vitest**: テストフレームワーク

## 設計方針

### UIとロジックの分離

- `components/`: UIコンポーネント（表示のみ）
- `utils/`: ビジネスロジック（ゲーム状態管理）
- `@shogi/core`: 将棋のルールロジック（共通ライブラリ）

### 状態管理

Figma Widget APIの`useSyncedState`を使用して、Widget全体の状態を管理。
複数ユーザー間で状態が同期される。

### テスト方針

- ロジック関数には必ずユニットテストを作成
- `gameStateManager.ts`の各関数は独立してテスト可能
- Figma Widget固有のAPI（`useSyncedState`等）はテスト対象外

## 使い方

1. FigJamファイルを開く
2. Widgetメニューから「Shogi Game Widget」を選択
3. モード選択画面でゲームモードを選択
4. 駒をクリックして選択し、移動先をクリックして移動
5. 持ち駒をクリックして選択し、配置先をクリックして配置

## 注意事項

- CPU対戦モードでは、後手（CPU）のターンは自動的に指されます
- 成りが必須の場合（桂馬・香車が敵陣に入った場合など）は自動的に成ります
- ゲームをリセットする場合は「リセット」ボタンをクリックしてください
