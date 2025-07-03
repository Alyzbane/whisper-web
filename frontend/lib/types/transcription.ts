export interface TranscriptionModel {
  id: string
  name: string
}

export interface HistoryEntry {
  id: string
  text: string
  model: string
  language: string
  task: string
  timestamp: string
  fileName?: string
}

export interface TranscriptionConfig {
  model: string
  language: string
  task: string
  chunkLength: number
  batchSize: number
}

export interface TranscriptionResult {
  text: string
  status: "success" | "error"
  message?: string
}
