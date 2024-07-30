"use client";

import React, { useEffect } from "react";
import { MemoizedInitializationStatus } from "./Status";
import { ProjectWithTracksAndSegments } from "@/lib/types";
import { projectInEditorAtom } from "@/lib/atoms";
import { useHydrateAtoms } from "jotai/utils";
import { MemoizedEditorTopBar } from "./EditorTopBar";
import { useAudioTrack } from "@/lib/hooks/useAudioTrack";
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts";
import { MemoizedTimeline } from "./Timeline.tsx";
import { MemoizedVideoPlayer } from "./VideoPlayer";
import { useProjectStatus } from "@/lib/hooks/useProjectStatus";
import usePreventSwipeback from "@/lib/hooks/usePreventSwipeback";
import { useAtom } from "jotai";

export function ProjectEditor({
  project: initialProject,
}: {
  project: ProjectWithTracksAndSegments;
}) {
  useHydrateAtoms([[projectInEditorAtom, initialProject]]);

  const [projectInEditor, setProjectInEditor] = useAtom(projectInEditorAtom);
  useProjectStatus();
  useKeyboardShortcuts();
  useAudioTrack();
  usePreventSwipeback();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (projectInEditor.id !== initialProject.id) {
      setProjectInEditor(initialProject);
    }
  }, []);

  return (
    <div className="relative flex h-screen w-full grow-0 flex-col">
      <MemoizedEditorTopBar />

      <div className="flex w-full grow flex-col items-center justify-between">
        {projectInEditor.status !== "COMPLETED" ? (
          <MemoizedInitializationStatus
            projectStatus={projectInEditor.status}
            projectId={projectInEditor.id}
          />
        ) : (
          <>
            <MemoizedVideoPlayer />
            <MemoizedTimeline />
          </>
        )}
      </div>
    </div>
  );
}
