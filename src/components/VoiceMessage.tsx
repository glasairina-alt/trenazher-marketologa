import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceMessageProps {
  audioUrl: string;
  timestamp: Date;
}

export const VoiceMessage = ({ audioUrl, timestamp }: VoiceMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2 sm:gap-3 min-w-[250px] max-w-sm" data-testid="voice-message-player">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <Button
        size="icon"
        onClick={togglePlay}
        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shrink-0"
        data-testid="button-voice-play"
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" />
        ) : (
          <Play className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5" fill="currentColor" />
        )}
      </Button>

      <div className="flex-1 flex flex-col gap-1">
        <div className="relative h-8 sm:h-10 flex items-center">
          {/* Waveform background */}
          <div className="absolute inset-0 flex items-center gap-0.5">
            {[...Array(40)].map((_, i) => {
              const height = Math.random() * 60 + 20;
              const isActive = (i / 40) * 100 <= progress;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-full transition-colors duration-150"
                  style={{
                    height: `${height}%`,
                    backgroundColor: isActive 
                      ? "rgb(59, 130, 246)" 
                      : "rgb(203, 213, 225)",
                    opacity: isActive ? 1 : 0.4,
                  }}
                />
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-secondary-foreground/70">
          <span>{formatTime(isPlaying ? currentTime : duration)}</span>
          <span>94.0 KB</span>
        </div>
      </div>

      <div className="text-xs text-secondary-foreground/70 self-end pb-1">
        {timestamp.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
};
