"use server";
import { prisma } from "@dubbie/db";

export async function updateProjectName(projectId: string, newName: string) {
  const project = await prisma.project.update({
    where: { id: projectId },
    data: { name: newName },
  });
  return project;
}
