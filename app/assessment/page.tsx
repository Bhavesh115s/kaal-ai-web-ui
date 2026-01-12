"use client"
import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, MessageCircle, Sparkles, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

type Question = {
  id: number
  question: string
  options: { text: string; score: number }[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "How often do you feel overwhelmed by daily tasks?",
    options: [
      { text: "Rarely or never", score: 0 },
      { text: "Occasionally", score: 1 },
      { text: "Frequently", score: 2 },
      { text: "Almost always", score: 3 },
    ],
  },
  {
    id: 2,
    question: "How well are you sleeping at night?",
    options: [
      { text: "Very well, consistent sleep", score: 0 },
      { text: "Fairly well, some interruptions", score: 1 },
      { text: "Poorly, frequent wake-ups", score: 2 },
      { text: "Very poorly, chronic insomnia", score: 3 },
    ],
  },
  {
    id: 3,
    question: "Do you find it difficult to concentrate or make decisions?",
    options: [
      { text: "No, I can focus easily", score: 0 },
      { text: "Sometimes it's challenging", score: 1 },
      { text: "Often struggle with focus", score: 2 },
      { text: "Constantly find it very difficult", score: 3 },
    ],
  },
  {
    id: 4,
    question: "How frequently do you experience anxiety or worry?",
    options: [
      { text: "Rarely feel anxious", score: 0 },
      { text: "Sometimes feel worried", score: 1 },
      { text: "Often feel anxious", score: 2 },
      { text: "Constant anxiety", score: 3 },
    ],
  },
  {
    id: 5,
    question: "How would you rate your energy levels throughout the day?",
    options: [
      { text: "High energy, feeling great", score: 0 },
      { text: "Moderate energy", score: 1 },
      { text: "Low energy, often tired", score: 2 },
      { text: "Exhausted most of the time", score: 3 },
    ],
  },
  {
    id: 6,
    question: "Do you feel disconnected from friends or loved ones?",
    options: [
      { text: "No, I feel connected", score: 0 },
      { text: "Occasionally feel distant", score: 1 },
      { text: "Often feel isolated", score: 2 },
      { text: "Very disconnected", score: 3 },
    ],
  },
  {
    id: 7,
    question: "How often do you engage in activities you enjoy?",
    options: [
      { text: "Regularly, several times a week", score: 0 },
      { text: "Occasionally, when I have time", score: 1 },
      { text: "Rarely, hard to find motivation", score: 2 },
      { text: "Never, lost interest", score: 3 },
    ],
  },
  {
    id: 8,
    question: "How do you feel about your future?",
    options: [
      { text: "Optimistic and hopeful", score: 0 },
      { text: "Somewhat positive", score: 1 },
      { text: "Uncertain or worried", score: 2 },
      { text: "Pessimistic or hopeless", score: 3 },
    ],
  },
]

export default function AssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<{ level: string; score: number; suggestion: string } | null>(null)

  const progress = ((currentQuestion + (answers[currentQuestion] !== undefined ? 1 : 0)) / questions.length) * 100

  const handleAnswer = async (score: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = score
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 300)
    } else {
      try {
        const response = await fetch("/api/assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: newAnswers }),
        })

        if (response.ok) {
          const data = await response.json()
          setResults(data)
        }
      } catch (error) {
        console.error("[v0] Assessment API error:", error)
      } finally {
        setTimeout(() => {
          setShowResults(true)
        }, 300)
      }
    }
  }

  const getStressLevel = () => {
    if (!results) {
      const totalScore = answers.reduce((sum, score) => sum + score, 0)
      const percentage = (totalScore / (questions.length * 3)) * 100

      if (percentage <= 30)
        return { level: "Low", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" }
      if (percentage <= 60)
        return {
          level: "Moderate",
          color: "text-primary",
          bgColor: "bg-primary/10",
          borderColor: "border-primary/30",
        }
      return { level: "High", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" }
    }

    if (results.level === "Calm")
      return { level: "Low", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" }
    if (results.level === "Moderate Stress")
      return {
        level: "Moderate",
        color: "text-primary",
        bgColor: "bg-primary/10",
        borderColor: "border-primary/30",
      }
    return { level: "High", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setResults(null)
  }

  if (showResults) {
    const stressLevel = getStressLevel()
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="bg-gradient-to-br from-secondary/30 via-background to-accent/5 py-12 md:py-20">
          <div className="container mx-auto max-w-3xl px-4">
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className={cn("rounded-full p-4", stressLevel.bgColor)}>
                    {stressLevel.level === "Low" ? (
                      <CheckCircle className={cn("h-12 w-12", stressLevel.color)} />
                    ) : (
                      <AlertCircle className={cn("h-12 w-12", stressLevel.color)} />
                    )}
                  </div>
                </div>
                <CardTitle className="text-3xl">Your Self Reflection</CardTitle>
                <CardDescription className="text-base">Based on your responses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className={cn("rounded-lg border-2 p-6 text-center", stressLevel.borderColor, stressLevel.bgColor)}
                >
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Current Stress Level</p>
                  <p className={cn("text-4xl font-bold", stressLevel.color)}>{stressLevel.level}</p>
                  {results && <p className="mt-2 text-sm text-muted-foreground">Clarity Score: {results.score}%</p>}
                </div>

                <div className="space-y-4">
                  <p className="leading-relaxed text-muted-foreground">
                    {results?.suggestion ||
                      "Consider exploring our resources and talking to KAAL AI for personalized guidance."}
                  </p>

                  {stressLevel.level === "High" && (
                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                      <p className="text-sm leading-relaxed text-foreground">
                        Based on your responses, speaking with a professional may help. Our licensed psychologists are
                        available for online consultations.
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Button asChild size="lg" className="w-full">
                    <Link href="/chat">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Talk to KAAL AI
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full border-2 bg-transparent">
                    <Link href="/meditation">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Try Meditation
                    </Link>
                  </Button>
                </div>

                {stressLevel.level === "High" && (
                  <Button asChild variant="outline" size="lg" className="w-full border-2 border-primary bg-transparent">
                    <Link href="/psychologist">
                      <Phone className="mr-2 h-5 w-5" />
                      Consult a Psychologist
                    </Link>
                  </Button>
                )}

                <div className="pt-4 text-center">
                  <Button variant="ghost" onClick={resetQuiz}>
                    Retake Assessment
                  </Button>
                </div>

                <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                  <p className="font-medium">Note:</p>
                  <p className="mt-1 leading-relaxed">
                    This is a self-reflection tool, not a medical diagnosis. For professional support, please consult a
                    licensed mental health professional.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="bg-gradient-to-br from-secondary/30 via-background to-accent/5 py-12 md:py-20">
        <div className="container mx-auto max-w-3xl px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              Self Reflection
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Assess Your Mental Clarity</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Answer 8 questions honestly to understand your current stress and clarity levels
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl leading-relaxed">{questions[currentQuestion].question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.score)}
                  className={cn(
                    "w-full rounded-full border-2 px-6 py-4 text-left transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md",
                    answers[currentQuestion] === option.score && "border-primary bg-primary/10 shadow-md",
                  )}
                >
                  <span className="leading-relaxed font-medium">{option.text}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Navigation */}
          {currentQuestion > 0 && (
            <div className="mt-6 text-center">
              <Button variant="ghost" onClick={() => setCurrentQuestion(currentQuestion - 1)}>
                Previous Question
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
