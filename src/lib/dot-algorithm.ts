import { svgPathProperties } from "svg-path-properties";
import type { Dot, DotToDoResult, GuideLine } from "./types";

interface PathData {
  d: string;
  props: InstanceType<typeof svgPathProperties>;
  length: number;
}

/**
 * Compute dot-to-dot points from SVG path d-strings.
 * Designed to run client-side in <16ms for real-time slider updates.
 */
export function computeDots(
  pathStrings: string[],
  dotCount: number,
): DotToDoResult {
  if (pathStrings.length === 0 || dotCount < 2) {
    return { dots: [], guideLines: [] };
  }

  const pathsData = buildPathData(pathStrings);
  const totalLength = pathsData.reduce((sum, p) => sum + p.length, 0);

  if (totalLength === 0) {
    return { dots: [], guideLines: [] };
  }

  const filtered = pathsData.filter((p) => p.length > totalLength * 0.005);
  if (filtered.length === 0) {
    return { dots: [], guideLines: [] };
  }

  const ordered = orderPaths(filtered);
  const distributed = distributeDots(ordered, dotCount);
  const rawDots = sampleDots(ordered, distributed);
  const dots = deduplicateDots(rawDots, 4);
  const guideLines = computeGuideLines(ordered, dots, dotCount);

  return { dots, guideLines };
}

function buildPathData(pathStrings: string[]): PathData[] {
  const result: PathData[] = [];
  for (const d of pathStrings) {
    try {
      const props = new svgPathProperties(d);
      const length = props.getTotalLength();
      if (length > 0) {
        result.push({ d, props, length });
      }
    } catch {
      // skip unparseable paths
    }
  }
  return result;
}

/**
 * Order paths using nearest-neighbor heuristic.
 * For each unvisited path, pick the one whose start (or reversed end)
 * is closest to the current position.
 */
function orderPaths(paths: PathData[]): PathData[] {
  if (paths.length <= 1) return [...paths];

  const used = new Set<number>();
  const ordered: PathData[] = [];

  let current = paths[0];
  ordered.push(current);
  used.add(0);
  let pos = current.props.getPointAtLength(current.length);

  while (ordered.length < paths.length) {
    let bestIdx = -1;
    let bestDist = Infinity;

    for (let i = 0; i < paths.length; i++) {
      if (used.has(i)) continue;
      const p = paths[i];
      const start = p.props.getPointAtLength(0);
      const dist = Math.hypot(pos.x - start.x, pos.y - start.y);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }

    if (bestIdx === -1) break;

    current = paths[bestIdx];
    ordered.push(current);
    used.add(bestIdx);
    pos = current.props.getPointAtLength(current.length);
  }

  return ordered;
}

/**
 * Distribute dot count across paths proportional to their lengths.
 * Each path gets at least 2 dots (start + end).
 */
function distributeDots(paths: PathData[], dotCount: number): number[] {
  const totalLength = paths.reduce((s, p) => s + p.length, 0);
  const minPerPath = 2;
  const reservedDots = paths.length * minPerPath;
  const extraDots = Math.max(0, dotCount - reservedDots);

  const counts = paths.map((p) => {
    const extra = Math.round((p.length / totalLength) * extraDots);
    return minPerPath + extra;
  });

  const sum = counts.reduce((a, b) => a + b, 0);
  let diff = dotCount - sum;

  const sorted = paths
    .map((p, i) => ({ i, length: p.length }))
    .sort((a, b) => b.length - a.length);

  let idx = 0;
  while (diff > 0) {
    counts[sorted[idx % sorted.length].i]++;
    diff--;
    idx++;
  }
  while (diff < 0) {
    const target = sorted[idx % sorted.length].i;
    if (counts[target] > minPerPath) {
      counts[target]--;
      diff++;
    }
    idx++;
    if (idx > paths.length * 2) break;
  }

  return counts;
}

function sampleDots(paths: PathData[], counts: number[]): Dot[] {
  const dots: Dot[] = [];
  let n = 1;

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const count = counts[i];

    for (let j = 0; j < count; j++) {
      const t = count <= 1 ? 0 : (j / (count - 1)) * path.length;
      const pt = path.props.getPointAtLength(t);
      dots.push({
        x: Math.round(pt.x * 100) / 100,
        y: Math.round(pt.y * 100) / 100,
        n: n++,
      });
    }
  }

  return dots;
}

/**
 * Remove dots that are closer than `minDistance` pixels,
 * keeping the lower-numbered dot and reassigning numbers.
 */
function deduplicateDots(dots: Dot[], minDistance: number): Dot[] {
  const kept: Dot[] = [];

  for (const dot of dots) {
    const tooClose = kept.some(
      (k) => Math.hypot(k.x - dot.x, k.y - dot.y) < minDistance,
    );
    if (!tooClose) {
      kept.push(dot);
    }
  }

  return kept.map((d, i) => ({ ...d, n: i + 1 }));
}

/**
 * For low dot counts, retain some path segments as guide lines
 * to keep the image recognizable.
 */
function computeGuideLines(
  paths: PathData[],
  dots: Dot[],
  dotCount: number,
): GuideLine[] {
  if (dotCount >= 80 || dots.length < 3) return [];

  const guideRatio = Math.max(0, Math.min(1, 1 - dotCount / 80));
  const lines: GuideLine[] = [];

  for (const path of paths) {
    if (Math.random() > guideRatio * 0.6) continue;
    lines.push({ path: path.d });
  }

  return lines;
}
