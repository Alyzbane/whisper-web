import { HealthStatus } from "@/lib/types/health";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${process.env.NEXT_PUBLIC_API_ROOT_ENDPOINT}`;

export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return false;
    }

    const data: HealthStatus = await res.json();
    return data.status === "OK";
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
}

export async function transcribeAudio(formData: FormData) {
  const res = await fetch(`${API_URL}/transcription/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Unknown eror: ${res.status}}`);
  }

  return await res.json();
}

export async function getAvailableModels() {
  const res = await fetch(`${API_URL}/transcription/models`);

  if (!res.ok) {
    throw new Error("Failed to get models");
  }

  return await res.json();
}
