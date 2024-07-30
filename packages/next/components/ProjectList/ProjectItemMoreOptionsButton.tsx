"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProject } from "@/lib/actions/deleteProject";
import { initializeProject } from "@/lib/apis/initializeProject";
import { projectsAtom, projectsAtomFamily } from "@/lib/atoms";
import { useAtomValue, useSetAtom } from "jotai";
import {
  DownloadIcon,
  EyeIcon,
  MoreVerticalIcon,
  PencilIcon,
  RefreshCwIcon,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export const ProjectItemMoreOptionsButton = ({
  projectId,
}: {
  projectId: string;
}) => {
  const router = useRouter();
  const project = useAtomValue(projectsAtomFamily(projectId));
  const setProjects = useSetAtom(projectsAtom);
  const handleEdit = () => {
    router.push(`/editor/${projectId}`);
  };

  const handleDelete = () => {
    setProjects((prevProjects) =>
      prevProjects.filter((p) => p.id !== projectId),
    );
    deleteProject(projectId);
  };

  const handleView = () => {
    router.push(`/exports/${projectId}`);
  };
  const handleRetry = () => {
    void initializeProject(projectId as string);
    router.push(`/editor/${projectId}`);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="outline-none"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <div
          className="select-none rounded-full border border-transparent
          bg-btn p-1.5 outline-none center
          hover:border-btn hover:brightness-[0.97]
            active:brightness-[0.95]"
        >
          <MoreVerticalIcon size={18} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        className="w-[150px] "
      >
        <DropdownMenuItem onClick={handleEdit}>
          <PencilIcon size={16} className="mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleView}>
          <EyeIcon size={16} className="mr-2" />
          View export
        </DropdownMenuItem>
        {project?.status === "FAILED" && (
          <DropdownMenuItem onClick={handleRetry}>
            <RefreshCwIcon size={16} className="mr-2" />
            Retry
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleDelete} className="text-red-500">
          <Trash2Icon size={16} className="mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
