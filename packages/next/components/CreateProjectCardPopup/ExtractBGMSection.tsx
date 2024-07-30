import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Switch } from "../ui/switch";

export function ExtractBGMSection({
  extractBGM,
  setExtractBGM,
}: {
  extractBGM: boolean;
  setExtractBGM: (value: boolean) => void;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center text-sm">
        <Tooltip>
          <span className="flex items-center opacity-50">
            Extract Background Sounds
          </span>
          <TooltipTrigger asChild>
            <HelpCircle size={16} className="ml-1.5 opacity-50" />
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px]" side="top" align="center">
            In videos where there are background music or sound effects, we can
            extract them and add them to the exported audio file.
            <br />
            <br />
            If your video does not have any of those, it's best to untoggle this
            option. It will reduce potential noise and greatly speed up the
            initialization process!
          </TooltipContent>
        </Tooltip>
      </div>
      <Switch
        id="extract-background-sounds"
        checked={extractBGM}
        onCheckedChange={setExtractBGM}
      />
    </div>
  );
}
