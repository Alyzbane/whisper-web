"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, FileAudio } from "lucide-react"

interface TranscriptionResultProps {
  text: string
  onCopy: (text: string) => void
}

export function TranscriptionResult({ text, onCopy }: TranscriptionResultProps) {
  if (!text) return null

  return (
    <Card className="border-2 border-emerald-200 bg-emerald-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-emerald-800 flex items-center gap-2">
            <FileAudio className="h-5 w-5" />
            Transcription Result
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopy(text)}
            className="text-emerald-700 border-emerald-300 hover:bg-emerald-100"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <p className="text-emerald-900 leading-relaxed whitespace-pre-wrap">{text}</p>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
