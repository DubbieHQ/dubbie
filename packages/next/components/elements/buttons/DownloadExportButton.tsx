"use client";
import { useState } from "react";
import { Button } from "@/components/elements/buttons/DefaultButton";
import axios from "axios";
import fileDownload from "js-file-download";
import { Spinner } from "@/components/ui/Spinner";

export function DownloadExportButton({
  link,
  filename = "download",
}: {
  link: string;
  filename?: string;
}) {
  const [initiatingDownload, setInitiatingDownload] = useState(false);

  const handleDownload = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setInitiatingDownload(true);
    try {
      const response = await axios.get(link, {
        responseType: "blob",
      });
      fileDownload(response.data, filename);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setInitiatingDownload(false);
    }
  };

  return (
    <Button
      className="w-72"
      onClick={handleDownload}
      disabled={initiatingDownload}
    >
      {initiatingDownload ? (
        <div className="flex items-center justify-center">
          <Spinner size="small" color="text-white" className="mr-2" />
          Downloading...
        </div>
      ) : (
        "Download File"
      )}
    </Button>
  );
}
