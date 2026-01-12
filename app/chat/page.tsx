"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSpeechToText } from "@/hooks/useSpeechToText"
import { useTextToSpeech } from "@/hooks/useTextToSpeech"

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

  // 🎙 STT
  const { recording, startRecording, stopRecording } = useSpeechToText()

  // 🔊 TTS
  const { speak } = useTextToSpeech()

  /* ===== AUTO SCROLL ===== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  /* ===== SEND MESSAGE ===== */
  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((p) => [...p, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage.content }),
        }
      )

      const data: AIResponse = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data,
        timestamp: new Date(),
      }

      setMessages((p) => [...p, aiMessage])

      // 🔊 AI SPEAKS (important line)
      speak(data.guidance || data.acknowledgement)
    } catch {
      setMessages((p) => [
        ...p,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I apologize. I am unable to connect to the wisdom source right now.",
          timestamp: new Date(),
        },
      ])
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
          {/* Messages */}
          <div className="flex-1 overflow-y-auto rounded-lg border-2 border-border/40 bg-card/50 p-4 shadow-inner">
            <div className="space-y-6">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {isTyping && (
                <p className="text-sm text-muted-foreground">
                  काल AI is reflecting...
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="mt-4 rounded-lg border-2 border-border/60 bg-card p-4 shadow-md">
            <div className="flex gap-2">
              {/* 🎙️ MIC */}
              <Button
                type="button"
                size="icon"
                variant={recording ? "destructive" : "outline"}
                onClick={async () => {
                  if (!recording) {
                    await startRecording()
                  } else {
                    const text = await stopRecording()
                    if (text) setInput(text)
                  }
                }}
                className="h-11 w-11"
              >
                {recording ? "⏹️" : "🎙️"}
              </Button>

              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What's on your mind today?"
                className="flex-1 border-2"
              />

              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="h-11 w-11"
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
  const { speak } = useTextToSpeech()

  const textToSpeak =
    typeof content === "string"
      ? content
      : content.guidance || content.acknowledgement

  return (
    <div className={cn("flex items-start gap-3", isUser && "justify-end")}>
      {!isUser && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-lg">
          🕉️
        </div>
      )}

      <div className="max-w-[85%] rounded-2xl p-4 border-2 space-y-2">
        <p className="text-sm">
          {typeof content === "string"
            ? content
            : content.acknowledgement}
        </p>

        {!isUser && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => speak(textToSpeak)}
          >
            🔊 Play Voice
          </Button>
        )}
      </div>
    </div>
  )
}
