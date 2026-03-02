"use client";

import { useCallback, useState } from "react";

interface ExportButtonProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  title: string;
  dotCount: number;
}

export function ExportButton({ svgRef, title, dotCount }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    const svgEl = svgRef.current;
    if (!svgEl || exporting) return;

    setExporting(true);

    try {
      const { jsPDF } = await import("jspdf");
      const { svg2pdf } = await import("svg2pdf.js");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const marginMm = 15;
      const contentW = 210 - marginMm * 2;
      const headerH = 18;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(107, 101, 96);
      pdf.text("CONNECT THE DOTS", 105, marginMm + 4, { align: "center" });

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(26, 22, 19);
      pdf.text(title, 105, marginMm + 11, { align: "center" });

      const svgH = 297 - marginMm * 2 - headerH - 10;

      const clone = svgEl.cloneNode(true) as SVGSVGElement;
      clone.setAttribute("width", `${contentW}mm`);
      clone.setAttribute("height", `${svgH}mm`);

      await svg2pdf(clone, pdf, {
        x: marginMm,
        y: marginMm + headerH,
        width: contentW,
        height: svgH,
      });

      pdf.setFontSize(7);
      pdf.setTextColor(160, 155, 150);
      pdf.text(
        `${dotCount} dots \u00B7 Dot-to-Dot Studio`,
        105,
        297 - marginMm + 2,
        { align: "center" },
      );

      pdf.save(`dot-to-dot-${title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setExporting(false);
    }
  }, [svgRef, title, dotCount, exporting]);

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={handleExport}
        disabled={exporting}
        className="flex items-center gap-2 rounded-xl bg-ink px-6 py-3
          font-[family-name:var(--font-display)] text-sm font-semibold text-cream tracking-wide
          hover:bg-graphite active:animate-stamp
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-150
          focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        {exporting ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
            </svg>
            Exporting&hellip;
          </>
        ) : (
          <>
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
            Download PDF
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        aria-label="Print dot-to-dot puzzle"
        className="flex items-center gap-2 rounded-xl border-2 border-wash px-5 py-3
          font-[family-name:var(--font-display)] text-sm font-semibold text-ink tracking-wide
          hover:border-graphite/30 hover:bg-cream
          transition-colors duration-150
          focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5 2.75C5 1.784 5.784 1 6.75 1h6.5c.966 0 1.75.784 1.75 1.75v3.552c.377.338.7.733.961 1.173A3.262 3.262 0 0117 7.75v5.5A2.75 2.75 0 0114.25 16h-.5v.25A2.75 2.75 0 0111 19H9a2.75 2.75 0 01-2.75-2.75V16h-.5A2.75 2.75 0 013 13.25v-5.5c0-.433.11-.855.3-1.225.261-.44.584-.835.961-1.173V2.75zM7.75 16v.25c0 .69.56 1.25 1.25 1.25h2c.69 0 1.25-.56 1.25-1.25V16h-4.5zM6.5 2.75v3h7v-3a.25.25 0 00-.25-.25h-6.5a.25.25 0 00-.25.25z" clipRule="evenodd" />
        </svg>
        Print
      </button>
    </div>
  );
}
