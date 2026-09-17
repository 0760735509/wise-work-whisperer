import { Output, streamText, NoObjectGeneratedError } from "ai";
import type { z } from "zod";

import { createLovableResponsesProvider } from "./ai-gateway.server";

const MODEL = "openai/gpt-6-astra";

export class AssistantError extends Error {}

/**
 * Runs one structured generation through the Lovable AI Gateway Responses API.
 * Always streaming on the wire (reasoning models run long), consumed server-side.
 */
export async function runStructured<T>(options: {
  schema: z.ZodType<T>;
  system: string;
  prompt: string;
}): Promise<T> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new AssistantError("AI is not configured for this project yet.");

  const provider = createLovableResponsesProvider(key);

  try {
    const result = streamText({
      model: provider.responses(MODEL),
      system: options.system,
      prompt: options.prompt,
      output: Output.object({ schema: options.schema as z.ZodType<never> }),
      providerOptions: {
        openai: {
          store: false,
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    const output = (await result.output) as T | undefined;
    if (!output) throw new AssistantError("The assistant returned an empty result. Try again.");
    return output;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      throw new AssistantError("The assistant response could not be read. Please try again.");
    }
    if (error instanceof AssistantError) throw error;
    const message = error instanceof Error ? error.message : "";
    if (/402|credit/i.test(message)) {
      throw new AssistantError("The workspace is out of AI credits. Add credits to continue.");
    }
    if (/429|rate limit/i.test(message)) {
      throw new AssistantError("Too many requests right now. Wait a moment and try again.");
    }
    throw new AssistantError(message || "The assistant is unavailable right now.");
  }
}
