"use client";

interface TemplatePreviewProps {
  svgContent: string;
}

export default function TemplatePreview({ svgContent }: TemplatePreviewProps) {
  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <div
        className="w-full h-full max-h-[75vh] [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-[75vh]"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
}
