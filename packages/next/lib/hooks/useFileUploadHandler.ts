import { useState, useRef } from "react";
import { toast } from "sonner";
import { useFileUpload } from "@/lib/hooks/useFileUpload";
import { determineMediaType } from "@/lib/mediaUtils";
import { fetchUserSubscriptionInfo } from "@/lib/actions/fetchSubscriptionInfo";
import { getMediaDurationFromFile } from "@/lib/mediaUtils";

export const useFileUploadHandler = () => {
  const { uploadFileToFirebase, isUploading } = useFileUpload();
  const [url, setUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const fileRef = useRef<File | null>(null);

  const handleUpload = async (file: File) => {
    fileRef.current = file;

    const subscriptionInfo = await fetchUserSubscriptionInfo();
    const mediaDurationInSeconds = await getMediaDurationFromFile(file);
    const mediaDurationInMinutes = Math.ceil(mediaDurationInSeconds / 60);

    if (subscriptionInfo.remainingCredits < mediaDurationInMinutes) {
      toast.error(
        `You do not have enough credits for this file. Remaining credits: ${subscriptionInfo.remainingCredits}, Cost: ${mediaDurationInMinutes} minutes.`,
      );
      return;
    }

    const fileType = determineMediaType(file.type);
    if (!fileType) {
      toast.error("Unsupported file type");
      return;
    }

    const downloadUrl = await uploadFileToFirebase(file);
    if (downloadUrl) setUrl(downloadUrl);

    if (fileType === "VIDEO") {
      setThumbnailUrl(""); // Clear the thumbnail URL
      toast.info("Please re-upload the file to generate a new thumbnail.");
    } else {
      setThumbnailUrl("/placeholderBlob.png");
    }
  };

  return {
    handleUpload,
    isUploading,
    url,
    thumbnailUrl,
    fileRef,
  };
};
