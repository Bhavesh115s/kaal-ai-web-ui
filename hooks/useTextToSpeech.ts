export function useTextToSpeech() {
  const speak = (text: string) => {
    if (!text || typeof window === "undefined") return

    const synth = window.speechSynthesis
    synth.cancel() // 🔥 stop all previous voices

    const u = new SpeechSynthesisUtterance(text)
    u.lang = "en-IN"
    u.rate = 0.9
    u.pitch = 1

    const voices = synth.getVoices()
    const v =
      voices.find(v => v.lang === "en-IN") ||
      voices.find(v => v.lang.includes("en"))

    if (v) u.voice = v

    synth.speak(u)
  }

  return { speak }
}
