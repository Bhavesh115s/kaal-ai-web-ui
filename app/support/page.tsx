"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Shield, Users, CheckCircle, IndianRupee } from "lucide-react"
import { cn } from "@/lib/utils"

type DonationTier = {
  amount: number
  label: string
  description: string
  impact: string
}

const donationTiers: DonationTier[] = [
  {
    amount: 100,
    label: "Supporter",
    description: "Help us maintain our services",
    impact: "Provides 5 AI chat sessions for those in need",
  },
  {
    amount: 500,
    label: "Advocate",
    description: "Make a meaningful difference",
    impact: "Sponsors one mental wellness workshop",
  },
  {
    amount: 1000,
    label: "Champion",
    description: "Transform lives with your generosity",
    impact: "Supports 10 people with complete wellness programs",
  },
]

export default function SupportPage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(500)
  const [customAmount, setCustomAmount] = useState<string>("")

  const handleDonation = () => {
    const amount = customAmount ? Number.parseFloat(customAmount) : selectedAmount
    alert(`Thank you for your donation of ₹${amount}! (This is a demo - no actual payment will be processed)`)
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="bg-gradient-to-br from-secondary/30 via-background to-accent/5 py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              Support Our Mission
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">Make Mental Wellness Accessible</h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed">
              KAAL AI is dedicated to providing compassionate mental health support to everyone, regardless of their
              ability to pay. Your donation helps us continue offering free AI-powered counseling, meditation resources,
              and wellness programs to those who need it most.
            </p>
          </div>

          {/* Impact Section */}
          <div className="mb-16">
            <h2 className="mb-8 text-center text-2xl font-bold">Our Impact</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <ImpactCard
                icon={<Users className="h-8 w-8 text-primary" />}
                number="10,000+"
                label="People Helped"
                description="Individuals supported through our free services"
              />
              <ImpactCard
                icon={<Heart className="h-8 w-8 text-accent" />}
                number="25,000+"
                label="Chat Sessions"
                description="Compassionate AI conversations provided"
              />
              <ImpactCard
                icon={<Shield className="h-8 w-8 text-primary" />}
                number="100%"
                label="Free Access"
                description="No one turned away due to inability to pay"
              />
            </div>
          </div>

          {/* Donation Section */}
          <div className="mx-auto max-w-3xl">
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Choose Your Donation</CardTitle>
                <CardDescription>Every contribution helps us support those in need</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Donation Tiers */}
                <div className="grid gap-4 md:grid-cols-3">
                  {donationTiers.map((tier) => (
                    <button
                      key={tier.amount}
                      onClick={() => {
                        setSelectedAmount(tier.amount)
                        setCustomAmount("")
                      }}
                      className={cn(
                        "rounded-lg border-2 p-4 text-left transition-all hover:border-primary hover:shadow-md",
                        selectedAmount === tier.amount && !customAmount && "border-primary bg-primary/5 shadow-md",
                      )}
                    >
                      <div className="mb-2 flex items-baseline gap-1">
                        <IndianRupee className="h-5 w-5" />
                        <span className="text-2xl font-bold">{tier.amount}</span>
                      </div>
                      <p className="mb-1 font-semibold text-primary">{tier.label}</p>
                      <p className="mb-2 text-sm text-muted-foreground">{tier.description}</p>
                      <div className="mt-3 flex items-start gap-2 rounded-md bg-secondary/50 p-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                        <p className="text-xs leading-relaxed text-muted-foreground">{tier.impact}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div>
                  <label htmlFor="custom-amount" className="mb-2 block text-sm font-medium">
                    Or enter a custom amount
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="custom-amount"
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full rounded-lg border-2 border-input bg-background py-3 pl-10 pr-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Donate Button */}
                <Button onClick={handleDonation} size="lg" className="w-full text-base shadow-lg hover:shadow-xl">
                  <Heart className="mr-2 h-5 w-5" />
                  Donate {customAmount ? `₹${customAmount}` : `₹${selectedAmount}`}
                </Button>

                {/* Trust Badges */}
                <div className="rounded-lg bg-secondary/30 p-6">
                  <p className="mb-4 text-center text-sm font-semibold">Your donation is secure and trusted</p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-accent" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span>Tax Deductible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-accent" />
                      <span>100% Impact</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mission Statement */}
          <div className="mt-16">
            <Card className="border-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="mx-auto max-w-3xl text-center">
                  <h2 className="mb-4 text-2xl font-bold md:text-3xl">Our Mission</h2>
                  <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                    We believe mental wellness should be accessible to everyone. KAAL AI combines ancient wisdom with
                    modern AI technology to provide compassionate support, guided meditation, and mental health
                    resources—completely free of charge. Your support enables us to reach more people and expand our
                    services.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Button asChild variant="outline" size="lg" className="border-2 bg-transparent">
                      <a href="#impact">Learn More About Our Impact</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function ImpactCard({
  icon,
  number,
  label,
  description,
}: {
  icon: React.ReactNode
  number: string
  label: string
  description: string
}) {
  return (
    <Card className="text-center transition-all hover:shadow-lg">
      <CardHeader>
        <div className="mx-auto mb-3 inline-block rounded-full bg-secondary p-4">{icon}</div>
        <CardTitle className="text-3xl">{number}</CardTitle>
        <p className="text-sm font-semibold text-primary">{label}</p>
      </CardHeader>
      <CardContent>
        <CardDescription className="leading-relaxed">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
