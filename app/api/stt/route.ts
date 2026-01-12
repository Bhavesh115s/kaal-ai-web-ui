import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const audio = formData.get("audio")

    if (!audio || !(audio instanceof Blob)) {
      return NextResponse.json(
        { error: "No audio received" },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await audio.arrayBuffer())

    // 🛑 Guard: empty / very short audio
    if (buffer.length < 1000) {
      return NextResponse.json(
        { error: "Audio too short, please speak clearly" },
        { status: 400 }
      )
    }

    // ⏱ Timeout protection
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12000)

    let dgRes
    try {
      dgRes = await fetch(
        "https://api.deepgram.com/v1/listen?model=nova-2&language=en-IN&punctuate=true",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${process.env.DEEPGRAM_API_KEY!.trim()}`,
            "Content-Type": "audio/webm;codecs=opus",
          },
          body: buffer,
          signal: controller.signal,
        }
      )
    } catch (err: any) {
      if (err.name === "AbortError") {
        return NextResponse.json(
          { error: "STT timeout, please try again" },
          { status: 504 }
        )
      }
      throw err
    } finally {
      clearTimeout(timeout)
    }

    if (!dgRes.ok) {
      const errText = await dgRes.text()
      console.error("Deepgram error:", errText)
      return NextResponse.json(
        { error: "Speech recognition failed" },
        { status: 500 }
      )
    }

    const dgData = await dgRes.json()

    const text =
      dgData?.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim() || ""

    if (!text) {
      return NextResponse.json(
        { error: "Could not understand speech" },
        { status: 200 }
      )
    }

    return NextResponse.json({ text })
  } catch (err) {
    console.error("STT crash:", err)
    return NextResponse.json(
      { error: "STT service crashed" },
      { status: 500 }
    )
  }
}
