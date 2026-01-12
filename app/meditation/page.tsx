"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Sunrise, Brain, Moon, HeartPulse, Sparkles, Focus } from "lucide-react"
import { cn } from "@/lib/utils"

type BreathingMode = {
  name: string
  inhale: number
  hold: number
  exhale: number
  description: string
}

type BreathingPhase = "inhale" | "hold" | "exhale"

const BREATHING_MODES: BreathingMode[] = [
  { name: "Beginner", inhale: 4, hold: 4, exhale: 4, description: "Perfect for starting your practice" },
  { name: "Normal", inhale: 4, hold: 4, exhale: 6, description: "Balanced breathing for daily practice" },
  { name: "Deep", inhale: 5, hold: 5, exhale: 8, description: "Extended breathing for deep relaxation" },
]

const GUIDANCE_TEXTS = [
  "Let your shoulders relax.",
  "Allow thoughts to pass without judgment.",
  "Bring attention back to your breath.",
  "Feel the tension leaving your body.",
  "Notice the rhythm of your breathing.",
  "You are safe in this moment.",
]

const GUIDED_MEDITATIONS = [
  {
    id: 1,
    title: "Morning Energy",
    description: "Start your day with positive intentions and clarity",
    duration: "10 min",
    category: "Morning",
    icon: Sunrise,
    color: "from-orange-500/20 to-yellow-500/20",
  },
  {
    id: 2,
    title: "Stress Relief",
    description: "Release tension and find inner peace",
    duration: "15 min",
    category: "Relaxation",
    icon: HeartPulse,
    color: "from-teal-500/20 to-green-500/20",
  },
  {
    id: 3,
    title: "Focus & Concentration",
    description: "Enhance mental clarity and productivity",
    duration: "12 min",
    category: "Focus",
    icon: Brain,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: 4,
    title: "Deep Sleep",
    description: "Gentle relaxation for restful sleep",
    duration: "20 min",
    category: "Sleep",
    icon: Moon,
    color: "from-indigo-500/20 to-purple-500/20",
  },
  {
    id: 5,
    title: "Anxiety Release",
    description: "Calm your nervous system naturally",
    duration: "15 min",
    category: "Healing",
    icon: Sparkles,
    color: "from-pink-500/20 to-rose-500/20",
  },
  {
    id: 6,
    title: "Mindful Awareness",
    description: "Cultivate presence and self-awareness",
    duration: "10 min",
    category: "Mindfulness",
    icon: Focus,
    color: "from-emerald-500/20 to-teal-500/20",
  },
]

