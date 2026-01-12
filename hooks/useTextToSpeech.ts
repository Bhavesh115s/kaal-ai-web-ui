export function useTextToSpeech() {
  const speak = async (text: string) => {
    if (!text) return

    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })

    if (!res.ok) return

    const audioBlob = await res.blob()
    const audioUrl = URL.createObjectURL(audioBlob)

    const audio = new Audio(audioUrl)
    audio.play()
  }

  return { speak }
}
