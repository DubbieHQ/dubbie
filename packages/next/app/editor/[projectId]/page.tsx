import { prisma } from "@dubbie/db";
import { ProjectEditor } from "@/components/ProjectEditor";

export default async function ProjectEditorPage({
  params,
}: {
  params: { projectId: string };
}) {
  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
    include: {
      tracks: {
        include: {
          segments: true,
        },
      },
    },
  });

  if (!project) {
    return <div>No project found.</div>;
  }

  return <ProjectEditor project={project} />;
}
