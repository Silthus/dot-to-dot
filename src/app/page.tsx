"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { PromptInput } from "@/components/PromptInput";
import { ImagePicker } from "@/components/ImagePicker";
import { DotControls } from "@/components/DotControls";
import { PaperFrame } from "@/components/PaperFrame";
import { ExportButton } from "@/components/ExportButton";
import { computeDots } from "@/lib/dot-algorithm";
import type { GeneratedImage, TracedPaths } from "@/lib/types";

export default function Home() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dotCount, setDotCount] = useState(60);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const traceImage = useCallback(
    async (imageId: string, base64: string) => {
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId ? { ...img, tracing: true } : img,
        ),
      );

      try {
        const res = await fetch("/api/trace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        if (!res.ok) throw new Error("Tracing failed");

        const traced: TracedPaths = await res.json();

        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? { ...img, traced, tracing: false }
              : img,
          ),
        );
      } catch {
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, tracing: false } : img,
          ),
        );
      }
    },
    [],
  );

  const handleGenerate = useCallback(
    async (userPrompt: string) => {
      setIsGenerating(true);
      setError(null);
      setPrompt(userPrompt);
      setSelectedId(null);
      setImages([]);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userPrompt }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Generation failed");
        }

        const { images: base64Images } = await res.json();

        const newImages: GeneratedImage[] = base64Images.map(
          (b64: string, i: number) => ({
            id: `img-${Date.now()}-${i}`,
            base64: b64,
          }),
        );

        setImages(newImages);

        // Pre-warm: trace all 3 in parallel immediately
        for (const img of newImages) {
          traceImage(img.id, img.base64);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong",
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [traceImage],
  );

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const selectedImage = useMemo(
    () => images.find((img) => img.id === selectedId),
    [images, selectedId],
  );

  const dotResult = useMemo(() => {
    if (!selectedImage?.traced) return null;
    return computeDots(selectedImage.traced.paths, dotCount);
  }, [selectedImage?.traced, dotCount]);

  const showPreview = selectedImage?.traced && dotResult && dotResult.dots.length > 0;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <header className="mb-12 text-center animate-fade-up">
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold text-ink tracking-tight">
            Dot-to-Dot Studio
          </h1>
          <p className="mt-3 text-lg text-graphite">
            Describe anything. We&rsquo;ll turn it into a connect-the-dots puzzle.
          </p>
        </header>

        {/* Prompt */}
        <section
          className="mb-10 animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          <PromptInput onSubmit={handleGenerate} isGenerating={isGenerating} />
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-8 rounded-xl border border-terracotta/20 bg-terracotta/5 px-5 py-3 text-sm text-terracotta"
          >
            {error}
          </div>
        )}

        {/* Image Picker */}
        {(images.length > 0 || isGenerating) && (
          <section className="mb-10">
            <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg font-medium text-ink">
              {selectedId ? "Selected Drawing" : "Pick a Drawing"}
            </h2>
            <ImagePicker
              images={images}
              selectedId={selectedId}
              onSelect={handleSelect}
              isLoading={isGenerating}
            />
          </section>
        )}

        {/* Dot Controls + Preview */}
        {selectedImage && (
          <section className="animate-fade-up">
            <div className="mb-6 max-w-xs">
              <DotControls dotCount={dotCount} onChange={setDotCount} />
            </div>

            {selectedImage.tracing && !selectedImage.traced && (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3 text-graphite">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
                  </svg>
                  <span>Tracing lines&hellip;</span>
                </div>
              </div>
            )}

            {showPreview && (
              <div className="flex flex-col items-center gap-8">
                <div className="w-full max-w-lg">
                  <PaperFrame title={prompt}>
                    <svg
                      ref={svgRef}
                      viewBox={selectedImage.traced!.viewBox}
                      className="h-full w-full"
                      role="img"
                      aria-label={`Connect-the-dots puzzle with ${dotResult.dots.length} dots`}
                    >
                      {dotResult.guideLines.map((line, i) => (
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

                      {dotResult.dots.length >= 2 && (
                        <path
                          d={dotResult.dots
                            .map((d, i) => `${i === 0 ? "M" : "L"} ${d.x} ${d.y}`)
                            .join(" ")}
                          fill="none"
                          stroke="#E8E2D8"
                          strokeWidth={0.5}
                          strokeDasharray="2 4"
                          opacity={0.3}
                        />
                      )}

                      {dotResult.dots.map((dot) => {
                        const vb = selectedImage.traced!.viewBox.split(/\s+/).map(Number);
                        const r = Math.max(2, Math.min(5, (vb[2] || 500) / 120));
                        const fs = r * 2.4;
                        const off = r + fs * 0.6;
                        return (
                          <g key={dot.n}>
                            <circle cx={dot.x} cy={dot.y} r={r} fill="#1A1613" />
                            <text
                              x={dot.x + off}
                              y={dot.y + fs * 0.35}
                              fontSize={fs}
                              fontFamily="sans-serif"
                              fill="#6B6560"
                            >
                              {dot.n}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </PaperFrame>
                </div>

                <ExportButton
                  svgRef={svgRef}
                  title={prompt}
                  dotCount={dotResult.dots.length}
                />
              </div>
            )}
          </section>
        )}

        {/* Empty State */}
        {!isGenerating && images.length === 0 && (
          <section className="mt-8 text-center animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="mx-auto max-w-md rounded-2xl border-2 border-dashed border-wash p-12">
              <svg
                className="mx-auto mb-4 h-16 w-16 text-wash"
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="20" cy="20" r="3" fill="currentColor" />
                <circle cx="44" cy="16" r="3" fill="currentColor" />
                <circle cx="48" cy="40" r="3" fill="currentColor" />
                <circle cx="24" cy="48" r="3" fill="currentColor" />
                <circle cx="36" cy="32" r="3" fill="currentColor" />
                <path d="M20 20L36 32M36 32L44 16M36 32L48 40M36 32L24 48" strokeDasharray="3 3" />
                <text x="17" y="17" fontSize="6" fill="currentColor">1</text>
                <text x="47" y="14" fontSize="6" fill="currentColor">2</text>
                <text x="51" y="38" fontSize="6" fill="currentColor">3</text>
                <text x="27" y="46" fontSize="6" fill="currentColor">4</text>
                <text x="33" y="30" fontSize="6" fill="currentColor">5</text>
              </svg>
              <p className="font-[family-name:var(--font-display)] text-lg text-graphite">
                Describe something above to get started
              </p>
              <p className="mt-1 text-sm text-graphite/60">
                We&rsquo;ll generate three line art options for you to choose from
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
