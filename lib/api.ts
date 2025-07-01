const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function healthCheck() {
  const res = await fetch(`${API_BASE_URL}/health`, {
    method: "GET",
  })

  if (!res.ok) {
    throw new Error("API is not healthy")
  }

  return await res.json()
}

export async function ensureApiHealthy() {
  try {
    await healthCheck()
  } catch (error) {
    throw new Error("Server is unavailable. Please check your connection.")
  }
}

export async function transcribeAudio(formData: FormData) {
  await ensureApiHealthy()
  
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
  await ensureApiHealthy()
  
  const res = await fetch(`${API_BASE_URL}/transcription/models`)

  if (!res.ok) {
    throw new Error("Failed to get models")
  }

  return await res.json()
}
