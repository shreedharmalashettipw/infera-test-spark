import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePractice } from "@/contexts/PracticeContext";
import { useQueryParam } from "@/hooks/useQueryParam";
import ReactTooltip from "react-tooltip";

interface FeedbackButtonProps {
  onSubmitFeedback: (feedback: string) => void;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  onSubmitFeedback,
}) => {
  const testId = useQueryParam("testId") as string;
  const userId = useQueryParam("userId") as string;
  const { fetchNextQuestion } = usePractice();
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [typedText, setTypedText] = useState("");

  const typingText =
    "Choose topics, difficulty, or question type. I will generate questions tailored to your needs.";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let index = 0;

    if (isOpen) {
      setTypedText(""); // Reset on open

      interval = setInterval(() => {
        index++;
        setTypedText(typingText.slice(0, index)); // Use slice to avoid race conditions

        if (index >= typingText.length) {
          clearInterval(interval);
        }
      }, 25);
    } else {
      setTypedText(""); // Reset on close
    }

    return () => clearInterval(interval); // Cleanup
  }, [isOpen]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        await convertToText(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const convertToText = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      // Using Web Speech API for speech-to-text
      const recognition =
        new (window as any).webkitSpeechRecognition() ||
        new (window as any).SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFeedbackText((prev) => prev + " " + transcript);
        setIsLoading(false);
      };

      recognition.onerror = () => {
        console.error("Speech recognition error");
        setIsLoading(false);
        alert("Speech recognition failed. Please type your feedback instead.");
      };

      recognition.start();
    } catch (error) {
      console.error("Speech recognition not supported:", error);
      setIsLoading(false);
      alert(
        "Speech recognition not supported in this browser. Please type your feedback instead."
      );
    }
  };

  const handleSubmit = async () => {
    if (feedbackText.trim()) {
      onSubmitFeedback(feedbackText.trim());
      setFeedbackText("");
      setIsOpen(false);

      // Fetch next question after submitting feedback
      if (testId && userId) {
        await fetchNextQuestion(testId, userId, feedbackText.trim());
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFeedbackText("");
    if (isRecording) {
      stopRecording();
    }
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="bg-transparent fixed bottom-6 left-24 z-50 flex flex-col items-center gap-2 cursor-pointer"
      >
        <img
          src="/ai-assistant.svg"
          alt="Robot"
          className="w-40 h-40 transition-transform duration-300 ease-in-out hover:scale-110"
        />
        <span className="absolute top-[120px] text-sm font-semibold text-gray-700">
          Infera Buddy
        </span>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Tell us what you want to practice
              </h3>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="text-sm text-gray-700 mb-4">
                {typedText?.length > 0 && <p>{typedText}</p>}
              </div>
              {/* <div className="flex items-center gap-2">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  variant={isRecording ? "destructive" : "default"}
                  size="sm"
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Start Recording
                    </>
                  )}
                </Button>
                {isLoading && (
                  <span className="text-sm text-gray-600">
                    Converting speech to text...
                  </span>
                )}
              </div> */}

              <Textarea
                placeholder="Type here..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                className="w-full"
              />

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!feedbackText.trim() || isLoading}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;
