"use client";

interface DotControlsProps {
  dotCount: number;
  onChange: (count: number) => void;
}

function getDifficultyLabel(count: number): string {
  if (count <= 30) return "Easy";
  if (count <= 60) return "Medium";
  if (count <= 120) return "Hard";
  return "Expert";
}

function getDifficultyColor(count: number): string {
  if (count <= 30) return "text-sage";
  if (count <= 60) return "text-gold";
  if (count <= 120) return "text-sienna";
  return "text-terracotta";
}

export function DotControls({ dotCount, onChange }: DotControlsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label
          htmlFor="dot-count"
          className="font-[family-name:var(--font-display)] text-sm font-medium text-ink"
        >
          Number of Dots
        </label>
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-body)] text-xl font-semibold tabular-nums text-ink">
            {dotCount}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(dotCount)} bg-wash`}
          >
            {getDifficultyLabel(dotCount)}
          </span>
        </div>
      </div>

      <input
        id="dot-count"
        type="range"
        min={15}
        max={200}
        step={1}
        value={dotCount}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`Dot count: ${dotCount}`}
        className="w-full h-2 rounded-full appearance-none cursor-pointer
          bg-wash accent-terracotta
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-terracotta
          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150
          [&::-webkit-slider-thumb]:hover:scale-110
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
      />

      <div className="flex justify-between text-xs text-graphite">
        <span>Simple</span>
        <span>Detailed</span>
      </div>
    </div>
  );
}
