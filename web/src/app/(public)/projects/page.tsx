import { ProjectsExplorer } from "@/features/projects/components/ProjectsExplorer";
import { getProjects } from "@/features/projects/api.server";
import { isApiMockFallbackEnabled } from "@/lib/env.server";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { data: projects } = await getProjects({ page: 1, limit: 100 });

  return (
    <ProjectsExplorer
      projects={projects}
      showMockData={isApiMockFallbackEnabled()}
    />
  );
}
