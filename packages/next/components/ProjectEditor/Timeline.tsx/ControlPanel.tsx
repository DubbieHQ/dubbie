import {
  activeTracksAtom,
  audioPlayerStateAtom,
  projectTargetLanguageAtom,
  isAudioLoadingAtom,
} from "@/lib/atoms";
import { useAtomValue, useAtom } from "jotai";
import { Pause, PlayIcon } from "lucide-react";
import { Line } from "../../elements/Line";
import { Checkbox } from "@/components/ui/checkbox";
import AddSegmentButton from "@/components/elements/buttons/AddSegmentButton";
import { Spinner } from "@/components/ui/Spinner";

export function ControlPanel() {
  const targetLanguage = useAtomValue(projectTargetLanguageAtom);
  const [activeTracks, setActiveTracks] = useAtom(activeTracksAtom);
  const { play, pause, isPlaying } = useAtomValue(audioPlayerStateAtom);
  const isLoadingAudio = useAtomValue(isAudioLoadingAtom);

  return (
    <div className="relative w-44 flex-shrink-0">
      {/* play/pause button */}
      <div className="h-control-height center">
        {isLoadingAudio ? (
          <Spinner size="small" />
        ) : isPlaying ? (
          <div
            className="cursor-pointer rounded-xl p-2 text-zinc-500 hover:bg-btn-focused"
            onClick={pause}
          >
            <Pause size={16} />
          </div>
        ) : (
          <div
            className="cursor-pointer rounded-xl p-2 hover:bg-btn-focused"
            onClick={play}
          >
            <PlayIcon
              size={16}
              fill="black"
              color="black"
              style={{ opacity: 0.7 }}
            />
          </div>
        )}
      </div>

      <Line />

      <div className="relative h-track-height gap-2 center">
        <Checkbox
          id="original"
          className="border-neutral-300 bg-btn"
          checked={activeTracks.original}
          onCheckedChange={(checked) => {
            setActiveTracks((prevActiveTracks) => ({
              ...prevActiveTracks,
              original: !!checked,
            }));
          }}
        />
        <label
          htmlFor="original"
          className="cursor-pointer select-none text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          style={{
            opacity: activeTracks.original ? 1 : 0.5,
          }}
        >
          Original
        </label>
      </div>

      <Line />

      <div className="relative h-track-height gap-2 center">
        <Checkbox
          id="target"
          className="border-neutral-300 bg-btn"
          checked={activeTracks.target}
          onCheckedChange={(checked) => {
            setActiveTracks((prevActiveTracks) => ({
              ...prevActiveTracks,
              target: !!checked,
            }));
          }}
        />
        <label
          htmlFor="target"
          className="cursor-pointer select-none text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          style={{
            opacity: activeTracks.target ? 1 : 0.5,
          }}
        >
          {capitalizeFirstLetter(targetLanguage)}
        </label>

        <AddSegmentButton />
      </div>
    </div>
  );
}

function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
