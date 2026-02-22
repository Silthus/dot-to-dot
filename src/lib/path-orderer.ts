import type { Point } from "./point-sampler";

export interface NumberedPoint {
  x: number;
  y: number;
  number: number;
}

function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function orderPaths(pathPoints: Point[][]): NumberedPoint[] {
  const filtered = pathPoints.filter((pts) => pts.length > 0);
  if (filtered.length === 0) return [];

  if (filtered.length === 1) {
    return filtered[0].map((p, i) => ({ ...p, number: i + 1 }));
  }

  const used = new Set<number>();
  const order: number[] = [0];
  const reversed: boolean[] = [false];
  used.add(0);

  while (used.size < filtered.length) {
    const lastIdx = order[order.length - 1];
    const lastPath = filtered[lastIdx];
    const lastReversed = reversed[reversed.length - 1];
    const lastPoint = lastReversed
      ? lastPath[0]
      : lastPath[lastPath.length - 1];

    let bestIdx = -1;
    let bestDist = Infinity;
    let bestReverse = false;

    for (let i = 0; i < filtered.length; i++) {
      if (used.has(i)) continue;

      const startDist = dist(lastPoint, filtered[i][0]);
      const endDist = dist(lastPoint, filtered[i][filtered[i].length - 1]);

      if (startDist < bestDist) {
        bestDist = startDist;
        bestIdx = i;
        bestReverse = false;
      }
      if (endDist < bestDist) {
        bestDist = endDist;
        bestIdx = i;
        bestReverse = true;
      }
    }

    if (bestIdx >= 0) {
      used.add(bestIdx);
      order.push(bestIdx);
      reversed.push(bestReverse);
    }
  }

  const result: NumberedPoint[] = [];
  let num = 1;

  for (let i = 0; i < order.length; i++) {
    const pts = reversed[i]
      ? [...filtered[order[i]]].reverse()
      : filtered[order[i]];
    for (const p of pts) {
      result.push({ x: p.x, y: p.y, number: num++ });
    }
  }

  return result;
}
