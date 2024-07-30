// useRegenerateAudio.ts
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  deleteSegmentAtom,
  segmentAtomFamily,
  translatedTrackLanguageAtom,
} from "@/lib/atoms";
import { generateAudioAndUpdateDB } from "@/lib/actions/generateAudioAndUpdateSegment";
import { deleteSegment } from "@/lib/actions/deleteSegment";
import { useCallback, useState } from "react";
import { Voice } from "@dubbie/shared/voices";

export const useSegmentRegenerate = (segmentId: string) => {
  const [segment, setSegment] = useAtom(segmentAtomFamily(segmentId));
  const removeSegment = useSetAtom(deleteSegmentAtom);
  const translatedTrackLanguage = useAtomValue(translatedTrackLanguageAtom);
  const [isRegeneratingAudio, setIsRegeneratingAudio] = useState(false);

  const regenerateAudio = useCallback(
    async (newText: string, voice?: Voice) => {
      if (!segment || !translatedTrackLanguage) return;

      setIsRegeneratingAudio(true);

      try {
        if (!newText) {
          removeSegment(segment.id);
          await deleteSegment(segment.id);
          return;
        }

        console.log("newText", newText);
        const updatedSegment = await generateAudioAndUpdateDB({
          segment: {
            ...segment,
            text: newText,
            ...(voice && {
              voiceName: voice.name,
              voiceProvider: voice.provider,
            }),
          },
        });

        setSegment(updatedSegment);
      } finally {
        setIsRegeneratingAudio(false);
      }
    },
    [segment, translatedTrackLanguage, setSegment, removeSegment],
  );
  return { regenerateAudio, isRegeneratingAudio };
};
