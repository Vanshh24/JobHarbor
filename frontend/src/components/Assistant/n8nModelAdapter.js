import { apiBaseUrl } from "../../config.js";

const API_URL = `${apiBaseUrl}/assistant/chat`;
const sessionId = crypto.randomUUID();

export const n8nModelAdapter = {
  async *run({ messages, abortSignal }) {
    const latestUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user");

    const chatInput =
      latestUserMessage?.content
        ?.filter((part) => part.type === "text")
        ?.map((part) => part.text)
        ?.join("") || "";

    if (!chatInput) {
      throw new Error("No user message found.");
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        chatInput,
      }),
      signal: abortSignal,
    });

    if (!response.ok || !response.body) {
      throw new Error(
        `Assistant request failed: ${response.status} ${response.statusText}`,
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let accumulatedText = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, {
        stream: true,
      });

      const lines = buffer.split("\n");

      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed) {
          continue;
        }

        try {
          const event = JSON.parse(trimmed);

          if (
            event.type === "item" &&
            typeof event.content === "string"
          ) {
            accumulatedText += event.content;

            yield {
              content: [
                {
                  type: "text",
                  text: accumulatedText,
                },
              ],
            };
          }
        } catch (error) {
          console.warn(
            "Unable to parse n8n stream event:",
            trimmed,
          );
        }
      }
    }

    buffer += decoder.decode();

    const remaining = buffer.trim();

    if (remaining) {
      try {
        const event = JSON.parse(remaining);

        if (
          event.type === "item" &&
          typeof event.content === "string"
        ) {
          accumulatedText += event.content;

          yield {
            content: [
              {
                type: "text",
                text: accumulatedText,
              },
            ],
          };
        }
      } catch (error) {
        console.warn(
          "Unable to parse final n8n stream event:",
          remaining,
        );
      }
    }
  },
};