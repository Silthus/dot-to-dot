"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { templates, type TemplateConfig } from "@/data/template-config";
import { parseSVG } from "@/lib/svg-parser";
import { samplePoints } from "@/lib/point-sampler";
import { orderPaths, type NumberedPoint } from "@/lib/path-orderer";
import { exportToPDF } from "@/lib/pdf-export";
import ControlPanel from "@/components/ControlPanel";
import TemplatePreview from "@/components/TemplatePreview";
import DotToDotCanvas from "@/components/DotToDotCanvas";
import ExportButton from "@/components/ExportButton";

export default function Home() {
  const [category, setCategory] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateConfig>(templates[0]);
  const [dotCount, setDotCount] = useState(templates[0].recommendedDots);
  const [svgContent, setSvgContent] = useState("");
  const [dots, setDots] = useState<NumberedPoint[]>([]);
  const [viewBox, setViewBox] = useState({
    x: 0,
    y: 0,
    width: 500,
    height: 500,
  });
  const [viewMode, setViewMode] = useState<"template" | "dots">("dots");
  const [isProcessing, setIsProcessing] = useState(false);

  const dotsSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetch(`/templates/${template.svgFilename}`)
      .then((r) => r.text())
      .then(setSvgContent)
      .catch(console.error);
  }, [template]);

  const generateDots = useCallback((svg: string, count: number) => {
    if (!svg) return;
    setIsProcessing(true);

    setTimeout(() => {
      try {
        const parsed = parseSVG(svg);
        setViewBox(parsed.viewBox);
        const sampled = samplePoints(parsed.paths, count);
        const ordered = orderPaths(sampled);
        setDots(ordered);
      } catch (err) {
        console.error("Processing error:", err);
      } finally {
        setIsProcessing(false);
      }
    }, 50);
  }, []);

  useEffect(() => {
    if (svgContent) generateDots(svgContent, dotCount);
  }, [svgContent, dotCount, generateDots]);

  const handleTemplateChange = (t: TemplateConfig) => {
    setTemplate(t);
    setDotCount(t.recommendedDots);
  };

  const handleRandomize = () => {
    const pool = category
      ? templates.filter((t) => t.category === category)
      : templates;
    const random = pool[Math.floor(Math.random() * pool.length)];
    handleTemplateChange(random);
  };

  const handleRegenerate = () => {
    if (svgContent) generateDots(svgContent, dotCount);
  };

  const handleExport = async () => {
    if (!dotsSvgRef.current) return;
    await exportToPDF(dotsSvgRef.current, template.name, dotCount, svgContent);
  };

  return (
    <main className="min-h-screen bg-[#FFF6ED] p-4 md:p-6 lg:p-8">
      <header className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-rose-500 via-amber-500 to-teal-500 bg-clip-text text-transparent tracking-tight">
          Punkt-zu-Punkt
        </h1>
        <p className="text-slate-500 mt-1 text-lg">
          Verbinde die Punkte und entdecke das Bild!
        </p>
      </header>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        <ControlPanel
          selectedCategory={category}
          selectedTemplate={template}
          dotCount={dotCount}
          onCategoryChange={setCategory}
          onTemplateChange={handleTemplateChange}
          onDotCountChange={setDotCount}
          onRandomize={handleRandomize}
          onRegenerate={handleRegenerate}
        />

        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-white/80 shadow-lg overflow-hidden">
            <div className="flex border-b-2 border-slate-100">
              <button
                onClick={() => setViewMode("dots")}
                className={`flex-1 py-3 px-4 font-bold text-sm transition-all cursor-pointer ${
                  viewMode === "dots"
                    ? "bg-white text-indigo-600 border-b-3 border-indigo-500"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                ✏️ Punkt-zu-Punkt
              </button>
              <button
                onClick={() => setViewMode("template")}
                className={`flex-1 py-3 px-4 font-bold text-sm transition-all cursor-pointer ${
                  viewMode === "template"
                    ? "bg-white text-indigo-600 border-b-3 border-indigo-500"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                🖼️ Vorlage
              </button>
            </div>

            <div className="min-h-[350px] md:min-h-[450px] lg:min-h-[550px] flex items-center justify-center relative">
              {isProcessing && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-b-3xl">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
                    <span className="text-sm text-slate-500">
                      Wird berechnet...
                    </span>
                  </div>
                </div>
              )}

              {viewMode === "template" && svgContent ? (
                <TemplatePreview svgContent={svgContent} />
              ) : dots.length > 0 ? (
                <DotToDotCanvas
                  ref={dotsSvgRef}
                  dots={dots}
                  viewBox={viewBox}
                />
              ) : null}
            </div>

            <div className="px-4 py-2 bg-slate-50 text-xs text-slate-400 flex justify-between border-t border-slate-100">
              <span>
                {template.name} &middot;{" "}
                {template.difficulty === "easy"
                  ? "Einfach"
                  : template.difficulty === "medium"
                    ? "Mittel"
                    : "Schwer"}
              </span>
              <span>{dots.length} Punkte</span>
            </div>
          </div>

          <ExportButton onExport={handleExport} disabled={dots.length === 0} />
        </div>
      </div>
    </main>
  );
}
