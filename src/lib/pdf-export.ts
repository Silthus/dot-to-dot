import jsPDF from "jspdf";
import "svg2pdf.js";

export async function exportToPDF(
  dotsSvgElement: SVGSVGElement,
  templateName: string,
  dotCount: number,
  solutionSvgContent?: string,
): Promise<void> {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const headerHeight = 20;
  const contentHeight = pageHeight - margin * 2 - headerHeight;

  pdf.setFontSize(18);
  pdf.text(templateName, pageWidth / 2, margin + 5, { align: "center" });
  pdf.setFontSize(10);
  pdf.text(`${dotCount} Punkte`, pageWidth / 2, margin + 12, {
    align: "center",
  });

  const svgClone = dotsSvgElement.cloneNode(true) as SVGSVGElement;
  await pdf.svg(svgClone, {
    x: margin,
    y: margin + headerHeight,
    width: contentWidth,
    height: contentHeight,
  });

  if (solutionSvgContent) {
    pdf.addPage();
    pdf.setFontSize(14);
    pdf.text("Loesung", pageWidth / 2, margin + 5, { align: "center" });

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = solutionSvgContent;
    const solutionSvg = tempDiv.querySelector("svg");
    if (solutionSvg) {
      await pdf.svg(solutionSvg, {
        x: margin,
        y: margin + headerHeight,
        width: contentWidth,
        height: contentHeight,
      });
    }
  }

  pdf.save(
    `${templateName.toLowerCase().replace(/\s+/g, "-")}-punkt-zu-punkt.pdf`,
  );
}
