"use server";
import { prisma } from "@dubbie/db";
import { ProjectWithTracksAndSegments } from "../types";

export const fetchProject = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tracks: {
        include: {
          segments: true,
        },
      },
    },
  });

  return project as ProjectWithTracksAndSegments;
};
