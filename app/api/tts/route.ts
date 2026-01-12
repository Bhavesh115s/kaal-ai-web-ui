import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json({ error: "No text" }, { status: 400 })
    }

    const dgRes = await fetch(
      "https://api.deepgram.com/v1/speak?model=aura-asteria-en",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }
    )

    if (!dgRes.ok) {
      const err = await dgRes.text()
      console.error("TTS error:", err)
      return NextResponse.json({ error: "TTS failed" }, { status: 500 })
    }

    const audioBuffer = await dgRes.arrayBuffer()

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    })
  } catch (err) {
    console.error("TTS crash:", err)
    return NextResponse.json({ error: "TTS crashed" }, { status: 500 })
  }
}
