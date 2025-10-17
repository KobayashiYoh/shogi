import { describe, it, expect } from "vitest";
import { hexToRgb } from "../colorUtils";

describe("colorUtils", () => {
  describe("hexToRgb", () => {
    it("should convert hex color with # prefix to RGB object", () => {
      const result = hexToRgb("#FFFFFF");
      expect(result).toEqual({ r: 1, g: 1, b: 1 });
    });

    it("should convert hex color without # prefix to RGB object", () => {
      const result = hexToRgb("FFFFFF");
      expect(result).toEqual({ r: 1, g: 1, b: 1 });
    });

    it("should convert black color correctly", () => {
      const result = hexToRgb("#000000");
      expect(result).toEqual({ r: 0, g: 0, b: 0 });
    });

    it("should convert gray color correctly", () => {
      const result = hexToRgb("#333333");
      // 0x33 = 51 in decimal, 51/255 ≈ 0.2
      expect(result.r).toBeCloseTo(0.2, 2);
      expect(result.g).toBeCloseTo(0.2, 2);
      expect(result.b).toBeCloseTo(0.2, 2);
    });

    it("should convert red color correctly", () => {
      const result = hexToRgb("#FF0000");
      expect(result).toEqual({ r: 1, g: 0, b: 0 });
    });

    it("should convert green color correctly", () => {
      const result = hexToRgb("#00FF00");
      expect(result).toEqual({ r: 0, g: 1, b: 0 });
    });

    it("should convert blue color correctly", () => {
      const result = hexToRgb("#0000FF");
      expect(result).toEqual({ r: 0, g: 0, b: 1 });
    });

    it("should convert golden color correctly", () => {
      const result = hexToRgb("#FFD700");
      expect(result.r).toBe(1);
      expect(result.g).toBeCloseTo(0.843, 2);
      expect(result.b).toBe(0);
    });

    it("should convert board background color correctly", () => {
      const result = hexToRgb("#B9823E");
      // 0xB9 = 185, 0x82 = 130, 0x3E = 62
      expect(result.r).toBeCloseTo(185 / 255, 3);
      expect(result.g).toBeCloseTo(130 / 255, 3);
      expect(result.b).toBeCloseTo(62 / 255, 3);
    });

    it("should handle lowercase hex values", () => {
      const result = hexToRgb("#ffffff");
      expect(result).toEqual({ r: 1, g: 1, b: 1 });
    });

    it("should handle mixed case hex values", () => {
      const result = hexToRgb("#FfFfFf");
      expect(result).toEqual({ r: 1, g: 1, b: 1 });
    });

    it("should return values between 0 and 1", () => {
      const result = hexToRgb("#7F7F7F");
      expect(result.r).toBeGreaterThanOrEqual(0);
      expect(result.r).toBeLessThanOrEqual(1);
      expect(result.g).toBeGreaterThanOrEqual(0);
      expect(result.g).toBeLessThanOrEqual(1);
      expect(result.b).toBeGreaterThanOrEqual(0);
      expect(result.b).toBeLessThanOrEqual(1);
    });
  });
});
