interface PaperFrameProps {
  children: React.ReactNode;
  title?: string;
}

export function PaperFrame({ children, title }: PaperFrameProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-full bg-white rounded-sm overflow-hidden"
        style={{
          aspectRatio: "210 / 297",
          boxShadow:
            "0 1px 3px rgba(26,22,19,0.06), 0 6px 16px rgba(26,22,19,0.08), 0 20px 40px rgba(26,22,19,0.04)",
        }}
      >
        <div className="absolute inset-0 p-[6%] flex flex-col">
          {title && (
            <div className="mb-4 text-center">
              <p className="font-[family-name:var(--font-display)] text-sm text-graphite opacity-60 tracking-wider uppercase">
                Connect the Dots
              </p>
              <p className="font-[family-name:var(--font-display)] text-lg text-ink mt-0.5 text-pretty">
                {title}
              </p>
            </div>
          )}

          <div className="flex-1 min-h-0">
            {children}
          </div>

          <div className="mt-3 text-center">
            <p className="text-[10px] text-graphite/40 tracking-widest uppercase">
              Dot-to-Dot Studio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
