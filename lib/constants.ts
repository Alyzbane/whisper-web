export const TASKS = ["transcribe", "translate"] as const

export const DEFAULT_CONFIG = {
  chunkLength: 30,
  batchSize: 8,
  language: "auto",
  task: "transcribe" as const,
}

export const STORAGE_KEYS = {
  TRANSCRIPTS: "transcripts",
} as const