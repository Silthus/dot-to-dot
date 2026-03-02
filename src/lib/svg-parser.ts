/**
 * Extracts SVG path d-attribute strings and viewBox from a potrace SVG string.
 * Potrace outputs SVGs with <path> elements we need to decompose into
 * individual drawing paths for the dot-to-dot algorithm.
 */
export function parsePotraceSvg(svgString: string): {
  paths: string[];
  viewBox: string;
  width: number;
  height: number;
} {
  const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);
  const widthMatch = svgString.match(/width="(\d+)/);
  const heightMatch = svgString.match(/height="(\d+)/);

  const viewBox = viewBoxMatch?.[1] ?? "0 0 500 500";
  const parts = viewBox.split(/\s+/).map(Number);
  const width = widthMatch ? parseInt(widthMatch[1]) : parts[2] || 500;
  const height = heightMatch ? parseInt(heightMatch[1]) : parts[3] || 500;

  const pathRegex = /\bd="([^"]+)"/g;
  const paths: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = pathRegex.exec(svgString)) !== null) {
    const d = match[1].trim();
    if (d.length > 0) {
      paths.push(d);
    }
  }

  return { paths, viewBox, width, height };
}
