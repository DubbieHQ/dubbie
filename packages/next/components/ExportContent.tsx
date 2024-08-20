"use client";

import React, { useEffect, useState } from "react";
import { DownloadExportButton } from "@/components/elements/buttons/DownloadExportButton";
import { fetchProject } from "@/lib/actions/fetchProject";
import { ExportStatus, MediaType } from "@dubbie/db";
import ReactPlayer from "react-player";
import useWindowSize from "@/lib/hooks/useWindowSize";
import { Spinner } from "./ui/Spinner";

interface ExportStatusDisplayProps {
  exportType: MediaType;
  exportStatus: ExportStatus;
  exportedUrl: string | null;
  projectName: string;
  projectId: string;
}

const ExportContent: React.FC<ExportStatusDisplayProps> = ({
  exportType,
  exportStatus: initialExportStatus,
  exportedUrl: initialExportedUrl,
  projectName: initialProjectName,
  projectId,
}) => {
  const [exportStatus, setExportStatus] = useState(initialExportStatus);
  const [exportedUrl, setExportedUrl] = useState(initialExportedUrl);
  const [projectName, setProjectName] = useState(initialProjectName);
  const { hasWindow } = useWindowSize();

  useEffect(() => {
    const fetchAndUpdateStatus = async () => {
      try {
        console.log("Polling for project status");
        const project = await fetchProject(projectId);
        setExportStatus(project.exportStatus);
        setProjectName(project.name);
        setExportedUrl(project.exportedUrl);

        if (project.exportStatus !== "EXPORTED") {
          setTimeout(fetchAndUpdateStatus, 2000);
        }
      } catch (error) {
        // Handle error silently
      }
    };

    fetchAndUpdateStatus();

    return () => {
      // Cleanup function
    };
  }, [projectId]);

  const renderExporting = () => (
    <div className="flex w-80 flex-col items-center gap-3">
      <Spinner size="medium" />
      <div className="font-semibold text-black">
        Exporting {exportType === "AUDIO" ? "audio" : "video"} file...
      </div>
      <div className="text-center opacity-50">
        This may take a couple of minutes depending on how long the content is!
      </div>
    </div>
  );

  const renderNotStarted = () => (
    <div className="flex w-80 flex-col items-center gap-3">
      <div className="font-semibold text-black">Export not started</div>
      <div className="text-center opacity-50">
        Please go to the editor and initiate the export process!
      </div>
    </div>
  );

  const renderExported = () => (
    <div className="flex flex-col gap-4">
      <div className="min-h-[200px] w-[700px] overflow-hidden rounded-xl">
        <ReactPlayer
          url={exportedUrl || ""}
          controls={true}
          width="100%"
          height="100%"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="italic text-black text-opacity-50">{projectName}</div>
        <div className="opacity-100">
          {exportType === "AUDIO" ? (
            <>
              <DownloadExportButton
                link={exportedUrl || ""}
                filename={`${projectName || "Untitled"} - dubbed by Dubbie.mp3`}
              />
            </>
          ) : (
            <>
              <DownloadExportButton
                link={exportedUrl || ""}
                filename={`${projectName || "Untitled"} - dubbed by Dubbie.mp4`}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="flex w-80 flex-col items-center gap-3">
      <div className="font-semibold text-black">Error exporting file</div>
      <div className="text-center opacity-50">
        Please try again later or contact support.
        <br />
        Really sorry about this :(
      </div>
    </div>
  );

  if (!hasWindow) {
    return null;
  }

  const renderContent = () => {
    switch (exportStatus) {
      case "EXPORTING":
        return renderExporting();
      case "NOT_STARTED":
        return renderNotStarted();
      case "EXPORTED":
        return renderExported();
      case "ERROR":
        return renderError();
      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
};

export default ExportContent;
