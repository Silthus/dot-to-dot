import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

const LINE_ART_PREFIX =
  "Generate a clean black and white line art drawing of";
const LINE_ART_SUFFIX =
  "Simple continuous outlines on pure white background. No shading, no gradients, no fills, no colors. Only black outlines on white. Suitable for a children's connect-the-dots puzzle.";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "A prompt is required" },
        { status: 400 },
      );
    }

    const fullPrompt = `${LINE_ART_PREFIX} ${prompt.trim()}. ${LINE_ART_SUFFIX}`;

    const results = await Promise.allSettled(
      Array.from({ length: 3 }, () =>
        generateText({
          model: google("gemini-2.5-flash-preview-05-20"),
          prompt: fullPrompt,
          providerOptions: {
            google: {
              responseModalities: ["TEXT", "IMAGE"],
            },
          },
        }),
      ),
    );

    const images: string[] = [];

    for (const result of results) {
      if (result.status === "fulfilled") {
        const imageFile = result.value.files?.find((f) =>
          f.mediaType?.startsWith("image/"),
        );
        if (imageFile) {
          images.push(imageFile.base64);
        }
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate any images. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 },
    );
  }
}
