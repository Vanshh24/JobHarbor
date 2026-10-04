import readNDJSONStream from 'ndjson-readablestream'

export const chat = async (req, res) => {
    console.log("========== BACKEND REQUEST ==========");
    console.log("BODY:", req.body);
    console.log("FETCHING N8N...");

    const n8nResponse = await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
    })

    console.log("N8N FETCH RESOLVED");
    console.log("STATUS:", n8nResponse.status);
    console.log("CONTENT-TYPE:", n8nResponse.headers.get("content-type"));
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    console.log("STARTING NDJSON READER...");
    for await (const event of readNDJSONStream(n8nResponse.body)) {
        console.log("N8N EVENT:", event);

        if (event.type === 'item') {
            res.write(`data: ${JSON.stringify({ type: 'item', content: event.content })}\n\n`)
        }
    }
    console.log("NDJSON LOOP ENDED");
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
    res.end()
}