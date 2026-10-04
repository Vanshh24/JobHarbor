import { apiBaseUrl } from "../../config.js";

const API_URL = `${apiBaseUrl}/assistant/chat`;

export const n8nModelAdapter = (sessionId) => ({
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
        break
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) {
          continue;
        }

        const event = JSON.parse(trimmed.slice(6));

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
      }
    }
  },
});