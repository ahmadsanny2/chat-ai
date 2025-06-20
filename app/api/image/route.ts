import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "512x512",
      }),
    });

    const data = await response.json();

    console.log("🧪 Hasil response dari OpenAI:", data); // ⬅️ PENTING

    // Jika tidak ada URL dari OpenAI
    if (!response.ok || !data?.data?.[0]?.url) {
      return NextResponse.json(
        { error: "Image URL not found", response: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ image_url: data.data[0].url });
  } catch (error: unknown) {
    console.error("❌ ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
