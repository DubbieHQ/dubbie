"use client";
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useFileUpload } from "@/lib/hooks/useFileUpload";
import { determineMediaType, getMediaDurationFromFile } from "@/lib/mediaUtils";
import Link from "next/link";
import UploadingStatus from "./UploadingStatus";
import Preview from "./Preview";
import { DropPlaceholderImage } from "./DropPlaceholderImage";
import useSubscriptionInfo from "@/lib/hooks/useSubscriptionInfo";
import { generateThumbnail } from "@/lib/generateThumbnail";

interface PreviewFile {
  preview: string;
  name: string;
  type: string;
}

export const FileUploader = ({
  onUploadComplete,
}: {
  onUploadComplete: (url: string, thumbnailUrl: string, file: File) => void;
}) => {
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { uploadFileToFirebase } = useFileUpload();

  const { data: subscriptionInfo } = useSubscriptionInfo();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles: File[]) => {
      setIsUploading(true);

      if (acceptedFiles.length > 1) {
        toast.error("Please drop only one file at a time.");
        setIsUploading(false);
        return;
      }

      const file = acceptedFiles[0];
      const supportedFormats = [
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/webm",
        "audio/mp3",
        "video/mp4",
        "video/webm",
        "video/ogg",
      ];

      if (supportedFormats.includes(file.type)) {
        setPreviewFile({
          preview: URL.createObjectURL(file),
          name: file.name,
          type: file.type,
        });

        const mediaDurationInSeconds = await getMediaDurationFromFile(file);
        const mediaDurationInMinutes = Math.ceil(mediaDurationInSeconds / 60);

        if (
          (subscriptionInfo?.remainingCredits ?? 0) < mediaDurationInMinutes
        ) {
          toast.error(
            <div>
              You do not have enough credits for this file. Remaining credits:{" "}
              {subscriptionInfo?.remainingCredits}, Cost:{" "}
              {mediaDurationInMinutes} credits. <br />
              <Link href="/pricing" className="cursor-pointer underline">
                Click here to upgrade.
              </Link>
            </div>,
          );
          setPreviewFile(null); // Remove the thumbnail
          setIsUploading(false);
          return;
        }

        const fileType = determineMediaType(file.type);
        if (!fileType) {
          toast.error("Unsupported file type");
          setIsUploading(false);
          return;
        }

        const downloadUrl = await uploadFileToFirebase(file, false);
        if (downloadUrl) {
          if (fileType === "VIDEO") {
            const thumbnailBlob = await generateThumbnail(file);
            const thumbnailUrl = await uploadFileToFirebase(
              thumbnailBlob,
              false,
            );
            onUploadComplete(downloadUrl, thumbnailUrl as string, file);
          } else {
            onUploadComplete(downloadUrl, "/placeholderBlob.png", file);
          }
          setIsUploaded(true);
        }
      } else {
        toast.error("Unsupported file format");
      }
      setIsUploading(false);
    },
  });

  useEffect(() => {
    // Clean up the preview URL to avoid memory leaks
    return () => {
      if (previewFile) {
        URL.revokeObjectURL(previewFile.preview);
      }
    };
  }, [previewFile]);

  const resetFileInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setPreviewFile(null);
    setIsUploaded(false);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="text-sm opacity-50">Upload Video or Audio</div>
      <div
        {...getRootProps()}
        className={`relative h-64 w-full ${isUploaded ? "cursor-default" : "cursor-pointer"} overflow-hidden rounded-2xl border border-btn bg-white transition duration-200 center ${isDragActive ? "brightness-90" : "hover:brightness-[0.97]"}`}
      >
        <input {...getInputProps()} ref={inputRef} disabled={isUploaded} />

        {isUploading ? (
          <UploadingStatus />
        ) : previewFile ? (
          <Preview
            previewFile={previewFile}
            isUploaded={isUploaded}
            resetFileInput={resetFileInput}
          />
        ) : (
          <DropPlaceholderImage />
        )}
      </div>
    </div>
  );
};
