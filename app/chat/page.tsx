"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string | AIResponse
  timestamp: Date
}

type AIResponse = {
  acknowledgement: string
  shloka: string
  transliteration: string
  meaning: string
  guidance: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Namaste. I am काल AI. Share what's on your mind, and I'll guide you with wisdom and compassion.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return

    const currentInput = input

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: currentInput }),
        }
      )

      if (!response.ok) {
        throw new Error("Backend API failed")
      }

      const data: AIResponse = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Chat API error:", error)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize. I am unable to connect to the wisdom source right now. Please try again shortly.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <div className="flex-1 bg-background">
        <div className="container mx-auto flex h-[calc(100vh-4rem)] max-w-4xl flex-col px-4 py-6">
          {/* Chat Header */}
          <div className="mb-4 rounded-lg border-2 border-border/60 bg-card p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-2xl">
                🕉️
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">🕉️ काल AI</h1>
                <p className="text-sm text-foreground/70 font-medium">
                  Ancient Insight. Modern Clarity.
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto rounded-lg border-2 border-border/40 bg-card/50 p-4 backdrop-blur-sm shadow-inner">
            <div className="space-y-6">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-lg">
                    🕉️
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-card border-2 border-border/40 p-4 shadow-md">
                    <span className="text-sm font-medium text-foreground/70">
                      काल AI is reflecting...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="mt-4 rounded-lg border-2 border-border/60 bg-card p-4 shadow-md">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What's on your mind today?"
                className="flex-1 border-2 text-base font-medium focus-visible:ring-primary focus-visible:border-primary"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="h-11 w-11 shadow-md bg-primary hover:bg-primary/90"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  const content = message.content

  if (!isUser && typeof content === "object") {
    return (
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-lg">
          🕉️
        </div>
        <div className="max-w-[85%] space-y-4 rounded-2xl rounded-tl-sm bg-card border-2 border-border/40 p-6 shadow-lg">
          <p className="font-medium">{content.acknowledgement}</p>

          <div className="rounded-lg bg-primary/10 border-2 border-primary/20 p-4">
            <p className="text-xs font-bold text-primary uppercase">
              Sanskrit Wisdom
            </p>
            <p className="font-serif text-lg">{content.shloka}</p>
            <p className="text-sm italic text-foreground/70">
              {content.transliteration}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase">Meaning</p>
            <p className="text-foreground/80">{content.meaning}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase">Guidance</p>
            <p className="font-medium">{content.guidance}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl p-4 border-2",
          isUser
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-card border-border/40"
        )}
      >
        <p>{typeof content === "string" ? content : ""}</p>
      </div>
    </div>
  )
}
