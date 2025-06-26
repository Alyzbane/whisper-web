export async function transcribe(formData) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const res = await fetch(`${API_BASE_URL}/transcription/transcribe`, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    return await res.json();
}