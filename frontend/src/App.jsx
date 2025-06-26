import { useRef, useState, useEffect } from "react";
import { transcribe } from "./api";

const whisper_models = [
  "openai/whisper-tiny",
  "openai/whisper-tiny.en",
  "openai/whisper-base",
  "openai/whisper-base.en",
  "openai/whisper-small",
  "openai/whisper-small.en",
  "distil-whisper/distil-small.en",
  "openai/whisper-medium",
  "openai/whisper-medium.en",
  "distil-whisper/distil-medium.en",
  "openai/whisper-large",
  "openai/whisper-large-v1",
  "openai/whisper-large-v2",
  "distil-whisper/distil-large-v2",
  "openai/whisper-large-v3",
  "distil-whisper/distil-large-v3",
  "xaviviro/whisper-large-v3-catalan-finetuned-v2",
];
const languages = [
  "Automatic Detection",
  "English",
  "Japanese",
  "French",
  "German",
  "Chinese",
];
const tasks = ["transcribe", "translate"];

export default function App() {
  const [file, setFile] = useState(null);
  const [model, setModel] = useState(whisper_models[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [task, setTask] = useState(tasks[0]);
  const [text, setText] = useState("");
  const [audio, setAudio] = useState(null);
  const audioRef = useRef(null);
  const [history, setHistory] = useState(() =>
    JSON.parse(localStorage.getItem("transcripts") || "[]")
  );

  // Revoke the URL when the component unmounts
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

  const handleFileChange = (e) => {
    e.preventDefault();
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile && selectedFile.type.startsWith("audio/")) {
      // Create preview URL for the audio file
      const url = URL.createObjectURL(selectedFile);
      setAudio(url);
    } else {
      setAudio(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model_id", model);
    formData.append("task", task);
    formData.append("language", language);
    formData.append("flash", false);
    formData.append("chunk_length", 30);
    formData.append("batch_size", 8);

    const result = await transcribe(formData);
    if (!result || typeof result.text === "undefined") {
      alert("Transcription failed or server returned an unexpected response.");
      console.log("Backend response:", result);
      return;
    }

    setText(result.text);
    const newEntry = { id: Date.now(), text: result.text };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("transcripts", JSON.stringify(updatedHistory));
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Simple Transcriber</h1>

      <input type="file" accept="audio/*" onChange={handleFileChange} />
      {audio && (
        <audio ref={audioRef} controls>
          <source src={audio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
      <div>
        <label>Model:</label>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          {whisper_models.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Task:</label>
        <select value={task} onChange={(e) => setTask(e.target.value)}>
          {tasks.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Language:</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang}>{lang}</option>
          ))}
        </select>
      </div>
      <button onClick={handleSubmit}>Transcribe</button>

      <h2>Transcript:</h2>
      <pre>{text}</pre>

      <h2>History:</h2>
      <ul>
        {history.map((h) => (
          <li key={h.id}>
            <pre>{h.text}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
