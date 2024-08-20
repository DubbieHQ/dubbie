"use client";
// Segment.tsx

import React from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  createSegmentAtom,
  deleteSegmentAtom,
  segmentAtomFamily,
} from "@/lib/atoms";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  AudioLinesIcon,
  PlusIcon,
  Trash2Icon,
  Volume2Icon,
} from "lucide-react";
import { ALL_VOICES, Voice } from "@dubbie/shared/voices";
import { deleteSegment } from "@/lib/actions/deleteSegment";
import { AudioPlayerIcon } from "@/components/CreateProjectCardPopup/AudioPlayerIcon";

interface ContextMenuWrapperProps {
  segmentId: string;
  onVoiceSelected: (voice?: Voice) => void;
  children: React.ReactElement;
  isTranslatedSegment: boolean;
}

declare global {
  type CaretPosition = {
    offsetNode: Node;
    offset: number;
  };

  interface Document {
    caretPositionFromPoint?(x: number, y: number): CaretPosition;
  }
}

export const ContextMenuWrapper = ({
  onVoiceSelected,
  segmentId,
  children,
  isTranslatedSegment,
}: ContextMenuWrapperProps) => {
  const segment = useAtomValue(segmentAtomFamily(segmentId));
  const createSegment = useSetAtom(createSegmentAtom);
  const removeSegment = useSetAtom(deleteSegmentAtom);

  const handleAddSegment = () => {
    if (segment) {
      createSegment(segment.endTime);
    }
  };

  const handleDeleteSegment = () => {
    removeSegment(segmentId);
    deleteSegment(segmentId);
  };

  const handleChangeVoice = (voice: Voice) => {
    onVoiceSelected(voice);
  };

  if (!segment || !segment.text) return null;

  // Group voices by language
  const voicesByLanguage = ALL_VOICES.reduce(
    (acc, voice) => {
      const language = voice.language || "Unknown";
      if (!acc[language]) {
        acc[language] = [];
      }
      acc[language].push(voice);
      return acc;
    },
    {} as Record<string, Voice[]>,
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger disabled={!isTranslatedSegment}>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-[200px] grow-0 shadow-a">
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <AudioLinesIcon size={16} className="mr-2" />
            <span>Change Voice</span>
          </ContextMenuSubTrigger>
          <ContextMenuPortal>
            <ContextMenuSubContent
              sideOffset={8}
              alignOffset={-5}
              className="max-h-[500px] w-[150px] overflow-y-scroll pr-0"
              style={{ scrollbarColor: "rgba(0,0,0,0.2) transparent" }}
            >
              {Object.entries(voicesByLanguage).map(([language, voices]) => (
                <ContextMenuSub key={language}>
                  <ContextMenuSubTrigger>
                    <span className="capitalize">{language}</span>
                  </ContextMenuSubTrigger>
                  <ContextMenuPortal>
                    <ContextMenuSubContent sideOffset={8} alignOffset={-5}>
                      {voices.map((voice) => (
                        <div
                          key={voice.name}
                          className="flex flex-row items-center justify-start"
                        >
                          <ContextMenuItem
                            className="flex w-full flex-col flex-nowrap items-start justify-between"
                            onClick={() => handleChangeVoice(voice)}
                          >
                            <div>{voice.name}</div>
                            <div className="opacity-50">
                              {voice.gender} - {voice.provider}
                            </div>
                          </ContextMenuItem>
                          {voice.exampleSoundUrl && (
                            <AudioPlayerIcon
                              exampleSoundUrl={voice.exampleSoundUrl}
                            />
                          )}
                        </div>
                      ))}
                    </ContextMenuSubContent>
                  </ContextMenuPortal>
                </ContextMenuSub>
              ))}
            </ContextMenuSubContent>
          </ContextMenuPortal>
        </ContextMenuSub>
        <ContextMenuItem onClick={() => handleAddSegment()}>
          <PlusIcon size={16} className="mr-2" />
          <span>Add Segment After</span>
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => handleDeleteSegment()}
          className="text-red-500"
        >
          <Trash2Icon size={16} className="mr-2" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
