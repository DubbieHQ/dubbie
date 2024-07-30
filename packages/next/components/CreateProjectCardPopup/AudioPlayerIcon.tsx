import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";

interface AudioPlayerIconProps {
  exampleSoundUrl: string;
}

export function AudioPlayerIcon({ exampleSoundUrl }: AudioPlayerIconProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const loadAndPlayAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(exampleSoundUrl);
      audio.addEventListener("ended", () => setIsPlaying(false));
      audioRef.current = audio;
    }

    audioRef.current.play();
    setIsPlaying(true);
  }, [exampleSoundUrl]);

  const handleClick = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      loadAndPlayAudio();
    }
  };

  return (
    <motion.div
      className="flex h-8 w-8 shrink-0 grow-0 rounded-full bg-white center hover:brightness-[0.97]"
      onClick={handleClick}
    >
      {isPlaying ? (
        <Pause size={16} className="opacity-70" />
      ) : (
        <Play size={14} className="opacity-70" strokeWidth={2} />
      )}
    </motion.div>
  );
}
