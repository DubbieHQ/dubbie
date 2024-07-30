import CreateProjectButtonAndModal from "@/components/CreateProjectCardPopup";
import ProjectList from "@/components/ProjectList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@dubbie/db";
import React from "react";

// Component for rendering the projects page
const ProjectsPage: React.FC = async () => {
  const user = await currentUser();
  if (!user) return <div>You need to sign in to view your projects.</div>;
  const projects = await prisma.project.findMany({
    where: {
      userId: user?.id,
      isDeleted: false,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return (
    <div className="flex min-w-[860px] grow-0 flex-col">
      {/* Header section with title and button to create new project */}
      <div className="flex w-full items-center justify-between px-11 py-10">
        <div className="text-xl italic opacity-50">Projects</div>
        <CreateProjectButtonAndModal />
      </div>

      <ProjectList projects={projects} />
    </div>
  );
};

export default ProjectsPage;
