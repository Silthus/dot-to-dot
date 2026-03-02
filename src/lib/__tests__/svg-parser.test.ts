import { describe, it, expect } from "vitest";
import { parsePotraceSvg } from "../svg-parser";

const SAMPLE_SVG = `<?xml version="1.0" standalone="no"?>
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="500" height="500" viewBox="0 0 500 500">
<path d="M100 100 L200 200 L300 100 Z" stroke="#000" fill="none"/>
<path d="M50 50 C 100 0 150 100 200 50" stroke="#000" fill="none"/>
</svg>`;

const MINIMAL_SVG = `<svg viewBox="0 0 200 300"><path d="M0 0L100 100"/></svg>`;

describe("parsePotraceSvg", () => {
  it("extracts path d-attributes from SVG", () => {
    const result = parsePotraceSvg(SAMPLE_SVG);
    expect(result.paths).toHaveLength(2);
    expect(result.paths[0]).toBe("M100 100 L200 200 L300 100 Z");
    expect(result.paths[1]).toBe("M50 50 C 100 0 150 100 200 50");
  });

  it("extracts viewBox", () => {
    const result = parsePotraceSvg(SAMPLE_SVG);
    expect(result.viewBox).toBe("0 0 500 500");
  });

  it("extracts width and height", () => {
    const result = parsePotraceSvg(SAMPLE_SVG);
    expect(result.width).toBe(500);
    expect(result.height).toBe(500);
  });

  it("handles SVG with only viewBox (no explicit width/height)", () => {
    const result = parsePotraceSvg(MINIMAL_SVG);
    expect(result.viewBox).toBe("0 0 200 300");
    expect(result.width).toBe(200);
    expect(result.height).toBe(300);
  });

  it("returns empty array for SVG with no paths", () => {
    const result = parsePotraceSvg('<svg viewBox="0 0 100 100"></svg>');
    expect(result.paths).toEqual([]);
  });

  it("defaults viewBox when not present", () => {
    const result = parsePotraceSvg('<svg><path d="M0 0L10 10"/></svg>');
    expect(result.viewBox).toBe("0 0 500 500");
  });

  it("skips empty d attributes", () => {
    const svg = '<svg viewBox="0 0 100 100"><path d=""/><path d="M0 0L1 1"/></svg>';
    const result = parsePotraceSvg(svg);
    expect(result.paths).toHaveLength(1);
  });
});
