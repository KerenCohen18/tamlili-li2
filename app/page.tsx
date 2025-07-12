"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("הדפדפן שלך לא תומך בזיהוי קולי בזמן אמת");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "he-IL";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + transcriptPart + ". ");
        } else {
          interim += transcriptPart;
        }
      }
    };

    recognition.onend = () => {
      if (isRecording) recognition.start();
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const downloadWord = () => {
    const element = document.createElement("a");
    const blob = new Blob([transcript], {
      type: "application/msword",
    });
    element.href = URL.createObjectURL(blob);
    element.download = "תמלול.doc";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <main className="max-w-3xl mx-auto p-6 text-right">
      <h1 className="text-3xl font-bold mb-4 text-center">🎤 לילי תמללי לי</h1>
      <div className="flex justify-center gap-4 mb-4">
        <button onClick={startRecording} disabled={isRecording} className="bg-green-500 text-white px-4 py-2 rounded">
          ▶️ התחלת תמלול
        </button>
        <button onClick={stopRecording} disabled={!isRecording} className="bg-red-500 text-white px-4 py-2 rounded">
          ⏹️ עצירה
        </button>
        <button onClick={downloadWord} disabled={!transcript} className="bg-blue-500 text-white px-4 py-2 rounded">
          💾 ייצוא ל-Word
        </button>
      </div>
      <div className="bg-gray-100 p-4 rounded min-h-[200px] whitespace-pre-wrap">{transcript || "התחל תמלול כדי לראות את הטקסט מופיע כאן..."}</div>
    </main>
  );
}
