const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function transcribeAudio(formData: FormData) {
  const res = await fetch(`${API_BASE_URL}/transcription/transcribe`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    throw new Error(`Unknown eror: ${res.status} ${res.statusText}`);
  }

  return await res.json()
}

export async function getAvailableModels() {
  const res = await fetch(`${API_BASE_URL}/transcription/models`)

  if (!res.ok) {
    throw new Error("Failed to get models")
  }

  return await res.json()
}
