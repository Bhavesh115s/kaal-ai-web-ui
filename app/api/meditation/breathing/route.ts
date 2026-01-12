import { NextResponse } from "next/server"
import mockData from "@/data/mock-meditation.json"

export async function GET() {
  try {
    // Return normal mode as default
    const normalMode = mockData.modes.find((mode) => mode.name === "Normal")
    return NextResponse.json(normalMode)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch breathing settings" }, { status: 500 })
  }
}
