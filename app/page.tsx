import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { MessageCircle, Sparkles, Brain } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Guidance for the Modern Mind
            </h1>
            <p className="mb-8 text-pretty text-xl leading-relaxed text-muted-foreground md:text-2xl">
              KAAL AI helps young minds navigate stress, confusion, and emotional overload through timeless wisdom from
              the Bhagavad Gita — presented responsibly, clearly, and compassionately.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="text-base shadow-lg hover:shadow-xl transition-all">
                <Link href="/chat">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start Conversation
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base border-2 bg-transparent">
                <Link href="/meditation">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Explore Meditation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <Card className="text-center border-0 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="mb-4 inline-block rounded-full bg-primary/10 p-4">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Ancient Insight</h3>
                <p className="leading-relaxed text-muted-foreground">Rooted in Bhagavad Gita wisdom</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="mb-4 inline-block rounded-full bg-accent/10 p-4">
                  <Brain className="h-10 w-10 text-accent" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Human-First AI</h3>
                <p className="leading-relaxed text-muted-foreground">Calm, ethical, non-judgmental responses</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="mb-4 inline-block rounded-full bg-primary/10 p-4">
                  <MessageCircle className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Safe & Private</h3>
                <p className="leading-relaxed text-muted-foreground">No manipulation, no dependency design</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 text-xl font-bold">
              <span className="text-2xl">ॐ</span>
              <span>
                <span className="font-bold">KAAL</span> <span className="font-normal">AI</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 KAAL AI. Guidance for the Modern Mind, Rooted in Timeless Wisdom.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
