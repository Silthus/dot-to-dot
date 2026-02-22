"use client";

import { forwardRef } from "react";
import type { NumberedPoint } from "@/lib/path-orderer";

interface DotToDotCanvasProps {
  dots: NumberedPoint[];
  viewBox: { x: number; y: number; width: number; height: number };
  showGuideLines?: boolean;
}

function getLabelFontSize(totalDots: number): number {
  if (totalDots < 60) return 14;
  if (totalDots < 120) return 11;
  if (totalDots < 200) return 8;
  if (totalDots < 350) return 6;
  return 5;
}

function getDotRadius(totalDots: number): number {
  if (totalDots < 60) return 1.8;
  if (totalDots < 120) return 1.4;
  if (totalDots < 200) return 1;
  if (totalDots < 350) return 0.8;
  return 0.6;
}

function getLabelOffset(
  current: NumberedPoint,
  prev: NumberedPoint | null,
  next: NumberedPoint | null,
  fontSize: number,
): { dx: number; dy: number } {
  const offset = fontSize * 0.9;

  if (!prev && !next) return { dx: offset, dy: -offset };

  const ref = next || prev!;
  const dirX = current.x - ref.x;
  const dirY = current.y - ref.y;
  const len = Math.hypot(dirX, dirY) || 1;

  const perpX = -dirY / len;
  const perpY = dirX / len;

  return { dx: perpX * offset, dy: perpY * offset };
}

const DotToDotCanvas = forwardRef<SVGSVGElement, DotToDotCanvasProps>(
  function DotToDotCanvas({ dots, viewBox, showGuideLines = false }, ref) {
    const fontSize = getLabelFontSize(dots.length);
    const dotRadius = getDotRadius(dots.length);

    const pad = fontSize * 2;
    const vb = {
      x: viewBox.x - pad,
      y: viewBox.y - pad,
      width: viewBox.width + pad * 2,
      height: viewBox.height + pad * 2,
    };

    return (
      <div className="w-full h-full flex items-center justify-center p-2">
        <svg
          ref={ref}
          viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`}
          className="w-full h-full max-h-[80vh]"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x={vb.x}
            y={vb.y}
            width={vb.width}
            height={vb.height}
            fill="white"
          />

          {showGuideLines &&
            dots.map((dot, i) => {
              if (i === 0) return null;
              const prev = dots[i - 1];
              return (
                <line
                  key={`line-${i}`}
                  x1={prev.x}
                  y1={prev.y}
                  x2={dot.x}
                  y2={dot.y}
                  stroke="#e0e0e0"
                  strokeWidth={0.5}
                  strokeDasharray="2,2"
                />
              );
            })}

          {dots.map((dot, i) => {
            const prev = i > 0 ? dots[i - 1] : null;
            const next = i < dots.length - 1 ? dots[i + 1] : null;
            const labelPos = getLabelOffset(dot, prev, next, fontSize);

            return (
              <g key={dot.number}>
                <circle cx={dot.x} cy={dot.y} r={dotRadius} fill="#333" />
                <text
                  x={dot.x + labelPos.dx}
                  y={dot.y + labelPos.dy}
                  fontSize={fontSize}
                  fill="#555"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="sans-serif"
                  fontWeight="500"
                >
                  {dot.number}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  },
);

export default DotToDotCanvas;
