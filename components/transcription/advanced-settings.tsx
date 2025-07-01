"use client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

interface AdvancedSettingsProps {
  isOpen: boolean
  onToggle: (open: boolean) => void
  chunkLength: number[]
  onChunkLengthChange: (value: number[]) => void
  batchSize: number[]
  onBatchSizeChange: (value: number[]) => void
  disabled?: boolean
}

export function AdvancedSettings({
  isOpen,
  onToggle,
  chunkLength,
  onChunkLengthChange,
  batchSize,
  onBatchSizeChange,
  disabled = false,
}: AdvancedSettingsProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          Advanced Settings
          <ChevronDown className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label>Chunk Length: {chunkLength[0]}s</Label>
          <Slider
            value={chunkLength}
            onValueChange={onChunkLengthChange}
            max={60}
            min={1}
            step={1}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Batch Size: {batchSize[0]}</Label>
          <Slider value={batchSize} onValueChange={onBatchSizeChange} max={32} min={1} step={1} disabled={disabled} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
