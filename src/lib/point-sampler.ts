export interface Point {
  x: number;
  y: number;
}

const MIN_DISTANCE = 3;
const SVG_NS = "http://www.w3.org/2000/svg";

export function samplePoints(
  pathDataArray: string[],
  totalDots: number,
): Point[][] {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 500 500");
  svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
  document.body.appendChild(svg);

  const pathEls = pathDataArray.map((d) => {
    const p = document.createElementNS(SVG_NS, "path");
    p.setAttribute("d", d);
    svg.appendChild(p);
    return p;
  });

  const lengths = pathEls.map((p) => p.getTotalLength());
  const totalLength = lengths.reduce((s, l) => s + l, 0);

  if (totalLength === 0) {
    document.body.removeChild(svg);
    return [];
  }

  const result = pathEls.map((el, i) => {
    const len = lengths[i];
    if (len === 0) return [];

    const count = Math.max(2, Math.round((len / totalLength) * totalDots));
    const step = len / count;
    const points: Point[] = [];

    for (let j = 0; j <= count; j++) {
      const dist = Math.min(j * step, len);
      const pt = el.getPointAtLength(dist);
      const p = {
        x: Math.round(pt.x * 100) / 100,
        y: Math.round(pt.y * 100) / 100,
      };

      if (points.length > 0) {
        const prev = points[points.length - 1];
        const d = Math.hypot(p.x - prev.x, p.y - prev.y);
        if (d < MIN_DISTANCE) continue;
      }

      points.push(p);
    }

    if (points.length > 2) {
      const first = points[0];
      const last = points[points.length - 1];
      if (Math.hypot(first.x - last.x, first.y - last.y) < MIN_DISTANCE) {
        points.pop();
      }
    }

    return points;
  });

  document.body.removeChild(svg);
  return result;
}
