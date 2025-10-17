/// <reference types="@figma/widget-typings" />

declare const figma: WidgetAPI;
declare const widget: typeof figma.widget;

// グローバル関数の型定義
declare function setTimeout(callback: () => void, ms: number): void;
declare function clearTimeout(id: any): void;
