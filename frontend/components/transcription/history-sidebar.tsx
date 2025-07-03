"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Copy, Trash2 } from "lucide-react"
import type { HistoryEntry } from "@/lib/types/transcription"

interface HistorySidebarProps {
  history: HistoryEntry[]
  onCopy: (text: string) => void
  onDelete: (id: string) => void // Changed from number to string
}

export function HistorySidebar({ history, onCopy, onDelete }: HistorySidebarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          {history.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No transcriptions yet</p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-3 space-y-2 bg-slate-50">
                  <div className="flex items-start justify-between">
                    <div className="text-xs text-slate-500 space-y-1">
                      <div>{entry.fileName}</div>
                      <div>{new Date(entry.timestamp).toLocaleDateString()}</div>
                      <Badge variant="outline" className="text-xs">
                        {entry.model}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => onCopy(entry.text)} className="h-6 w-6 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(entry.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-3">{entry.text}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
