"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Video, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Event = {
  id: number
  title: string
  date: string
  time: string
  type: "online" | "in-person"
  location?: string
  description: string
  facilitator: string
}

type TabType = "all" | "online" | "in-person"

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      if (!response.ok) throw new Error("Failed to fetch events")
      const data = await response.json()
      setEvents(data.events)
    } catch (error) {
      console.error("[v0] Events API error:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter((event) => {
    if (activeTab === "all") return true
    return event.type === activeTab
  })

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="bg-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              Community Events
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Wellness Sessions</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Join philosophy-based sessions and connect with others on the journey to mental wellness
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-lg border border-border bg-card p-1 shadow-sm">
              <TabButton label="All Events" isActive={activeTab === "all"} onClick={() => setActiveTab("all")} />
              <TabButton label="Online" isActive={activeTab === "online"} onClick={() => setActiveTab("online")} />
              <TabButton
                label="In-Person"
                isActive={activeTab === "in-person"}
                onClick={() => setActiveTab("in-person")}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Events Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {filteredEvents.length === 0 && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="py-12 text-center">
                    <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-lg text-muted-foreground">No events found for this category</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function TabButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md px-6 py-2 text-sm font-medium transition-colors",
        isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  )
}

function EventCard({ event }: { event: Event }) {
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Card className="group transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <div className="mb-3 flex items-start justify-between">
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
              event.type === "online" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary",
            )}
          >
            {event.type === "online" ? (
              <>
                <Video className="h-3 w-3" />
                Online
              </>
            ) : (
              <>
                <MapPin className="h-3 w-3" />
                In-Person
              </>
            )}
          </div>
        </div>
        <CardTitle className="text-xl">{event.title}</CardTitle>
        <CardDescription className="leading-relaxed">{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4 text-primary" />
          <span>{event.time}</span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{event.location}</span>
          </div>
        )}
        <div className="pt-2">
          <p className="text-xs text-muted-foreground">Facilitated by {event.facilitator}</p>
        </div>
        <Button className="mt-4 w-full group-hover:shadow-md">Register Now</Button>
      </CardContent>
    </Card>
  )
}
