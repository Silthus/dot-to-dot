"use client";

import {
  templates,
  categories,
  type TemplateConfig,
} from "@/data/template-config";

interface ControlPanelProps {
  selectedCategory: string | null;
  selectedTemplate: TemplateConfig;
  dotCount: number;
  onCategoryChange: (category: string | null) => void;
  onTemplateChange: (template: TemplateConfig) => void;
  onDotCountChange: (count: number) => void;
  onRandomize: () => void;
  onRegenerate: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  animals: "bg-amber-400 hover:bg-amber-500 text-amber-950",
  vehicles: "bg-sky-400 hover:bg-sky-500 text-sky-950",
  other: "bg-violet-400 hover:bg-violet-500 text-violet-950",
};

export default function ControlPanel({
  selectedCategory,
  selectedTemplate,
  dotCount,
  onCategoryChange,
  onTemplateChange,
  onDotCountChange,
  onRandomize,
  onRegenerate,
}: ControlPanelProps) {
  const filteredTemplates = selectedCategory
    ? templates.filter((t) => t.category === selectedCategory)
    : templates;

  return (
    <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-5 p-5 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-white/80 shadow-lg">
      <div className="flex gap-2">
        <button
          onClick={onRandomize}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          🎲 Zufaelliges Bild
        </button>
        <button
          onClick={onRegenerate}
          className="py-3 px-4 bg-gradient-to-r from-teal-400 to-emerald-500 text-white font-bold rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          ↻
        </button>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
          Kategorie
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              selectedCategory === null
                ? "bg-slate-700 text-white shadow-md"
                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            Alle
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? `${CATEGORY_COLORS[cat.id]} shadow-md`
                  : "bg-slate-200 text-slate-600 hover:bg-slate-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
          Vorlage
        </h3>
        <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
          {filteredTemplates.map((t) => (
            <button
              key={t.id}
              onClick={() => onTemplateChange(t)}
              className={`p-3 rounded-xl text-left text-sm font-medium transition-all cursor-pointer ${
                selectedTemplate.id === t.id
                  ? "bg-indigo-100 border-2 border-indigo-400 text-indigo-800 shadow-sm"
                  : "bg-slate-100 border-2 border-transparent text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span className="block truncate">{t.name}</span>
              <span className="text-xs opacity-60">
                {t.difficulty === "easy"
                  ? "Einfach"
                  : t.difficulty === "medium"
                    ? "Mittel"
                    : "Schwer"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
          Punkte: <span className="text-indigo-600 text-base">{dotCount}</span>
        </h3>
        <input
          type="range"
          min={30}
          max={500}
          step={10}
          value={dotCount}
          onChange={(e) => onDotCountChange(Number(e.target.value))}
          className="w-full h-3 rounded-full appearance-none bg-gradient-to-r from-emerald-300 via-sky-300 to-violet-400 cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Wenig (30)</span>
          <span>Viel (500)</span>
        </div>
      </div>
    </aside>
  );
}
