// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error("API error");
  }

  return res.json();
}
