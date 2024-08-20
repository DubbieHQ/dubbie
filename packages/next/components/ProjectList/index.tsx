"use client";

import React, { useEffect } from "react";
import { MemoizedProjectItem } from "./ProjectItem";
import { Project } from "@dubbie/db";
import { projectsAtom } from "@/lib/atoms";
import { useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

interface ProjectListProps {
  projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects: initialProjects,
}) => {
  useHydrateAtoms([[projectsAtom, initialProjects]]);
  const [projects, setProjects] = useAtom(projectsAtom);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects, setProjects]);

  return (
    <div className="flex w-full flex-col gap-3  px-10 text-sm">
      {projects?.map((project) => (
        <MemoizedProjectItem key={project.id} projectId={project.id} />
      ))}
    </div>
  );
};

export default ProjectList;
