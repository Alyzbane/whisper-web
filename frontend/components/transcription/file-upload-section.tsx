"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, Loader2, Play } from "lucide-react"
import { useEffect, useState } from "react"

import { MAX_UPLOAD_SIZE } from "@/lib/constants"
import { checkApiHealth } from "@/lib/api"

interface FileUploadSectionProps {
  file: File | null
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  isTranscribing: boolean
  transcriptionStatus: string
  disabled?: boolean
}

export function FileUploadSection({
  file,
  onFileChange,
  onSubmit,
  isTranscribing,
  transcriptionStatus,
  disabled = false,
}: FileUploadSectionProps) {
  const [isApiHealthy, setIsApiHealthy] = useState(false)

  useEffect(() => {
    async function fetchApiHealth() {
      const healthStatus = await checkApiHealth()
      setIsApiHealthy(healthStatus)
    }

    fetchApiHealth()
  }, [])

  const transcriptStatus = transcriptionStatus.includes("exceeds")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Media
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Select Audio File</Label>
          <Input
            id="file-upload"
            type="file"
            accept="audio/*"
            onChange={onFileChange}
            disabled={isTranscribing || disabled}
            className="cursor-pointer"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Supported: MP3, WAV, M4A, etc.
            </span>
            <span className={`${
              transcriptStatus
                ? "text-red-600 font-medium" 
                : "text-slate-500"
            }`}>
              Max: {MAX_UPLOAD_SIZE.formatted}
            </span>
          </div>
        </div>

        <Button
          onClick={onSubmit}
          disabled={!file || isTranscribing || disabled || transcriptStatus || !isApiHealthy}
          className="w-full"
          size="lg"
        >
          {isTranscribing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Transcribing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Transcription
            </>
          )}
        </Button>

        {transcriptionStatus && (
          <div className="text-sm text-center text-slate-600 bg-slate-100 p-2 rounded">{transcriptionStatus}</div>
        )}
      </CardContent>
    </Card>
  )
}
