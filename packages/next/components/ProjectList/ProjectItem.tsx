"use client";
import { ArrowRight, LucideLoader, LucideX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { ProjectItemMoreOptionsButton } from "./ProjectItemMoreOptionsButton";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { projectsAtomFamily } from "@/lib/atoms";
import { useAtom } from "jotai";
import { fetchProject } from "@/lib/actions/fetchProject";

// Component to display individual project details
const ProjectItem = ({ projectId }: { projectId: string }) => {
  const [project, setProject] = useAtom(projectsAtomFamily(projectId));

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!project) return;
    if (project.status === "COMPLETED" || project.status === "FAILED") return;

    const intervalId = setInterval(async () => {
      const updatedProject = await fetchProject(projectId);
      if (updatedProject.status !== project.status) {
        setProject(updatedProject);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [project?.status]);

  if (!project) return null;

  const isProcessingProject =
    project.status === "TRANSCRIBING" ||
    project.status === "FORMATTING" ||
    project.status === "TRANSLATING" ||
    project.status === "AUDIO_PROCESSING" ||
    project.status === "NOT_STARTED";

  return (
    <Link
      className="flex w-full flex-row items-center justify-between
        rounded-2xl border border-btn bg-btn py-3 pl-4 pr-6
        transition-all duration-200
        hover:brightness-[0.97]"
      href={`/editor/${project.id}`}
    >
      {/* Project thumbnail and title */}
      <div className="gap-4 center">
        <div className="relative h-14 w-20 rounded-lg">
          {isProcessingProject ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute -left-2 -top-2 z-10 h-6 w-6 rounded-full bg-white shadow-b center">
                  <LucideLoader size={14} className="animate-spin-slow" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                Your project is currently being processed.
                <br />
                Please be patient while Dubbie works its magic!
                <br />
                Dev note: last updated status is {project.status}
              </TooltipContent>
            </Tooltip>
          ) : project.status === "FAILED" ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute -left-2 -top-2 z-10 h-6 w-6 rounded-full bg-red-600 shadow-b center">
                  <LucideX size={14} color="white" strokeWidth={3} />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                Project failed.
                <br /> Please try again or contact support.
              </TooltipContent>
            </Tooltip>
          ) : null}
          {/* absolutely positioned status on top of thumbnail */}
          <Image
            src={project.thumbnailUrl || "/placeholderBlob.png"}
            alt={project.name}
            placeholder="blur"
            blurDataURL="/placeholderBlob.png"
            fill
            sizes="100px"
            style={{
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="line-clamp-1 w-48 text-ellipsis text-start">
          {project.name}
        </div>
      </div>

      {/* Language translation direction indicated with an arrow */}
      <div className="shrink-0 gap-4 center">
        <div className="line-clamp-1 w-20 text-end">
          {project.originalLanguage
            ? project.originalLanguage.charAt(0).toUpperCase() +
              project.originalLanguage.slice(1)
            : "Original"}
        </div>
        <ArrowRight size={16} />
        <div className="line-clamp-1 w-20 text-start">
          {project.targetLanguage.charAt(0).toUpperCase() +
            project.targetLanguage.slice(1)}
        </div>
      </div>

      {/* Display project creation date */}
      <div className="w-26 shrink-0 text-center opacity-50">
        {project.createdAt.toISOString().split("T")[0]}
      </div>

      {/* Buttons for downloading and editing project details */}
      <div className="flex items-center gap-2">
        <ProjectItemMoreOptionsButton projectId={project.id} />
      </div>
    </Link>
  );
};

export const MemoizedProjectItem = React.memo(ProjectItem);
