"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Upload,
  History,
  FileAudio,
  Loader2,
  ChevronDown,
  Copy,
  Trash2,
  Volume2,
} from "lucide-react";
import { transcribeAudio, getAvailableModels } from "@/lib/api";
import { LANGUAGES } from "@/lib/language";

const tasks = ["transcribe", "translate"];

interface HistoryEntry {
  id: number;
  text: string;
  model: string;
  language: string;
  task: string;
  timestamp: string;
  fileName?: string;
}

export default function MediaTranscriptionApp() {
  const [file, setFile] = useState<File | null>(null);
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [language, setLanguage] = useState<string>("auto");
  const [task, setTask] = useState(tasks[0]);
  const [text, setText] = useState("");
  const [audio, setAudio] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  // Advanced options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [chunkLength, setChunkLength] = useState([30]);
  const [batchSize, setBatchSize] = useState([8]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage on client mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("transcripts");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Load available models on component mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        const availableModels = await getAvailableModels();
        setModels(availableModels);
        if (availableModels.length > 0) {
          setSelectedModel(availableModels[0].id || availableModels[0]);
        }
      } catch (error) {
        console.error("Failed to load models:", error);
        const fallbackModels = ["No models available"];
        setModels(fallbackModels.map((id) => ({ id, name: id })));
        setSelectedModel(fallbackModels[0]);
      }
    };

    loadModels();
  }, []);

  // Handle audio file preview
  useEffect(() => {
    if (audioRef.current && audio) {
      audioRef.current.load();
    }
    return () => {
      if (audio) {
        URL.revokeObjectURL(audio);
      }
    };
  }, [audio]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    if (selectedFile.type.startsWith("audio/")) {
      const url = URL.createObjectURL(selectedFile);
      setAudio(url);
    } else {
      setAudio(null);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSubmit = async () => {
    if (!file || !selectedModel) {
      alert("Please select a file and model");
      return;
    }

    setIsTranscribing(true);
    setTranscriptionStatus("Transcribing audio...");
    setText("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model_id", selectedModel);
      formData.append("task", task);
      formData.append("language", language);
      formData.append("chunk_length", chunkLength[0].toString());
      formData.append("batch_size", batchSize[0].toString());

      const result = await transcribeAudio(formData);

      setText(result.text);
      setTranscriptionStatus("Transcription completed!");

      // Add to history
      const newEntry: HistoryEntry = {
        id: Date.now(),
        text: result.text,
        model: selectedModel,
        language: language,
        task: task,
        timestamp: new Date().toISOString(),
        fileName: file.name,
      };
      const updatedHistory = [newEntry, ...history];
      setHistory(updatedHistory);
      if (typeof window !== "undefined") {
        localStorage.setItem("transcripts", JSON.stringify(updatedHistory));
      }
    } catch (error: any) {
      console.error("Transcription error:", error);
      setTranscriptionStatus(`Error: ${error.message}`);
      alert(`Transcription failed: ${error.message}`);
    } finally {
      setIsTranscribing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const deleteHistoryEntry = (id: number) => {
    const updatedHistory = history.filter((entry) => entry.id !== id);
    setHistory(updatedHistory);
    if (typeof window !== "undefined") {
      localStorage.setItem("transcripts", JSON.stringify(updatedHistory));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Media Transcription Studio
          </h1>
          <p className="text-slate-600">
            Upload audio files and get instant transcriptions
          </p>
        </div>

        {/* Transcription Display */}
        {text && (
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
                  onClick={() => copyToClipboard(text)}
                  className="text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea>
                <p className="text-emerald-900 leading-relaxed whitespace-pre-wrap">
                  {text}
                </p>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Media Player */}
        {audio && (
          <Card className="border-2 border-slate-200 bg-slate-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Volume2 className="h-5 w-5" />
                Media Player
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayPause}
                  className="flex-shrink-0 bg-transparent"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button> */}
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
        )}

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Upload & Controls */}
          <div className="lg:col-span-2 space-y-4">
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
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    disabled={isTranscribing}
                    className="cursor-pointer"
                  />
                  {file && (
                    <Badge variant="secondary" className="mt-2">
                      {file.name}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Select
                      value={selectedModel}
                      onValueChange={setSelectedModel}
                      disabled={isTranscribing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem
                            key={model.id || model}
                            value={model.id || model}
                          >
                            {model.name || model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Task</Label>
                    <Select
                      value={task}
                      onValueChange={setTask}
                      disabled={isTranscribing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Transcribe" />
                      </SelectTrigger>
                      <SelectContent>
                        {tasks.map((t) => (
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
                  <Select
                    value={language}
                    onValueChange={setLanguage}
                    disabled={isTranscribing}
                  >
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

                <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
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
                        onValueChange={setChunkLength}
                        max={60}
                        min={1}
                        step={1}
                        disabled={isTranscribing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Batch Size: {batchSize[0]}</Label>
                      <Slider
                        value={batchSize}
                        onValueChange={setBatchSize}
                        max={32}
                        min={1}
                        step={1}
                        disabled={isTranscribing}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Button
                  onClick={handleSubmit}
                  disabled={!file || !selectedModel || isTranscribing}
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
                  <div className="text-sm text-center text-slate-600 bg-slate-100 p-2 rounded">
                    {transcriptionStatus}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* History Sidebar */}
          <div className="space-y-4">
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
                    <p className="text-slate-500 text-sm text-center py-8">
                      No transcriptions yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {history.map((entry) => (
                        <div
                          key={entry.id}
                          className="border rounded-lg p-3 space-y-2 bg-slate-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="text-xs text-slate-500 space-y-1">
                              <div>{entry.fileName}</div>
                              <div>
                                {new Date(entry.timestamp).toLocaleDateString()}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {entry.model}
                              </Badge>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(entry.text)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteHistoryEntry(entry.id)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-700 line-clamp-3">
                            {entry.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
