import { google } from "@ai-sdk/google";
import { streamText } from "ai";

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY!;
const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT!;

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
      }),
    }
  );

  const data = await response.json();
  return data.success === true;
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({
          error: "Demasiados mensajes. Intenta de nuevo en unos minutos.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages, turnstileToken } = await req.json();

    if (!turnstileToken) {
      return new Response(
        JSON.stringify({ error: "Verificación de humano requerida" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const isHuman = await verifyTurnstile(turnstileToken);
    if (!isHuman) {
      return new Response(
        JSON.stringify({ error: "Verificación fallida. ¿Eres un robot?" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = streamText({
      model: google("gemini-2.0-flash"),
      system: SYSTEM_PROMPT,
      messages,
      maxTokens: 500,
    });

    return result.toDataStreamResponse();
  } catch {
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
