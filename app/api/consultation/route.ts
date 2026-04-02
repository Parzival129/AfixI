import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/gemini/client";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/gemini/prompts";
import { ConsultationResultSchema } from "@/lib/gemini/types";
import type { ConsultationRequest } from "@/types/consultation";

export async function POST(request: Request) {
  try {
    const body: ConsultationRequest = await request.json();

    const openai = getOpenAIClient();
    const userPrompt = buildUserPrompt(body);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const text = completion.choices[0]?.message?.content ?? "";

    const parsed = JSON.parse(text);
    const validated = ConsultationResultSchema.parse(parsed);

    return NextResponse.json(validated);
  } catch (err) {
    console.error("Consultation API error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to generate consultation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
