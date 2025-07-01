"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";

export interface PlaybackPreviewProps {
  audio: string | null;
}

export function PlaybackPreview({ audio }: PlaybackPreviewProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current && audio) {
      audioRef.current.load();
    }
    return () => {
    };
  }, [audio]);

  if (!audio) return null;

  return (
    <Card className="border-2 border-slate-200 bg-slate-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Volume2 className="h-5 w-5" />
          Media Player
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <audio
            ref={audioRef}
            className="flex-1"
            controls
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={audio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </CardContent>
    </Card>
  );
}
