"use server";
import { Segment, prisma } from "@dubbie/db";

export async function updateSegment(
  segmentId: string,
  updatedSegment: Segment,
) {
  await prisma.segment.update({
    where: { id: segmentId },
    data: updatedSegment,
  });
}
