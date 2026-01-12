import { type NextRequest, NextResponse } from "next/server"
import mockData from "@/data/mock-chat.json"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Mock response - in production, this would call your AI service
    const response = mockData.responses[0]

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
