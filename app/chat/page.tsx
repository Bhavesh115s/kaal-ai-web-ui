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

  // 🔊 TTS (ONLY HERE)
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`,
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

      // ❌ AUTO SPEAK REMOVED (THIS WAS THE MAIN BUG)

    } catch {
      setMessages((p) => [
        ...p,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I am unable to respond right now.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <div className="flex-1 bg-background">
        <div className="container mx-auto flex h-[calc(100vh-4rem)] max-w-4xl flex-col px-4 py-6">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto rounded-lg border p-4">
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                message={m}
                onPlay={(text) => speak(text)}
              />
            ))}
            {isTyping && (
              <p className="text-sm text-muted-foreground">
                काल AI is reflecting...
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="mt-4 flex gap-2">
            <Button
              size="icon"
              variant={recording ? "destructive" : "outline"}
              onClick={async () => {
                if (!recording) await startRecording()
                else {
                  const text = await stopRecording()
                  if (text) setInput(text)
                }
              }}
            >
              {recording ? "⏹️" : "🎙️"}
            </Button>

            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What's on your mind?"
            />

            <Button onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({
  message,
  onPlay,
}: {
  message: Message
  onPlay: (text: string) => void
}) {
  const isUser = message.role === "user"
  const content = message.content

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[68%] rounded-2xl px-4 py-3 leading-relaxed",
          isUser
            ? "bg-orange-500 text-white rounded-br-sm"
            : "bg-white border border-border/40 text-foreground rounded-bl-sm"
        )}
      >
        {typeof content === "string" ? (
          <p className="text-sm">{content}</p>
        ) : (
          <div className="space-y-2">
            <p className="font-medium text-sm">
              {content.acknowledgement}
            </p>

            <p className="text-sm text-muted-foreground">
              {content.guidance}
            </p>

            <button
              onClick={() => onPlay(content.guidance)}
              className="text-xs text-orange-600 hover:underline mt-1"
            >
              🔊 Listen
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
