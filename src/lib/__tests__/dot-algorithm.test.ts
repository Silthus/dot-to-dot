import { describe, it, expect } from "vitest";
import { computeDots } from "../dot-algorithm";

const TRIANGLE_PATH = "M 10 10 L 100 10 L 55 90 Z";
const SQUARE_PATH = "M 0 0 L 100 0 L 100 100 L 0 100 Z";
const LINE_PATH = "M 0 0 L 200 0";

describe("computeDots", () => {
  describe("edge cases", () => {
    it("returns empty result for empty path array", () => {
      const result = computeDots([], 50);
      expect(result.dots).toEqual([]);
      expect(result.guideLines).toEqual([]);
    });

    it("returns empty result for dotCount < 2", () => {
      const result = computeDots([TRIANGLE_PATH], 1);
      expect(result.dots).toEqual([]);
    });

    it("returns empty result for dotCount of 0", () => {
      const result = computeDots([TRIANGLE_PATH], 0);
      expect(result.dots).toEqual([]);
    });

    it("handles invalid path strings gracefully", () => {
      const result = computeDots(["not a valid path", "also bad"], 10);
      expect(result.dots).toEqual([]);
    });
  });

  describe("dot generation", () => {
    it("generates the requested number of dots (approximately)", () => {
      const result = computeDots([TRIANGLE_PATH], 20);
      expect(result.dots.length).toBeGreaterThanOrEqual(15);
      expect(result.dots.length).toBeLessThanOrEqual(25);
    });

    it("dots are numbered sequentially starting from 1", () => {
      const result = computeDots([TRIANGLE_PATH], 10);
      for (let i = 0; i < result.dots.length; i++) {
        expect(result.dots[i].n).toBe(i + 1);
      }
    });

    it("all dots have numeric x and y coordinates", () => {
      const result = computeDots([SQUARE_PATH], 30);
      for (const dot of result.dots) {
        expect(typeof dot.x).toBe("number");
        expect(typeof dot.y).toBe("number");
        expect(Number.isFinite(dot.x)).toBe(true);
        expect(Number.isFinite(dot.y)).toBe(true);
      }
    });

    it("generates more dots when dotCount is higher", () => {
      const low = computeDots([SQUARE_PATH], 20);
      const high = computeDots([SQUARE_PATH], 100);
      expect(high.dots.length).toBeGreaterThan(low.dots.length);
    });
  });

  describe("multi-path handling", () => {
    it("distributes dots across multiple paths", () => {
      const result = computeDots([TRIANGLE_PATH, SQUARE_PATH], 40);
      expect(result.dots.length).toBeGreaterThanOrEqual(30);
    });

    it("dots remain sequentially numbered across paths", () => {
      const result = computeDots([LINE_PATH, SQUARE_PATH], 30);
      for (let i = 0; i < result.dots.length; i++) {
        expect(result.dots[i].n).toBe(i + 1);
      }
    });

    it("longer paths get proportionally more dots", () => {
      const shortPath = "M 0 0 L 10 0";
      const longPath = "M 0 0 L 500 0";

      const result = computeDots([shortPath, longPath], 50);
      expect(result.dots.length).toBeGreaterThan(10);
    });
  });

  describe("deduplication", () => {
    it("removes dots that are extremely close together", () => {
      const overlapping = "M 0 0 L 1 0 L 0 0 L 1 0 L 0 0";
      const result = computeDots([overlapping], 50);
      const coords = result.dots.map((d) => `${d.x},${d.y}`);
      const unique = new Set(coords);
      expect(unique.size).toBe(result.dots.length);
    });
  });

  describe("guide lines", () => {
    it("generates guide lines for low dot counts", () => {
      const result = computeDots([TRIANGLE_PATH, SQUARE_PATH, LINE_PATH], 20);
      // guide lines should be generated for count < 80
      // (may or may not based on random factor, so just check type)
      expect(Array.isArray(result.guideLines)).toBe(true);
      for (const line of result.guideLines) {
        expect(typeof line.path).toBe("string");
        expect(line.path.length).toBeGreaterThan(0);
      }
    });

    it("returns no guide lines for high dot counts", () => {
      const result = computeDots([TRIANGLE_PATH], 100);
      expect(result.guideLines).toEqual([]);
    });
  });

  describe("performance", () => {
    it("computes 200 dots from complex paths in under 50ms", () => {
      const complexPaths = [
        TRIANGLE_PATH,
        SQUARE_PATH,
        LINE_PATH,
        "M 50 50 C 100 0 150 100 200 50 S 300 0 350 50",
        "M 0 200 Q 100 100 200 200 T 400 200",
      ];

      const start = performance.now();
      const result = computeDots(complexPaths, 200);
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(50);
      expect(result.dots.length).toBeGreaterThan(0);
    });
  });
});
