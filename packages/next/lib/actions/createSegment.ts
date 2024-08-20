"use server";

import { Segment, prisma } from "@dubbie/db";

export async function createSegment(segment: Segment) {
  await prisma.segment.create({
    data: segment,
  });
}
