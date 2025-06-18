// route.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages; // expecting array of messages

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Invalid or empty messages array." },
        { status: 400 }
      );
    }

    // Validate each message has string content
    for (const msg of messages) {
      if (typeof msg.content !== "string") {
        return Response.json(
          { error: "Invalid value for 'content': expected a string." },
          { status: 400 }
        );
      }
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const reply = completion.choices[0].message.content;
    return Response.json({ response: reply });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("[route.ts] ERROR:", error.message);
    }
  }
}
