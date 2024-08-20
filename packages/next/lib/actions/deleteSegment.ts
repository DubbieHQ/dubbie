"use server";
import { prisma } from "@dubbie/db";

export async function deleteSegment(segmentId: string) {
  await prisma.segment.delete({
    where: { id: segmentId },
  });
}