export default function MeditationPage() {
  const [selectedMode, setSelectedMode] = useState<BreathingMode>(BREATHING_MODES[1]) // Default to Normal
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("inhale")
  const [phaseProgress, setPhaseProgress] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [currentGuidanceIndex, setCurrentGuidanceIndex] = useState(0)
  const [sessionComplete, setSessionComplete] = useState(false)
  const animationFrameRef = useRef<number>()
  const lastUpdateRef = useRef<number>(Date.now())

  useEffect(() => {
    if (!isActive) return

    const animate = () => {
      const now = Date.now()
      const deltaTime = (now - lastUpdateRef.current) / 1000 // Convert to seconds
      lastUpdateRef.current = now

      setPhaseProgress((prev) => {
        const phaseDuration =
          currentPhase === "inhale"
            ? selectedMode.inhale
            : currentPhase === "hold"
              ? selectedMode.hold
              : selectedMode.exhale

        const newProgress = prev + deltaTime / phaseDuration

        if (newProgress >= 1) {
          // Move to next phase
          if (currentPhase === "inhale") {
            setCurrentPhase("hold")
          } else if (currentPhase === "hold") {
            setCurrentPhase("exhale")
          } else {
            // Complete cycle
            setCurrentPhase("inhale")
            setCycleCount((c) => c + 1)
            setCurrentGuidanceIndex((i) => (i + 1) % GUIDANCE_TEXTS.length)

            // Complete session after 5 cycles (about 2-3 minutes)
            if (cycleCount >= 4) {
              setIsActive(false)
              setSessionComplete(true)
              return 0
            }
          }
          return 0
        }

        return newProgress
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    lastUpdateRef.current = Date.now()
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isActive, currentPhase, selectedMode, cycleCount])

  const handleStart = () => {
    setIsActive(true)
    setSessionComplete(false)
    lastUpdateRef.current = Date.now()
  }

  const handlePause = () => {
    setIsActive(false)
  }

  const handleRestart = () => {
    setIsActive(false)
    setCurrentPhase("inhale")
    setPhaseProgress(0)
    setCycleCount(0)
    setCurrentGuidanceIndex(0)
    setSessionComplete(false)
  }

  const getCircleScale = () => {
    if (currentPhase === "inhale") {
      return 0.6 + phaseProgress * 0.4 // Scale from 0.6 to 1.0
    } else if (currentPhase === "hold") {
      return 1.0 // Stay at full size
    } else {
      return 1.0 - phaseProgress * 0.4 // Scale from 1.0 to 0.6
    }
  }

  const getPhaseText = () => {
    return currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl text-balance text-foreground">
              Guided Meditation
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70 leading-relaxed">
              Simple breathing techniques to calm your mind
            </p>
          </div>

          {sessionComplete ? (
            <Card className="border-2 border-border/40 shadow-2xl mb-8">
              <CardContent className="p-12 text-center">
                <div className="mb-6 text-6xl">✨</div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">Your mind is calmer now.</h2>
                <p className="mb-8 text-foreground/70 leading-relaxed">
                  You've completed a full breathing session. Notice how your body feels.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="shadow-md">
                    <Link href="/chat">Talk to काल AI</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-2 font-semibold bg-transparent">
                    <Link href="/wisdom">Explore Gita Wisdom</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-2 font-semibold bg-transparent">
                    <Link href="/assessment">Take Reflection Assessment</Link>
                  </Button>
                </div>
                <Button variant="ghost" onClick={handleRestart} className="mt-6 font-medium">
                  Start Another Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Mode Selection */}
              <div className="mb-8 flex flex-wrap justify-center gap-3">
                {BREATHING_MODES.map((mode) => (
                  <button
                    key={mode.name}
                    onClick={() => {
                      setSelectedMode(mode)
                      handleRestart()
                    }}
                    className={cn(
                      "px-6 py-3 rounded-lg font-semibold transition-all border-2",
                      selectedMode.name === mode.name
                        ? "bg-primary text-primary-foreground shadow-lg border-primary"
                        : "bg-card hover:bg-muted border-border/60 hover:border-border",
                    )}
                  >
                    <div className="text-sm font-bold">{mode.name}</div>
                    <div className="text-xs opacity-80">
                      {mode.inhale}-{mode.hold}-{mode.exhale}
                    </div>
                  </button>
                ))}
              </div>

              {/* Breathing Circle */}
              <Card className="border-2 border-border/40 shadow-2xl mb-8">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col items-center">
                    {/* Animated Circle */}
                    <div className="relative mb-12" style={{ width: 320, height: 320 }}>
                      <div
                        className={cn(
                          "absolute inset-0 rounded-full transition-all duration-300",
                          "bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20",
                          isActive && "motion-safe:animate-pulse",
                        )}
                        style={{
                          transform: `scale(${getCircleScale()})`,
                          boxShadow: `0 0 ${40 + getCircleScale() * 40}px rgba(249, 115, 22, 0.3), 0 0 ${20 + getCircleScale() * 20}px rgba(15, 118, 110, 0.2)`,
                          transition: "transform 0.3s ease-out, box-shadow 0.3s ease-out",
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl md:text-5xl font-bold mb-2 text-foreground">{getPhaseText()}</div>
                          <div className="text-sm text-foreground/60">Cycle {cycleCount + 1} of 5</div>
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-4 mb-8">
                      {!isActive ? (
                        <Button onClick={handleStart} size="lg" className="gap-2 shadow-md font-semibold">
                          <Play className="h-5 w-5" />
                          Start
                        </Button>
                      ) : (
                        <Button
                          onClick={handlePause}
                          size="lg"
                          variant="outline"
                          className="gap-2 border-2 font-semibold bg-transparent"
                        >
                          <Pause className="h-5 w-5" />
                          Pause
                        </Button>
                      )}
                      <Button
                        onClick={handleRestart}
                        size="lg"
                        variant="outline"
                        className="gap-2 border-2 font-semibold bg-transparent"
                      >
                        <RotateCcw className="h-5 w-5" />
                        Restart
                      </Button>
                    </div>

                    {/* Guidance Text */}
                    <div className="text-center max-w-md">
                      <p className="text-lg text-foreground/70 leading-relaxed motion-safe:transition-opacity">
                        {GUIDANCE_TEXTS[currentGuidanceIndex]}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="border-2 border-accent/20 bg-accent/5 mb-12">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2 text-foreground">How it works:</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Follow the expanding and contracting circle. Breathe in as it grows, hold as it stays steady, and
                    breathe out as it shrinks. Complete 5 cycles for a full session. This practice activates your
                    parasympathetic nervous system, reducing stress and promoting calm.
                  </p>
                </CardContent>
              </Card>

              {/* Guided Meditations Section */}
              <div className="mt-16">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold mb-3 text-foreground">Guided Meditations</h2>
                  <p className="text-foreground/70 max-w-2xl mx-auto">
                    Explore curated meditation sessions for different needs and moments
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {GUIDED_MEDITATIONS.map((meditation) => {
                    const Icon = meditation.icon
                    return (
                      <Card
                        key={meditation.id}
                        className="border-2 border-border/40 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer group"
                      >
                        <CardContent className="p-6">
                          <div
                            className={cn(
                              "w-14 h-14 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br",
                              meditation.color,
                            )}
                          >
                            <Icon className="h-7 w-7 text-foreground" />
                          </div>

                          <div className="mb-3">
                            <h3 className="text-lg font-bold mb-1 text-foreground group-hover:text-primary transition-colors">
                              {meditation.title}
                            </h3>
                            <p className="text-sm text-foreground/60 leading-relaxed">{meditation.description}</p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-border/40">
                            <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                              {meditation.category}
                            </span>
                            <span className="text-sm font-medium text-primary">{meditation.duration}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
