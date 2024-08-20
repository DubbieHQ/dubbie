// Start of Selection
import { useState, useEffect, useCallback, useRef } from "react";
import * as Tone from "tone";
import {
  activeTracksAtom,
  audioPlayerStateAtom,
  projectBGMAudioUrlAtom,
  translatedTrackSegmentsAtom,
  videoRefAtom,
} from "../atoms";
import { useAtomValue, useSetAtom } from "jotai";
import ReactPlayer from "react-player";

export const useAudioTrack = () => {
  const videoRef = useAtomValue(videoRefAtom);
  const segments = useAtomValue(translatedTrackSegmentsAtom);
  const playersRef = useRef<Tone.Player[]>([]); // Use ref instead of state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // State to track current time
  const [isLoading, setIsLoading] = useState(true);
  const isTargetActive = useAtomValue(activeTracksAtom).target;
  const projectBGMAudioUrl = useAtomValue(projectBGMAudioUrlAtom);
  const setAudioTrackState = useSetAtom(audioPlayerStateAtom);
  const bgmPlayerRef = useRef<Tone.Player | null>(null);
  const bgmPlayerLoadedRef = useRef(false);
  const transportRef = useRef(Tone.getTransport());

  const handlePlay = useCallback(async () => {
    if (!isRefObject(videoRef) || !videoRef.current || isLoading) return;
    await Tone.start();
    transportRef.current.start();
    videoRef.current.seekTo(currentTime, "seconds");
    setIsPlaying(true);
  }, [currentTime, isLoading, videoRef]);

  const handlePause = useCallback(() => {
    if (!isRefObject(videoRef) || !videoRef.current || isLoading) return;
    transportRef.current.pause();
    setIsPlaying(false);
  }, [isLoading, videoRef]);

  const handleSeek = useCallback(
    (timeInSeconds: number) => {
      if (!isRefObject(videoRef) || !videoRef.current || isLoading) return;
      const safeTime = Math.max(0, timeInSeconds);
      transportRef.current.seconds = safeTime;
      videoRef.current.seekTo(safeTime, "seconds");
    },
    [videoRef, isLoading],
  );

  useEffect(() => {
    // This effect updates the mute state of audio players based on the isTargetActive flag
    if (!isRefObject(videoRef) || !videoRef.current || isLoading) return;

    for (const player of playersRef.current) {
      player.mute = !isTargetActive;
    }
    if (bgmPlayerRef.current) {
      bgmPlayerRef.current.mute = !isTargetActive;
    }
  }, [videoRef, isLoading, isTargetActive]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    //this effect updates the players when the segments change
    //currently if any of the segment changes, we're disposing ALL
    //players and recreating them. Ideally we swap out the right ones #skillissue
    if (segments.length === 0) return;

    const wasPlaying = isPlaying;

    if (wasPlaying) {
      handlePause();
    }
    setIsLoading(true);

    // Dispose of existing players
    for (const player of playersRef.current) {
      player.dispose();
    }
    playersRef.current = [];

    const newPlayers = segments
      .map((segment) => {
        const duration = segment.endTime - segment.startTime;
        if (segment.audioUrl && duration > 0) {
          const player = new Tone.Player(segment.audioUrl).toDestination();
          player.sync().start(segment.startTime).stop(segment.endTime);
          return player;
        }
        return null;
      })
      .filter((player): player is Tone.Player => player !== null);

    playersRef.current = newPlayers;

    if (projectBGMAudioUrl && !bgmPlayerLoadedRef.current) {
      const bgmPlayer = new Tone.Player(projectBGMAudioUrl).toDestination();
      bgmPlayerRef.current = bgmPlayer;
      bgmPlayer.sync().start(0);
    }

    // Check the .loaded state of all players
    const checkPlayersReady = () => {
      //note, there are probably a better way to check if all players are loaded
      const allPlayersLoaded = newPlayers.every((player) => player.loaded);
      const bgmPlayerLoaded = projectBGMAudioUrl
        ? bgmPlayerRef.current?.loaded
        : true;

      if (allPlayersLoaded && bgmPlayerLoaded) {
        bgmPlayerLoadedRef.current = true;
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
        if (wasPlaying) {
          handlePlay();
        }
      } else {
        setTimeout(checkPlayersReady, 100); // Check again after a short delay
      }
    };
    checkPlayersReady();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(transportRef.current.seconds);
    }, 1000 / 60);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Cleanup function to be called when the component unmounts
    return () => {
      // Stop and dispose all players
      for (const player of playersRef.current) {
        const currentTime = Math.max(0, Tone.now());
        player.stop(currentTime);
        player.dispose();
      }
      if (bgmPlayerRef.current) {
        bgmPlayerRef.current.dispose();
      }
      // Optionally reset the Tone.Transport if it's shared
      transportRef.current.stop();
      transportRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    setAudioTrackState({
      play: handlePlay,
      pause: handlePause,
      seek: handleSeek,
      isPlaying,
      currentTime,
      isLoading,
    });
  }, [
    handlePlay,
    handlePause,
    handleSeek,
    isPlaying,
    currentTime,
    isLoading,
    setAudioTrackState,
  ]);
};

function isRefObject(ref: any): ref is React.RefObject<ReactPlayer> {
  return ref && typeof ref === "object" && "current" in ref;
}
