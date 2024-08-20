"use client";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/elements/buttons/DefaultButton";
import { Spinner } from "../ui/Spinner";
import { FileUploader } from "./FileUploader";
import type { AcceptedLanguage } from "@dubbie/db";
import { useProjectCreation } from "@/lib/hooks/useProjectCreation";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { ChevronRight } from "lucide-react";

import { useEffect, useRef } from "react";
import { Line } from "../elements/Line";
import { LanguageSelector } from "./LanguageSelector";
import { VoiceProfileSection } from "./VoiceProfileSection";
import { ExtractBGMSection } from "./ExtractBGMSection";

export default function CreateProjectButtonAndModal() {
  const [url, setUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] =
    useState<AcceptedLanguage | null>(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedVoiceName, setSelectedVoiceName] = useState<
    string | undefined
  >(undefined);

  const { handleCreateProject, loading } = useProjectCreation();
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const [extractBGM, setExtractBGM] = useState(false);

  useEffect(() => {
    if (isAdvancedOpen && dialogContentRef.current) {
      dialogContentRef.current.scrollTo({
        top: dialogContentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [isAdvancedOpen]);

  function onClickCreateProject() {
    if (!url || !file || !selectedLanguage) {
      toast.info(
        !url
          ? "Please upload a file"
          : !selectedLanguage
            ? "Please select a target language"
            : "Please upload a file",
      );
      return;
    }

    handleCreateProject({
      url,
      thumbnailUrl,
      file,
      targetLanguage: selectedLanguage,
      userSelectedVoice: selectedVoiceName,
      extractBackgroundAudio: extractBGM,
    });
  }

  const handleUploadComplete = (
    uploadedUrl: string,
    thumbnailUrl: string,
    uploadedFile: File,
  ) => {
    setUrl(uploadedUrl);
    setThumbnailUrl(thumbnailUrl);
    setFile(uploadedFile);
  };

  function handleDialogInteractOutside(e: any) {
    const { originalEvent } = e.detail;
    if (
      originalEvent.target instanceof Element &&
      originalEvent.target.closest(".group.toast")
    ) {
      e.preventDefault();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create a New Project</Button>
      </DialogTrigger>

      <DialogContent
        ref={dialogContentRef}
        className="flex h-[550px] max-w-[500px] grow-0 flex-col items-start gap-8 overflow-y-scroll px-8 py-8 shadow-c"
        style={{
          scrollbarWidth: "none",
        }}
        onInteractOutside={handleDialogInteractOutside}
      >
        <div className="text-md w-full text-center font-medium opacity-70">
          Create Project
        </div>

        <FileUploader onUploadComplete={handleUploadComplete} />

        <LanguageSelector
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />

        {/* row - advanced + create project button */}
        <div className="flex w-full items-center justify-between">
          <div
            className="flex cursor-pointer items-center text-sm opacity-50 hover:opacity-30"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          >
            Advanced
            <ChevronRight
              size={16}
              className={`ml-1.5 transition-all ${isAdvancedOpen ? "rotate-90" : ""}`}
            />
          </div>

          <Button
            size="small"
            onClick={() => {
              onClickCreateProject();
            }}
            className="w-[140px]"
          >
            {loading ? (
              <Spinner size="small" color="text-white" />
            ) : (
              "Create Project"
            )}
          </Button>
        </div>

        {/* advanced options */}
        {isAdvancedOpen && (
          <>
            <Line orientation="horizontal" />
            <div className="flex w-full flex-col gap-8">
              <VoiceProfileSection
                setSelectedVoiceName={setSelectedVoiceName}
              />
              <ExtractBGMSection
                extractBGM={extractBGM}
                setExtractBGM={setExtractBGM}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
