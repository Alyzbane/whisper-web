import { formatFileSize } from "./utils";

export const TASKS = ["transcribe", "translate"] as const;

export const DEFAULT_CONFIG = {
  chunkLength: 30,
  batchSize: 5,
  language: "auto",
  task: "transcribe" as const,
};

export const STORAGE_KEYS = {
  TRANSCRIPTS: "transcripts",
} as const;

export const MAX_UPLOAD_SIZE = {
  bytes: parseInt(process.env.NEXT_PUBLIC_UPLOAD_MAX_SIZE || "0", 10), // Default to 0
  formatted: formatFileSize(
    parseInt(process.env.NEXT_PUBLIC_UPLOAD_MAX_SIZE || "0", 10)
  ),  
} as const;
