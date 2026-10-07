"use client";

import * as React from "react";

import {
  getSalesStatusLabel,
  type ProjectSummary,
} from "@/features/projects/schemas";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { MockDataBadge } from "@/components/ui/mock-data-badge";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectsExplorerProps {
  projects: ProjectSummary[];
  showMockData?: boolean;
}

const AREA_FILTERS = ["Tây Hồ", "Hoàn Kiếm", "Thanh Xuân"] as const;

export function ProjectsExplorer({
  projects,
  showMockData = false,
}: ProjectsExplorerProps) {
  const [filter, setFilter] = React.useState("all");

  const filteredProjects = React.useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((project) => project.location?.includes(filter)),
    [filter, projects],
  );

  return (
    <main className="min-h-screen bg-luxury-base pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <SectionHeading
              subtitle="Portfolio"
              title="Danh mục Quỹ căn Tuyển lựa"
            />
            {showMockData && (
              <MockDataBadge className="mb-4 border-amber-700/30 bg-amber-50 text-amber-800" />
            )}
            <p className="font-sans text-luxury-stone text-sm md:text-base leading-relaxed max-w-lg">
              Tổng hợp những dự án bất động sản nội đô sở hữu pháp lý minh
              bạch và tiềm năng dòng tiền bền vững. Mỗi dự án đều được tôi
              trực tiếp thẩm định và phân tích rủi ro.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-sans text-[10px] uppercase tracking-widest text-luxury-stone">
              Lọc theo:
            </span>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-45 bg-transparent border-luxury-taupe rounded-none font-sans text-xs uppercase tracking-widest">
                <SelectValue placeholder="Khu vực" />
              </SelectTrigger>
              <SelectContent className="bg-luxury-base border-luxury-taupe rounded-none font-sans text-xs">
                <SelectItem value="all">Tất cả khu vực</SelectItem>
                {AREA_FILTERS.map((area) => (
                  <SelectItem key={area} value={area}>
                    Quận {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="animate-in fade-in slide-in-from-bottom-6 duration-700"
            >
              <ProjectCard
                title={project.name}
                location={project.location || "Hà Nội"}
                price={project.priceRange || "Liên hệ chuyên gia"}
                image={project.thumbnailUrl || "/window.svg"}
                slug={project.slug}
              />
              <div className="mt-4 flex items-center gap-3 text-[9px] uppercase tracking-widest text-luxury-bronze">
                {project.expectedYield && (
                  <span className="px-2 py-0.5 border border-luxury-bronze/30 italic">
                    Yield: {project.expectedYield}
                  </span>
                )}
                {project.expectedYield && (
                  <span className="text-luxury-stone/50">|</span>
                )}
                <span>{getSalesStatusLabel(project.salesStatus)}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-40 text-center space-y-4">
            <p className="font-serif text-2xl text-luxury-stone">
              Chưa có dự án phù hợp trong danh mục này.
            </p>
            {filter !== "all" && (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="font-sans text-[10px] uppercase tracking-luxury text-luxury-bronze border-b border-luxury-bronze"
              >
                Quay lại danh sách đầy đủ
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
