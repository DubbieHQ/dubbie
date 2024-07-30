import ExportContent from "@/components/ExportContent";
import { Button } from "@/components/elements/buttons/DefaultButton";
import { prisma } from "@dubbie/db";

export default async function ExportPage({
  params,
}: {
  params: { projectId: string };
}) {
  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
  });

  if (!project) {
    return <div className="h-screen center">Sowie, no project found.</div>;
  }

  const exportStatus = project.exportStatus;
  const exportedUrl = project.exportedUrl;
  const exportType = project.exportType || "VIDEO";

  return (
    <div className="h-screen w-full center">
      <Button variant="secondary" className="absolute left-8 top-8" href="/">
        Home
      </Button>
      <Button
        variant="secondary"
        className="absolute right-8 top-8"
        href={`/editor/${project.id}`}
      >
        Edit project
      </Button>

      <ExportContent
        projectName={project.name}
        exportType={exportType}
        exportStatus={exportStatus}
        exportedUrl={exportedUrl}
        projectId={params.projectId}
      />
    </div>
  );
}
