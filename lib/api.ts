const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export async function transcribeAudio(formData: FormData) {
  const res = await fetch(`${API_BASE_URL}/transcription/transcribe`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.detail || "Network response was not ok")
  }

  return await res.json()
}

export async function getAvailableModels() {
  const res = await fetch(`${API_BASE_URL}/transcription/models`)

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.detail || "Failed to get models")
  }

  return await res.json()
}
