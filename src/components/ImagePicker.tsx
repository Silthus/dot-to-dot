"use client";

import type { GeneratedImage } from "@/lib/types";

interface ImagePickerProps {
  images: GeneratedImage[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

function SkeletonCard({ delay }: { delay: number }) {
  return (
    <div
      className="aspect-square rounded-2xl animate-shimmer"
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden="true"
    />
  );
}

export function ImagePicker({
  images,
  selectedId,
  onSelect,
  isLoading,
}: ImagePickerProps) {
  if (isLoading && images.length === 0) {
    return (
      <div className="grid grid-cols-3 gap-4" role="status" aria-label="Generating images">
        <SkeletonCard delay={0} />
        <SkeletonCard delay={200} />
        <SkeletonCard delay={400} />
      </div>
    );
  }

  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-4" role="radiogroup" aria-label="Choose a line art drawing">
      {images.map((img, i) => {
        const isSelected = img.id === selectedId;
        const isTracing = img.tracing && !img.traced;

        return (
          <button
            key={img.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`Image option ${i + 1}${isTracing ? ", tracing in progress" : ""}`}
            onClick={() => onSelect(img.id)}
            className={`
              relative aspect-square overflow-hidden rounded-2xl border-3
              bg-white cursor-pointer
              animate-fade-up
              transition-all duration-300 ease-out
              hover:scale-[1.03] hover:shadow-lg
              focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-paper
              ${isSelected
                ? "border-terracotta shadow-lg scale-[1.02] ring-2 ring-terracotta/20"
                : "border-wash hover:border-graphite/30"
              }
              ${!isSelected && selectedId ? "opacity-50 scale-[0.97]" : ""}
            `}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- base64 data URIs cannot use next/image */}
            <img
              src={`data:image/png;base64,${img.base64}`}
              alt={`Generated line art option ${i + 1}`}
              className="h-full w-full object-contain p-2"
              width={512}
              height={512}
            />

            {isSelected && (
              <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-terracotta text-cream">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            {isTracing && (
              <div className="absolute inset-x-0 bottom-0 bg-paper/80 py-1.5 text-center text-xs text-graphite">
                Tracing&hellip;
              </div>
            )}
          </button>
        );
      })}

      {isLoading &&
        Array.from({ length: 3 - images.length }, (_, i) => (
          <SkeletonCard key={`skeleton-${i}`} delay={0} />
        ))}
    </div>
  );
}
