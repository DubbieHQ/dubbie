import { prisma, type ProjectStatus } from "@dubbie/db";

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
) {
  console.log(`🔄 Updating project status to ${status}...`);
  await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      status,
    },
  });
}
