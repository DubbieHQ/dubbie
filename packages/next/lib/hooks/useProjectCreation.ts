import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/actions/createProject";
import { initializeProject } from "@/lib/apis/initializeProject";
import { determineMediaType, getMediaDurationFromFile } from "@/lib/mediaUtils";
import { AcceptedLanguage } from "@dubbie/db";
import { getDefaultVoiceForLanguage } from "@dubbie/shared/languages";
import { ALL_VOICES } from "@dubbie/shared/voices";

export const useProjectCreation = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateProject = async ({
    url,
    thumbnailUrl,
    file,
    targetLanguage,
    userSelectedVoice,
    extractBackgroundAudio,
  }: {
    url: string;
    thumbnailUrl: string;
    file: File;
    targetLanguage: AcceptedLanguage;
    userSelectedVoice?: string;
    extractBackgroundAudio?: boolean;
  }) => {
    const toastId = toast.loading("Creating project...");
    setLoading(true);
    const originalMediaType = determineMediaType(file.type);
    const name = file.name;
    const audioDurationInSeconds = await getMediaDurationFromFile(file);
    let voiceName;
    let voiceProvider;

    if (userSelectedVoice) {
      const voice = ALL_VOICES.find((v) => v.name === userSelectedVoice);
      if (voice) {
        voiceName = voice.name;
        voiceProvider = voice.provider;
      } else {
        toast.error("Selected voice not found. Please choose a valid voice.");
        setLoading(false);
        return;
      }
    } else {
      const defaultVoice = getDefaultVoiceForLanguage(targetLanguage);
      voiceName = defaultVoice.name;
      voiceProvider = defaultVoice.provider;
    }

    try {
      const { projectId, error } = await createProject({
        url,
        name,
        targetLanguage,
        thumbnailUrl,
        originalMediaType,
        audioDurationInSeconds,
        voiceName,
        voiceProvider,
        extractBackgroundAudio,
      });

      if (error) {
        if (error.code === "INSUFFICIENT_CREDITS") {
          toast.error(
            "Not enough credits. Please visit /pricing to purchase more.",
          );
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return;
      }
      void initializeProject(projectId as string);
      toast.dismiss(toastId);
      router.push(`/editor/${projectId}`);
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return {
    handleCreateProject,
    loading,
  };
};
