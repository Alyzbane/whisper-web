"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { transcribeAudio, getAvailableModels } from "@/lib/api";
import { DEFAULT_CONFIG } from "@/lib/constants";
import { useTranscriptionHistory } from "@/lib/hooks/use-transcription-history";
import type {
  TranscriptionModel,
  TranscriptionConfig,
} from "@/lib/types/transcription";

// Components
import { PageHeader } from "@/components/transcription/page-header";
import { PlaybackPreview } from "@/components/transcription/playback-preview";
import { TranscriptionResult } from "@/components/transcription/transcription-result";
import { FileUploadSection } from "@/components/transcription/file-upload-section";
import { TranscriptionControls } from "@/components/transcription/transcription-controls";
import { AdvancedSettings } from "@/components/transcription/advanced-settings";
import { HistorySidebar } from "@/components/transcription/history-sidebar";
import { WelcomeDialog } from "@/components/transcription/welcome-dialog";

export default function MediaTranscriptionApp() {
  // File and models state
  const [file, setFile] = useState<File | null>(null);
  const [models, setModels] = useState<TranscriptionModel[]>([]);

  // Transcription configuration
  const [config, setConfig] = useState<TranscriptionConfig>({
    model: "",
    language: DEFAULT_CONFIG.language,
    task: DEFAULT_CONFIG.task,
    chunkLength: DEFAULT_CONFIG.chunkLength,
    batchSize: DEFAULT_CONFIG.batchSize,
  });

  // UI state
  const [text, setText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Custom hooks
  const { history, addToHistory, deleteFromHistory } =
    useTranscriptionHistory();
  const [audio, setAudio] = useState<string | null>(null);

  // Load available models on component mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        const availableModels = await getAvailableModels();
        setModels(availableModels);
        if (availableModels.length > 0) {
          setConfig((prev) => ({
            ...prev,
            model: availableModels[0].id || availableModels[0],
          }));
        }
      } catch (error) {
        console.error("Failed to load models:", error);
        const fallbackModels = ["No models available"];
        setModels(fallbackModels.map((id) => ({ id, name: id })));
        setConfig((prev) => ({ ...prev, model: fallbackModels[0] }));
      }
    };

    loadModels();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const maxUploadSizeMb = Math.round(
      parseInt(process.env.NEXT_PUBLIC_UPLOAD_MAX_SIZE || "72351744", 10) /
        (1024 * 1024)
    ); // Default to ~69 MB

    const selectedFileSizeMb = Math.round(selectedFile.size / (1024 * 1024));

    if (selectedFileSizeMb > maxUploadSizeMb) {
      setTranscriptionStatus(
        `File size exceeds the maximum limit of ${maxUploadSizeMb} MB.`
      );
      return;
    }

    setFile(selectedFile);

    if (audio) {
      URL.revokeObjectURL(audio);
    }

    if (selectedFile.type.startsWith("audio/")) {
      const url = URL.createObjectURL(selectedFile);
      setAudio(url);
    } else {
      setAudio(null);
    }
  };

  const handleSubmit = async () => {
    if (!file || !config.model) {
      alert("Please select a file and model");
      return;
    }

    setIsTranscribing(true);
    setTranscriptionStatus("Transcribing audio...");
    setText("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model_id", config.model);
      formData.append("task", config.task);
      formData.append("language", config.language);
      formData.append("chunk_length", config.chunkLength.toString());
      formData.append("batch_size", config.batchSize.toString());

      const result = await transcribeAudio(formData);

      setText(result.text);
      setTranscriptionStatus("Transcription completed!");

      // Add to history with file for deduplication
      await addToHistory({
        text: result.text,
        model: config.model,
        language: config.language,
        task: config.task,
        fileName: file.name,
      }, file);
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

  const updateConfig = (updates: Partial<TranscriptionConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  // Show welcome dialog on page load
  useEffect(() => {
    setShowDialog(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader />

        {showDialog && (
          <WelcomeDialog
            isOpen={showDialog}
            onClose={() => setShowDialog(false)}
          />
        )}

        <TranscriptionResult text={text} onCopy={copyToClipboard} />

        <PlaybackPreview audio={audio} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-4">
              <FileUploadSection
                file={file}
                onFileChange={handleFileChange}
                onSubmit={handleSubmit}
                isTranscribing={isTranscribing}
                transcriptionStatus={transcriptionStatus}
                disabled={!config.model}
              />

              <TranscriptionControls
                models={models}
                selectedModel={config.model}
                onModelChange={(model) => updateConfig({ model })}
                language={config.language}
                onLanguageChange={(language) => updateConfig({ language })}
                task={config.task}
                onTaskChange={(task) => updateConfig({ task })}
                disabled={isTranscribing}
              />

              <AdvancedSettings
                isOpen={showAdvanced}
                onToggle={setShowAdvanced}
                chunkLength={[config.chunkLength]}
                onChunkLengthChange={([chunkLength]) =>
                  updateConfig({ chunkLength })
                }
                batchSize={[config.batchSize]}
                onBatchSizeChange={([batchSize]) => updateConfig({ batchSize })}
                disabled={isTranscribing}
              />
            </div>
          </div>

          <div className="space-y-6">
            <HistorySidebar
              history={history}
              onCopy={copyToClipboard}
              onDelete={deleteFromHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
