"use client";

import { useCallback, useRef, useState } from "react";

const PLACEHOLDER_IDEAS = [
  "a friendly dinosaur\u2026",
  "a lighthouse by the sea\u2026",
  "a rocket ship in space\u2026",
  "a cupcake with sprinkles\u2026",
  "a castle on a hill\u2026",
  "a playful kitten\u2026",
  "a hot air balloon\u2026",
  "a tropical fish\u2026",
];

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
}

export function PromptInput({ onSubmit, isGenerating }: PromptInputProps) {
  const [value, setValue] = useState("");
  const [placeholder] = useState(
    () => PLACEHOLDER_IDEAS[Math.floor(Math.random() * PLACEHOLDER_IDEAS.length)],
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed.length > 0 && !isGenerating) {
        onSubmit(trimmed);
      }
    },
    [value, isGenerating, onSubmit],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={2}
          disabled={isGenerating}
          aria-label="Describe what you want to draw"
          className="w-full resize-none rounded-2xl border-2 border-wash bg-cream px-6 py-5 pr-28
            font-[family-name:var(--font-body)] text-lg text-ink
            placeholder:text-graphite/50
            focus:border-terracotta focus:outline-none
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-colors duration-200"
        />
        <button
          type="submit"
          disabled={isGenerating || value.trim().length === 0}
          aria-label="Generate dot-to-dot images"
          className="absolute right-3 bottom-3 rounded-xl bg-terracotta px-5 py-2.5
            font-[family-name:var(--font-display)] font-semibold text-sm text-cream tracking-wide uppercase
            hover:bg-sienna active:animate-stamp
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors duration-150
            focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="60"
                  strokeDashoffset="20"
                  strokeLinecap="round"
                />
              </svg>
              Drawing&hellip;
            </span>
          ) : (
            "Generate"
          )}
        </button>
      </div>
    </form>
  );
}
