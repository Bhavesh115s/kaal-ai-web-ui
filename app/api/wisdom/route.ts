import { NextResponse } from "next/server"
import mockData from "@/data/mock-wisdom.json"

export async function GET() {
  try {
    // Return a random wisdom entry
    const randomIndex = Math.floor(Math.random() * mockData.dailyWisdom.length)
    const wisdom = mockData.dailyWisdom[randomIndex]

    return NextResponse.json(wisdom)
  } catch (error) {
    console.error("[v0] Wisdom API error:", error)
    return NextResponse.json({ error: "Failed to fetch wisdom" }, { status: 500 })
  }
}
