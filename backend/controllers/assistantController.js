export const chat = async (req, res) => {
    try {
        const { sessionId, chatInput } = req.body;

        const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

        if (!sessionId) {
            return res.status(400).json({
                error: "sessionId is required",
            });
        }

        if (!chatInput) {
            return res.status(400).json({
                error: "chatInput is required",
            });
        }

        if (!N8N_WEBHOOK_URL) {
            return res.status(500).json({
                error: "N8N_WEBHOOK_URL is not configured",
            });
        }

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sessionId,
                chatInput,
            }),
        });

        if (!response.ok || !response.body) {
            const errorText = await response.text();

            console.error("n8n error:", errorText);

            return res.status(response.status || 500).json({
                error: "n8n request failed",
            });
        }

        res.status(200);

        res.setHeader(
            "Content-Type",
            response.headers.get("content-type") ||
            "text/event-stream; charset=utf-8"
        );

        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const reader = response.body.getReader();

        try {
            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                res.write(Buffer.from(value));
            }
        } finally {
            reader.releaseLock();
        }

        res.end();

    } catch (error) {
        console.error("Assistant error:", error);

        if (!res.headersSent) {
            res.status(500).json({
                error: "Failed to process assistant request",
            });
        } else {
            res.end();
        }
    }
};