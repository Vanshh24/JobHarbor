import readNDJSONStream from 'ndjson-readablestream'

export const chat = async (req, res) => {
    const n8nResponse = await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
    })
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    for await (const event of readNDJSONStream(n8nResponse.body)) {
        if (event.type === 'item') {
            res.write(`data: ${JSON.stringify({ type: 'item', content: event.content })}\n\n`)
        }
    }
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
    res.end()
}