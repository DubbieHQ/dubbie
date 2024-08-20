import { v4 as uuidv4 } from "uuid"; // Import uuidv4 from the uuid package
import { atom } from "jotai";
import { ProjectWithTracksAndSegments } from "@/lib/types";
import {
  DEFAULT_PROJECT_STATE,
  PLACEHOLDER_TEXT,
  UPSCALE_FACTOR,
} from "./constants";
import { atomFamily } from "jotai/utils";
import { focusAtom } from "jotai-optics";
import ReactPlayer from "react-player";
import { LegacyRef } from "react";
import { createSegment } from "./actions/createSegment";
import { Project, Segment } from "@dubbie/db";
import { updateProjectName } from "./actions/updateProjectName";
import { getDefaultVoiceForLanguage } from "@dubbie/shared/languages";
import { fetchProject } from "./actions/fetchProject";

type ActiveTracks = {
  original: boolean;
  target: boolean;
};

//all projects
export const projectsAtom = atom<Project[]>([]);

//individual project
export const projectsAtomFamily = atomFamily((projectId: string) =>
  focusAtom(projectsAtom, (optics) =>
    optics.find((project) => project.id === projectId),
  ),
);

//project with tracks and segments
export const projectInEditorAtom = atom<ProjectWithTracksAndSegments>(
  DEFAULT_PROJECT_STATE,
);

export const projectNameAtom = atom(
  (get) => get(projectInEditorAtom).name,
  (get, set, newName: string) => {
    const currentProject = get(projectInEditorAtom);
    if (currentProject.name !== newName) {
      set(projectInEditorAtom, { ...currentProject, name: newName });
      updateProjectName(currentProject.id, newName); // Call the external function
    }
  },
);
export const fetchAndUpdateProjectAtom = atom(
  null,
  async (get, set, projectId: string) => {
    try {
      console.log("fetching and updating");
      const updatedProject = await fetchProject(projectId);
      set(projectsAtomFamily(projectId), updatedProject);
      set(projectInEditorAtom, updatedProject);
    } catch (error) {
      console.error("Failed to fetch project:", error);
    }
  },
);

export const projectStatusAtom = atom((get) => get(projectInEditorAtom).status);
export const projectBGMAudioUrlAtom = atom(
  (get) => get(projectInEditorAtom).extractedBackgroundAudioUrl,
);

export const originalTrackSegmentsAtom = atom((get) => {
  const project = get(projectInEditorAtom);
  const originalTrack = project.tracks.find(
    (track) => track.language === "original",
  );
  const segments = originalTrack?.segments;
  return segments || [];
});

export const translatedTrackSegmentsAtom = atom((get) => {
  const project = get(projectInEditorAtom);
  const translatedTrack = project.tracks.find(
    (track) => track.language !== "original",
  );
  const segments = translatedTrack?.segments;
  return segments || [];
});

export const translatedTrackLanguageAtom = atom((get) => {
  const project = get(projectInEditorAtom);
  const translatedTrack = project.tracks.find(
    (track) => track.language !== "original",
  );
  return translatedTrack?.language;
});

export const segmentAtomFamily = atomFamily((segmentId: string) =>
  focusAtom(
    projectInEditorAtom,
    (optics) =>
      optics
        .prop("tracks") // Focus on the tracks array
        .find((track) =>
          track.segments.some((segment) => segment.id === segmentId),
        ) // Find the track containing the segment
        .prop("segments") // Focus on the segments array of the found track
        .find((segment) => segment.id === segmentId), // Find the specific segment by id
  ),
);

export const deleteSegmentAtom = atom(null, (get, set, segmentId: string) => {
  const project = get(projectInEditorAtom);
  const updatedTracks = project.tracks.map((track) => ({
    ...track,
    segments: track.segments.filter((segment) => segment.id !== segmentId),
  }));
  set(projectInEditorAtom, { ...project, tracks: updatedTracks });
});

export const projectOriginalUrlAtom = atom(
  (get) => get(projectInEditorAtom).originalUrl,
);

export const activeTracksAtom = atom<ActiveTracks>({
  original: false,
  target: true,
});

export const audioPlayerStateAtom = atom({
  play: () => {},
  pause: () => {},
  seek: (timeInSeconds: number) => {},
  isPlaying: false,
  currentTime: 0,
  isLoading: true,
});
export const seekAtom = atom((get) => get(audioPlayerStateAtom).seek);
export const isAudioPlayingAtom = atom(
  (get) => get(audioPlayerStateAtom).isPlaying,
);
export const isAudioLoadingAtom = atom(
  (get) => get(audioPlayerStateAtom).isLoading,
);
export const audioPlayerCurrentTimeAtom = atom(
  (get) => get(audioPlayerStateAtom).currentTime,
);

export const projectTargetLanguageAtom = atom(
  (get) => get(projectInEditorAtom).targetLanguage,
);

export const videoRefAtom = atom<LegacyRef<ReactPlayer> | undefined>(undefined);

export const createSegmentAtom = atom(
  null,
  (get, set, providedStartTime?: number) => {
    const project = get(projectInEditorAtom);

    const translatedTrack = get(projectInEditorAtom).tracks.find(
      (track) => track.language !== "original",
    );

    if (!translatedTrack) {
      throw new Error("Translated track not found");
    }
    const startTime =
      providedStartTime !== undefined
        ? providedStartTime
        : get(containerScrollLeftAtom) / UPSCALE_FACTOR + 0.1;

    const defaultVoice = getDefaultVoiceForLanguage(translatedTrack.language);

    const PLACEHOLDER_SEGMENT: Segment = {
      id: uuidv4(),
      index: 0,
      startTime: startTime,
      endTime: startTime + 4,
      text: PLACEHOLDER_TEXT,
      audioUrl: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      trackId: translatedTrack.id,
      voiceName: defaultVoice.name,
      voiceProvider: defaultVoice.provider,
    };

    createSegment(PLACEHOLDER_SEGMENT);

    const updatedTracks = project.tracks.map((track) => {
      if (track.language !== "original") {
        return {
          ...track,
          segments: [...track.segments, PLACEHOLDER_SEGMENT],
        };
      }
      return track;
    });
    set(projectInEditorAtom, { ...project, tracks: updatedTracks });
  },
);

export const containerScrollLeftAtom = atom<number>(0);
