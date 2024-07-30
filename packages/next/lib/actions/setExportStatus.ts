"use server";
import { ExportStatus, MediaType, prisma } from "@dubbie/db";

export async function setExportStatus(
  projectId: string,
  status: ExportStatus,
  exportType: MediaType,
) {
  await prisma.project.update({
    where: { id: projectId },
    data: { exportStatus: status, exportType: exportType },
  });
}
