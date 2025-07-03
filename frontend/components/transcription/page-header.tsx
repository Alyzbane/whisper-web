"use client"

export function PageHeader() {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
        Media Transcription Studio
      </h1>
      <p className="text-slate-600">Upload audio files and get instant transcriptions</p>
    </div>
  )
}
