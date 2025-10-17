/**
 * Hex色をFigma Widget用のRGBオブジェクトに変換
 * @param hex - 6桁のhex色文字列（例: "#FFFFFF" または "FFFFFF"）
 * @returns RGB値（0-1の範囲）を持つオブジェクト
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // #を除去
  const cleanHex = hex.replace("#", "");

  // 16進数を10進数に変換し、0-1の範囲に正規化
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  return { r, g, b };
}
