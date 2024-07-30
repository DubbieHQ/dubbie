import { useState } from "react";
import { storage } from "@dubbie/shared/clients/firebaseApp";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "sonner";

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFileToFirebase = async (
    file: File,
    showToast = true,
  ): Promise<string | undefined> => {
    setIsUploading(true);
    const uniqueFileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `uploads/${uniqueFileName}`);

    try {
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      if (showToast) {
        toast("File uploaded successfully!");
      }
      return downloadURL;
    } catch (error) {
      if (showToast) {
        toast("Error uploading file");
      }
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFileToFirebase, isUploading };
};
