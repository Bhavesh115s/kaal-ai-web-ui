"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Video, Star, AlertCircle } from "lucide-react"

type Psychologist = {
  id: number
  name: string
  specialization: string
  experience: string
  rating: number
  consultationMode: string
  image: string
}

const psychologists: Psychologist[] = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialization: "Anxiety & Stress Management",
    experience: "12 years",
    rating: 4.9,
    consultationMode: "Online",
    image: "/professional-woman-therapist.png",
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialization: "Youth & Adolescent Psychology",
    experience: "10 years",
    rating: 4.8,
    consultationMode: "Online",
    image: "/professional-man-therapist.png",
  },
  {
    id: 3,
    name: "Dr. Ananya Iyer",
    specialization: "Depression & Mood Disorders",
    experience: "15 years",
    rating: 5.0,
    consultationMode: "Online",
    image: "/professional-woman-psychologist.png",
  },
  {
    id: 4,
    name: "Dr. Vikram Mehta",
    specialization: "Career & Life Transitions",
    experience: "8 years",
    rating: 4.7,
    consultationMode: "Online",
    image: "/professional-man-counselor.png",
  },
]

export default function PsychologistPage() {
  const handleBookSession = (name: string) => {
    alert(`Booking system coming soon! You selected ${name}. (This is a demo - no actual booking will be processed)`)
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="bg-gradient-to-br from-secondary/30 via-background to-accent/5 py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              Professional Support
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Talk to a Professional</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Connect with licensed mental health professionals for personalized support
            </p>
          </div>

          {/* Disclaimer Card */}
          <Card className="mb-12 border-0 bg-accent/5 shadow-lg max-w-4xl mx-auto">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-full bg-accent/10 p-3">
                  <AlertCircle className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Important Notice</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    KAAL AI does not replace professional therapy. If you're experiencing severe distress, persistent
                    symptoms, or thoughts of self-harm, please reach out to a mental health professional. Human support
                    is available when needed, and there's no shame in seeking help.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Psychologists Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
            {psychologists.map((psychologist) => (
              <Card
                key={psychologist.id}
                className="border-0 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mb-4 flex justify-center">
                    <div className="relative">
                      <img
                        src={psychologist.image || "/placeholder.svg"}
                        alt={psychologist.name}
                        className="h-24 w-24 rounded-full object-cover border-4 border-primary/10"
                      />
                      <div className="absolute -bottom-2 -right-2 rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground shadow-lg">
                        {psychologist.consultationMode}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{psychologist.name}</CardTitle>
                  <CardDescription className="text-base font-medium text-primary">
                    {psychologist.specialization}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-accent" />
                      <span className="text-muted-foreground">{psychologist.experience} Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="font-semibold">{psychologist.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 rounded-lg bg-accent/5 py-3 text-sm">
                    <Video className="h-4 w-4 text-accent" />
                    <span className="font-medium text-accent">Online Video Sessions Available</span>
                  </div>

                  <Button
                    onClick={() => handleBookSession(psychologist.name)}
                    size="lg"
                    className="w-full shadow-md hover:shadow-lg"
                  >
                    Book Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Assessment Recommendation */}
          <Card className="mt-12 border-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 shadow-xl max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">Not Sure Where to Start?</h2>
              <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
                Take our Self Reflection assessment to better understand your mental wellness needs and get personalized
                recommendations.
              </p>
              <Button asChild size="lg" variant="outline" className="border-2 bg-transparent">
                <a href="/assessment">Take Self Reflection Assessment</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
