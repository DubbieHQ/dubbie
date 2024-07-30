"use server";

import { prisma } from "@dubbie/db";
import { deleteFirebaseFile } from "@dubbie/shared/services/deleteFirebaseFile";

export const deleteProject = async (projectId: string) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("Project not found");

  // Find all track IDs related to the project
  const tracks = await prisma.track.findMany({
    where: { projectId: projectId },
    select: { id: true },
  });

  const trackIds = tracks.map((track) => track.id);

  // Prepare the queries for the transaction
  const queries = [
    prisma.segment.deleteMany({
      where: {
        trackId: { in: trackIds },
      },
    }),
    prisma.track.deleteMany({
      where: {
        projectId: projectId,
      },
    }),
    prisma.project.update({
      where: { id: projectId },
      data: {
        name: "",
        isDeleted: true,
        exportedUrl: null,
        exportType: null,
        extractedBackgroundAudioUrl: null,
        originalLanguage: null,
        targetLanguage: "english",
      },
    }),
  ];

  // Execute the transaction
  try {
    await prisma.$transaction(queries);

    // Delete files from Firebase after the transaction
    if (project.originalUrl) deleteFirebaseFile(project.originalUrl);
    if (project.thumbnailUrl) deleteFirebaseFile(project.thumbnailUrl);
    if (project.exportedUrl) deleteFirebaseFile(project.exportedUrl);
    if (project.extractedBackgroundAudioUrl)
      deleteFirebaseFile(project.extractedBackgroundAudioUrl);

    console.log("Transaction succeeded");
  } catch (error) {
    console.error("Transaction failed:", error);
  }
};
