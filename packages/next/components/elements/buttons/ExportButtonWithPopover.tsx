"use client";

import { MediaType } from "@dubbie/db";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/elements/buttons/DefaultButton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { startMediaExport } from "@/lib/apis/startMediaExport";
import { setExportStatus } from "@/lib/actions/setExportStatus";
import { projectInEditorAtom } from "@/lib/atoms";
import { useAtomValue } from "jotai";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/Spinner";
import { Switch } from "@/components/ui/switch";

const exportFormats = ["AUDIO", "VIDEO"];

export function ExportButtonWithPopover() {
  const project = useAtomValue(projectInEditorAtom);
  const exportDisabled = project.status !== "COMPLETED";
  const [format, setFormat] = useState<MediaType>(project.originalMediaType);
  const router = useRouter();

  const [includeBGM, setIncludeBGM] = useState(
    project.extractBackgroundAudio || !!project.extractedBackgroundAudioUrl,
  );

  const [isLoading, setIsLoading] = useState(false);

  const onSelectFormat = (format: MediaType) => {
    setFormat(format);
  };

  const onExport = () => {
    setIsLoading(true);
    setExportStatus(project.id, "EXPORTING", format);
    startMediaExport(project.id, format, includeBGM);
    router.push(`/exports/${project.id}`);
  };
  const onViewExport = () => {
    router.push(`/exports/${project.id}`);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button className="gap-2" size="small" disabled={exportDisabled}>
          <div className="text-sm">Export</div>{" "}
          <ChevronDown size={18} opacity={0.7} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-8 mt-1 flex w-[300px] flex-col rounded-2xl  py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm opacity-50">Format</div>

          <Select
            defaultValue={project.originalMediaType}
            onValueChange={(value: MediaType) => {
              onSelectFormat(value);
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="font-medium opacity-50">
                  Format
                </SelectLabel>
                {exportFormats.map((option) => (
                  <SelectItem key={option} value={option}>
                    {capitalizeMediaType(option)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Tooltip>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center ">
              <label
                htmlFor="Background Sound"
                className="text-sm leading-none opacity-50"
              >
                Background Sounds
              </label>
              <TooltipTrigger asChild>
                <HelpCircle size={16} className="ml-1.5 opacity-50" />
              </TooltipTrigger>
            </div>

            <Switch
              id="includeBGM"
              checked={includeBGM}
              onCheckedChange={setIncludeBGM}
            />
          </div>
          <TooltipContent className="max-w-[300px]">
            In videos where there are background music or sound effects, we can
            extract them and add them to the exported audio file.
            <br />
            <br />
            If your video does not have any of those, it's best to untoggle this
            option. It will reduce potential noise and greatly speed up the
            initialization process!
          </TooltipContent>
        </Tooltip>

        {project.exportedUrl && (
          <Button
            className="mt-4 text-sm font-semibold"
            size="small"
            variant="secondary"
            onClick={onViewExport}
          >
            View Export
          </Button>
        )}
        <Button
          className="mt-3 gap-2 text-sm font-semibold"
          size="small"
          onClick={onExport}
        >
          {isLoading ? <Spinner size="small" color="text-white" /> : "Export"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function capitalizeMediaType(mediaType: string): string {
  return mediaType.charAt(0).toUpperCase() + mediaType.slice(1).toLowerCase();
}
