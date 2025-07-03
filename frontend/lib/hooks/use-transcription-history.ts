"use client"

import { useState, useEffect } from "react"
import type { HistoryEntry } from "@/lib/types/transcription"
import { STORAGE_KEYS } from "@/lib/constants"
import { getFileHash } from "@/lib/actions"

export function useTranscriptionHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([])

  // Load history from localStorage on client mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEYS.TRANSCRIPTS)
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error("Failed to parse saved history:", error)
      }
    }
  }, [])

  const addToHistory = async (entry: Omit<HistoryEntry, "id" | "timestamp">, file: File) => {
    try {
      // Generate file hash
      const fileHash = await getFileHash(file)
      
      // Create composite key including all parameters that affect the result
      const compositeKey = `${fileHash}-${entry.model}-${entry.task}-${entry.language}`
      
      // Check if entry with this exact combination already exists
      const existingEntryIndex = history.findIndex((historyEntry) => 
        historyEntry.id === compositeKey
      )
      
      const newEntry: HistoryEntry = {
        ...entry,
        id: compositeKey,
        timestamp: new Date().toISOString(),
      }

      let updatedHistory: HistoryEntry[]
      
      if (existingEntryIndex !== -1) {
        // Replace existing entry (update timestamp and move to top)
        updatedHistory = [newEntry, ...history.filter((_, index) => index !== existingEntryIndex)]
      } else {
        // Add new entry
        updatedHistory = [newEntry, ...history]
      }

      setHistory(updatedHistory)

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.TRANSCRIPTS, JSON.stringify(updatedHistory))
      }
    } catch (error) {
      console.error("Failed to generate file hash:", error)
      // Fallback to timestamp-based ID if hashing fails
      const fallbackId = `fallback-${Date.now()}-${entry.model}-${entry.task}`
      const fallbackEntry: HistoryEntry = {
        ...entry,
        id: fallbackId,
        timestamp: new Date().toISOString(),
      }
      
      const updatedHistory = [fallbackEntry, ...history]
      setHistory(updatedHistory)

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.TRANSCRIPTS, JSON.stringify(updatedHistory))
      }
    }
  }

  const deleteFromHistory = (id: string) => {
    const updatedHistory = history.filter((entry) => entry.id !== id)
    setHistory(updatedHistory)

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.TRANSCRIPTS, JSON.stringify(updatedHistory))
    }
  }

  const clearHistory = () => {
    setHistory([])
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.TRANSCRIPTS)
    }
  }

  return {
    history,
    addToHistory,
    deleteFromHistory,
    clearHistory,
  }
}
