import { NextResponse } from "next/server"
import mockData from "@/data/mock-events.json"

export async function GET() {
  try {
    return NextResponse.json({ events: mockData.events })
  } catch (error) {
    console.error("[v0] Events API error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
