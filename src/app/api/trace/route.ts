import { NextRequest, NextResponse } from "next/server";
import { parsePotraceSvg } from "@/lib/svg-parser";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const potrace = require("potrace");

function traceImage(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    potrace.trace(
      buffer,
      {
        threshold: 128,
        color: "#000000",
        background: "transparent",
        optCurve: true,
        turdSize: 5,
      },
      (err: Error | null, svg: string) => {
        if (err) reject(err);
        else resolve(svg);
      },
    );
  });
}

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "A base64 image is required" },
        { status: 400 },
      );
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const svgString = await traceImage(buffer);
    const { paths, viewBox, width, height } = parsePotraceSvg(svgString);

    if (paths.length === 0) {
      return NextResponse.json(
        { error: "No paths could be traced from this image" },
        { status: 422 },
      );
    }

    return NextResponse.json({ paths, viewBox, width, height });
  } catch (error) {
    console.error("Trace error:", error);
    return NextResponse.json(
      { error: "Image tracing failed" },
      { status: 500 },
    );
  }
}
