import { Spinner } from "@/components/ui/Spinner";
import React from "react";
const statusMessages: Record<ProjectStatus, string> = {
  NOT_STARTED: "Converting formats",
  TRANSCRIBING: "Transcribing the audio",
  FORMATTING: "Segmenting transcription",
  TRANSLATING: "Translating via LLM",
  AUDIO_PROCESSING: "Generating audio",
  COMPLETED: "Project is ready",
  FAILED:
    "An error occurred. This will not cost you any credits.\nPlease contact our support team at team@dubbie.com or try again.",
};

const statuses: ProjectStatus[] = [
  "NOT_STARTED",
  "TRANSCRIBING",
  "FORMATTING",
  "TRANSLATING",
  "AUDIO_PROCESSING",
];
import { ProjectStatus } from "@dubbie/db";
import { Button } from "../elements/buttons/DefaultButton";
import { initializeProject } from "@/lib/apis/initializeProject";
import { fetchAndUpdateProjectAtom } from "@/lib/atoms";
import { useSetAtom } from "jotai";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

function Status({
  projectStatus,
  projectId,
}: {
  projectStatus: ProjectStatus;
  projectId: string;
}) {
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchAndUpdateProject = useSetAtom(fetchAndUpdateProjectAtom);

  const handleRetry = () => {
    setIsLoading(true);
    void initializeProject(projectId).finally(() => {
      fetchAndUpdateProject(projectId);
      setIsLoading(false);
    });
  };

  if (projectStatus === "FAILED") {
    return (
      <div className="h-full w-full flex-col pb-14 center">
        <div className="mb-4 max-w-lg text-center text-base opacity-60">
          An error occurred. This will not cost you any credits. <br />
          Please contact our support team at team@dubbie.com or try again.
        </div>
        <Button
          onClick={() => {
            handleRetry();
          }}
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="small" color="text-white" /> : "Retry"}
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex-col pb-14 center">
      <div className="mb-4 text-base opacity-60">
        Setting up your project - this may take a few minutes...
      </div>

      <div className="space-y-2">
        {statuses.map((status, index) => (
          <StatusItem
            key={status}
            status={status}
            currentStatus={projectStatus}
            message={`${index + 1}. ${statusMessages[status]}`}
          />
        ))}
      </div>
    </div>
  );
}
export const MemoizedInitializationStatus = React.memo(Status);

const statusExplanations: Record<ProjectStatus, string> = {
  NOT_STARTED:
    "We're preparing your audio file for processing by converting it to the appropriate format. This can take a minute depending on the size of your file.",
  TRANSCRIBING:
    "We are using a speech-to-text(Whisper) model to convert your audio into text.",
  FORMATTING:
    "We're breaking down your transcripts into manageable segments/sentences, and then matching it with the correct timestamp for translation.",
  TRANSLATING:
    "We are using a LLM to translate your text into the target language sentence by sentence.",
  AUDIO_PROCESSING:
    "We're using speech to text models to convert your text back into audio! ",
  COMPLETED: "Your project is ready for review and download.",
  FAILED:
    "An unexpected error occurred during processing. Please try again or contact support.",
};

function StatusItem({
  status,
  currentStatus,
  message,
}: {
  status: ProjectStatus;
  currentStatus: ProjectStatus;
  message: string;
}) {
  const isActive = status === currentStatus;
  const opacity = isActive ? "70" : "30";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`text-md relative flex items-center opacity-${opacity} cursor-help`}
        >
          <div>{message}</div>
          {isActive && <Spinner size="small" className="ml-2" />}
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-[400px]">
        <p>{statusExplanations[status]}</p>
      </TooltipContent>
    </Tooltip>
  );
}
