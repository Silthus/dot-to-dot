"use client";

import { useMemo } from "react";
import type { DotToDoResult } from "@/lib/types";

interface DotToDoCanvasProps {
  result: DotToDoResult;
  viewBox: string;
  showNumbers: boolean;
}

export function DotToDoCanvas({
  result,
  viewBox,
  showNumbers,
}: DotToDoCanvasProps) {
  const { dots, guideLines } = result;

  const connectingPath = useMemo(() => {
    if (dots.length < 2) return "";
    return dots
      .map((d, i) => `${i === 0 ? "M" : "L"} ${d.x} ${d.y}`)
      .join(" ");
  }, [dots]);

  const vbParts = viewBox.split(/\s+/).map(Number);
  const dotRadius = Math.max(2, Math.min(5, (vbParts[2] || 500) / 120));
  const fontSize = dotRadius * 2.4;
  const numberOffset = dotRadius + fontSize * 0.6;

  return (
    <svg
      viewBox={viewBox}
      className="h-full w-full"
      role="img"
      aria-label={`Connect-the-dots puzzle with ${dots.length} dots`}
    >
      {guideLines.map((line, i) => (
        <path
          key={`guide-${i}`}
          d={line.path}
          fill="none"
          stroke="#C8C2B8"
          strokeWidth={0.8}
          strokeDasharray="4 3"
          opacity={0.4}
        />
      ))}

      {dots.length >= 2 && (
        <path
          d={connectingPath}
          fill="none"
          stroke="#E8E2D8"
          strokeWidth={0.5}
          strokeDasharray="2 4"
          opacity={0.3}
        />
      )}

      {dots.map((dot) => (
        <g
          key={dot.n}
          style={{
            animationDelay: `${dot.n * 8}ms`,
          }}
          className="animate-[dot-appear_0.2s_ease-out_both]"
        >
          <circle
            cx={dot.x}
            cy={dot.y}
            r={dotRadius}
            fill="#1A1613"
          />
          {showNumbers && (
            <text
              x={dot.x + numberOffset}
              y={dot.y + fontSize * 0.35}
              fontSize={fontSize}
              fontFamily="var(--font-body), sans-serif"
              fill="#6B6560"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {dot.n}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
