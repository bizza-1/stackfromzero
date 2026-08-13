import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 12 * 1024 * 1024;

export async function POST(request: Request) {
  const apiKey = process.env.REMOVEBG_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Background removal is not configured yet." },
      { status: 503 }
    );
  }

  try {
    const data = await request.formData();
    const image = data.get("image");
    if (!(image instanceof File) || !image.type.startsWith("image/")) {
      return NextResponse.json({ error: "Please upload a valid image." }, { status: 400 });
    }
    if (image.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Please choose an image smaller than 12 MB." }, { status: 413 });
    }

    const upstream = new FormData();
    upstream.append("image_file", image, image.name);
    upstream.append("size", "auto");
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": apiKey },
      body: upstream,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null) as { errors?: { title?: string }[] } | null;
      const message = body?.errors?.[0]?.title;
      return NextResponse.json(
        { error: message || "Background removal failed. Please try another image." },
        { status: response.status === 402 ? 429 : 502 }
      );
    }

    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="background-removed.png"',
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not process that image. Please try again." },
      { status: 500 }
    );
  }
}
