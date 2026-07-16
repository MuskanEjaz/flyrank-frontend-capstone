import { Anthropic } from "@anthropic-ai/sdk";
import { AI_CONFIG } from "../../../lib/ai-config";

export const runtime = "nodejs";

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Anthropic({ apiKey });
}

function createDemoResponse(message: string) {
  const normalized = message.trim().toLowerCase();
  const intent = normalized.includes("roadmap")
    ? "roadmap"
    : normalized.includes("launch")
      ? "launch"
      : normalized.includes("design")
        ? "design"
        : normalized.includes("priority")
          ? "priority"
          : "delivery";

  const snippets = {
    roadmap: "A focused roadmap keeps scope visible, introduces a short review loop, and protects the team from drift.",
    launch: "A launch-ready plan should sequence validation, launch messaging, and handoff so the rollout feels calm and coordinated.",
    design: "A strong design checkpoint makes the experience feel consistent while keeping implementation effort predictable.",
    priority: "The best next step is to choose one decision-maker, one clear outcome, and one follow-up checkpoint.",
    delivery: "A steady delivery rhythm works best when the team shares one visible plan, one owner, and one review point.",
  } as const;

  return `Demo streaming mode: ${snippets[intent]} This response is generated locally so the chat experience stays interactive even without a Claude API key.`;
}

function createEventStream(text: string) {
  const words = text.split(/(\s+)/);
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const word of words) {
        if (word.length === 0) {
          continue;
        }

        const chunk = `data: ${JSON.stringify({ type: "delta", text: word })}\n\n`;
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 35));
      }

      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
      controller.close();
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find((message: { role?: string; content?: string }) => message.role === "user" && typeof message.content === "string");

    if (!lastUserMessage?.content) {
      return Response.json({ error: "No user message provided." }, { status: 400 });
    }

    const client = getAnthropicClient();

    if (!client) {
      const demoText = createDemoResponse(lastUserMessage.content);
      return new Response(createEventStream(demoText), {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "x-chat-mode": "demo",
        },
      });
    }

    const response = await client.messages.create({
      model: AI_CONFIG.model,
      max_tokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature,
      system: AI_CONFIG.systemPrompt,
      messages: messages.map((message: { role?: string; content?: string }) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: message.content ?? "",
      })),
      stream: true,
    });

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const encoder = new TextEncoder();

        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
            const chunk = `data: ${JSON.stringify({ type: "delta", text: event.delta.text })}\n\n`;
            controller.enqueue(encoder.encode(chunk));
          }

          if (event.type === "message_stop") {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
            controller.close();
            return;
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "x-chat-mode": "claude",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
