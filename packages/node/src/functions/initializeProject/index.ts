import { createOriginalTrack } from "./createOriginalTrack";
import { createTranslatedTrack } from "./createTranslatedTracks";
import { updateProjectStatus } from "./updateProjectStatus";
import { prisma } from "@dubbie/db";

export async function initializeProject(projectId: string) {
  try {
    console.log("starting initializeProject for projectId", projectId);
    await createOriginalTrack(projectId);
    await createTranslatedTrack(projectId);
  } catch (error) {
    console.log("Error initializing project:", error);
    updateProjectStatus(projectId, "FAILED");

    // Save the error message into the project's comments field
    try {
      if (error instanceof Error) {
        await prisma.project.update({
          where: { id: projectId },
          data: { comments: error.message },
        });
      } else {
        await prisma.project.update({
          where: { id: projectId },
          data: { comments: String(error) },
        });
      }
    } catch (updateError) {
      console.error(
        "Failed to update project comments with error message:",
        updateError,
      );
    }
  }
}
