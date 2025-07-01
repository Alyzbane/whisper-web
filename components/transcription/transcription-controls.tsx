"use client"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LANGUAGES } from "@/lib/language"
import { TASKS } from "@/lib/constants"
import type { TranscriptionModel } from "@/lib/types/transcription"

interface TranscriptionControlsProps {
  models: TranscriptionModel[]
  selectedModel: string
  onModelChange: (value: string) => void
  language: string
  onLanguageChange: (value: string) => void
  task: string
  onTaskChange: (value: string) => void
  disabled?: boolean
}

export function TranscriptionControls({
  models,
  selectedModel,
  onModelChange,
  language,
  onLanguageChange,
  task,
  onTaskChange,
  disabled = false,
}: TranscriptionControlsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Model</Label>
          <Select value={selectedModel} onValueChange={onModelChange} disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id || model} value={model.id || model}>
                  {model.name || model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Task</Label>
          <Select value={task} onValueChange={onTaskChange} disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder="Transcribe" />
            </SelectTrigger>
            <SelectContent>
              {TASKS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Language</Label>
        <Select value={language} onValueChange={onLanguageChange} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder="Automatic Detection" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
