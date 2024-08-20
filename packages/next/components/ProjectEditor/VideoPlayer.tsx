import {
  projectOriginalUrlAtom,
  activeTracksAtom,
  isAudioPlayingAtom,
  videoRefAtom,
  isAudioLoadingAtom,
  audioPlayerStateAtom,
} from "@/lib/atoms";
import { styles } from "@/lib/constants";
import useWindowSize from "@/lib/hooks/useWindowSize";
import { motion } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai/react";
import React, { useCallback, useEffect } from "react";
import { useRef } from "react";
import ReactPlayer from "react-player";
import { Spinner } from "../ui/Spinner";

function VideoPlayer() {
  const originalUrl = useAtomValue(projectOriginalUrlAtom);
  const { original: isOriginalActive } = useAtomValue(activeTracksAtom);
  const ref = useRef<ReactPlayer>(null);
  const setVideoRef = useSetAtom(videoRefAtom);
  const isPlayingAudio = useAtomValue(isAudioPlayingAtom);
  const { windowSize, hasWindow } = useWindowSize();

  const wrapper = useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <div
        style={{
          height:
            windowSize.height -
            styles.topbarHeight -
            styles.controlHeight -
            2 * styles.trackHeight -
            styles.scrollBarWidth,
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
          flexGrow: 0,
        }}
      >
        <PlayPauseOverlay />
        {children}
      </div>
    ),
    [windowSize.height],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setVideoRef(ref);
  }, [ref, setVideoRef]);

  if (!hasWindow) return <div />;

  return (
    <ReactPlayer
      url={originalUrl}
      ref={ref}
      playing={isPlayingAudio}
      muted={!isOriginalActive}
      wrapper={wrapper}
    />
  );
}

export const MemoizedVideoPlayer = React.memo(VideoPlayer);

export const PlayPauseOverlay = () => {
  const { play, pause } = useAtomValue(audioPlayerStateAtom);
  const isPlayingAudio = useAtomValue(isAudioPlayingAtom);
  const videoRef = useAtomValue(videoRefAtom);
  const isLoadingAudio = useAtomValue(isAudioLoadingAtom);
  const showPlayButton = !isPlayingAudio && !isLoadingAudio && videoRef;

  const togglePlayPause = () => {
    if (isPlayingAudio) {
      pause();
    } else {
      play();
    }
  };

  return (
    <motion.div
      animate={{
        opacity: showPlayButton ? 1 : 0,
      }}
      transition={{ duration: 0.2 }}
      onClick={togglePlayPause}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        cursor: "pointer",
        zIndex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      {isLoadingAudio ? (
        <Spinner size="medium" color="text-white" />
      ) : (
        !isPlayingAudio && (
          <svg
            width="40"
            height="40"
            viewBox="0 0 260 296"
            className="opacity-50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Play</title>
            <path
              d="M251 132.41C263 139.338 263 156.659 251 163.587L27.5 292.625C15.5 299.553 0.499999 290.892 0.5 277.036L0.500011 18.9604C0.500012 5.10401 15.5 -3.55621 27.5 3.372L251 132.41Z"
              fill="#D9D9D9"
            />
          </svg>
        )
      )}
    </motion.div>
  );
};
