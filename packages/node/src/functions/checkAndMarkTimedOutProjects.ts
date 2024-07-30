import { prisma } from "@dubbie/db";

export async function checkAndMarkTimedOutProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: { NOT: { status: { in: ["COMPLETED", "FAILED"] } } },
    });
    const now = new Date();

    for (const project of projects) {
      try {
        const projectTime = new Date(project.updatedAt);
        const timeDifference = (now.getTime() - projectTime.getTime()) / (1000 * 60); // time difference in minutes

        if (timeDifference > 30) {
          const newComment = project.comments
            ? `${project.comments}\nProject timed out`
            : "Project timed out";
          await prisma.project.update({
            where: { id: project.id },
            data: { status: "FAILED", comments: newComment }, // adding a comment indicating timeout
          });
        }
      } catch (error) {
        console.error(`Failed to process project with ID ${project.id}:`, error);
      }
    }
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }
}
