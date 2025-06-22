import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log("📥 Prompt masuk:", prompt);

    if (!prompt) {
      return NextResponse.json({ error: "Prompt kosong" }, { status: 400 });
    }

    const output = await replicate.run("black-forest-labs/flux-kontext-max", {
      input: { prompt },
    });

    const imageUrl = Array.isArray(output) ? output[0] : null;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Gambar tidak tersedia" },
        { status: 500 }
      );
    }

    return NextResponse.json({ image_url: imageUrl });
  } catch (err: any) {
    console.error("❌ Error:", err.message || err);
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan." },
      { status: 500 }
    );
  }
}
