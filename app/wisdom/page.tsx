"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"

type WisdomData = {
  id: number
  shloka: string
  transliteration: string
  meaning: string
  guidance: string
}

export default function WisdomPage() {
  const [wisdom, setWisdom] = useState<WisdomData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWisdom()
  }, [])

  const fetchWisdom = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/wisdom")
      if (!response.ok) throw new Error("Failed to fetch wisdom")
      const data = await response.json()
      setWisdom(data)
    } catch (error) {
      console.error("[v0] Wisdom API error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="bg-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              Daily Wisdom
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Ancient Wisdom</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Timeless teachings from the Bhagavad Gita, presented with care for the modern mind
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : wisdom ? (
            <>
              {/* Daily Shloka Card */}
              <Card className="mb-12 overflow-hidden border-0 shadow-xl">
                <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-background p-8 md:p-12">
                  <div className="mb-6 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">Today's Shloka</h2>
                  </div>

                  {/* Sanskrit */}
                  <div className="mb-6 rounded-lg border border-border bg-card p-6">
                    <p className="mb-2 text-xs font-semibold text-primary">Sanskrit</p>
                    <blockquote className="font-serif text-xl leading-relaxed text-foreground md:text-2xl">
                      {wisdom.shloka}
                    </blockquote>
                    <p className="mt-3 text-sm text-muted-foreground">— Bhagavad Gita</p>
                  </div>

                  {/* Transliteration */}
                  <div className="mb-6 rounded-lg border border-border bg-card p-6">
                    <p className="mb-2 text-xs font-semibold text-accent">Transliteration</p>
                    <p className="italic leading-relaxed text-muted-foreground">{wisdom.transliteration}</p>
                  </div>

                  {/* Meaning */}
                  <div className="mb-6 rounded-lg border border-border bg-card p-6">
                    <p className="mb-2 text-xs font-semibold text-primary">Meaning</p>
                    <p className="leading-relaxed text-foreground">{wisdom.meaning}</p>
                  </div>

                  {/* Guidance */}
                  <div className="rounded-lg border border-border bg-card p-6">
                    <p className="mb-2 text-xs font-semibold text-accent">Practical Guidance</p>
                    <p className="leading-relaxed text-muted-foreground">{wisdom.guidance}</p>
                  </div>
                </div>
              </Card>

              {/* CTA Section */}
              <Card className="border-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background shadow-xl">
                <CardContent className="p-8 text-center md:p-12">
                  <h2 className="mb-4 text-2xl font-bold md:text-3xl">Want Personal Guidance?</h2>
                  <p className="mb-6 text-lg text-muted-foreground">
                    Talk to KAAL AI for reflective conversation tailored to your situation
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Button asChild size="lg" className="shadow-lg">
                      <Link href="/chat">Start Conversation</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="border-2 bg-transparent">
                      <Link href="/assessment">Take Self Reflection</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12 text-center">
                <p className="text-lg text-muted-foreground">Unable to load wisdom. Please try again later.</p>
                <Button onClick={fetchWisdom} className="mt-4">
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
