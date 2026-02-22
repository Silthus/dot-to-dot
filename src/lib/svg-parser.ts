export interface ParsedSVG {
  paths: string[];
  viewBox: { x: number; y: number; width: number; height: number };
}

export function parseSVG(svgString: string): ParsedSVG {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgEl = doc.querySelector("svg");

  const vb = svgEl
    ?.getAttribute("viewBox")
    ?.split(/[\s,]+/)
    .map(Number) || [0, 0, 500, 500];

  const paths: string[] = [];
  doc.querySelectorAll("path").forEach((p) => {
    const d = p.getAttribute("d");
    if (d && d.trim().length > 0) paths.push(d);
  });

  return {
    paths,
    viewBox: { x: vb[0], y: vb[1], width: vb[2], height: vb[3] },
  };
}
