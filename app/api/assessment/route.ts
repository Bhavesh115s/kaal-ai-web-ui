import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json()

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Answers array is required" }, { status: 400 })
    }

    // Calculate stress level based on answers
    const totalScore = answers.reduce((sum: number, answer: number) => sum + answer, 0)
    const avgScore = totalScore / answers.length

    let level = "Calm"
    let suggestion = "You're managing well. Keep practicing mindfulness."

    if (avgScore > 2.5) {
      level = "High Stress"
      suggestion = "Consider talking to KAAL AI for guidance and exploring stress management techniques."
    } else if (avgScore > 1.5) {
      level = "Moderate Stress"
      suggestion = "Some reflection would be helpful. Explore our wisdom section for guidance."
    }

    return NextResponse.json({
      level,
      score: Math.round(avgScore * 33.33), // Convert to 0-100 scale
      suggestion,
    })
  } catch (error) {
    console.error("[v0] Assessment API error:", error)
    return NextResponse.json({ error: "Failed to process assessment" }, { status: 500 })
  }
}
