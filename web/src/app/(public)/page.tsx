// import { Header } from "@/components/layout/header";
import Link from "next/link";
import { LuxuryButton } from "@/components/ui/luxury-button"
import { MockDataBadge } from "@/components/ui/mock-data-badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { getProjects } from "@/features/projects/api.server";
import type { ProjectSummary } from "@/features/projects/schemas";
import { isApiMockFallbackEnabled } from "@/lib/env.server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featuredProjects: ProjectSummary[] = [];
  let projectsUnavailable = false;
  const showMockData = isApiMockFallbackEnabled();

  try {
    const response = await getProjects({ page: 1, limit: 3, featured: true });
    featuredProjects = response.data;
  } catch {
    projectsUnavailable = true;
  }

  return (
    <main className="min-h-screen bg-luxury-base">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-luxury-stone mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Hanoi Private Real Estate Advisor
          </p>
          <h1 className="font-serif text-5xl md:text-8xl text-luxury-ink leading-[1.1] mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Bảo mật vị thế, <br /> Khẳng định giá trị.
          </h1>
          <div className="flex justify-center gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <LuxuryButton asChild>
              <Link href="/projects">Quỹ căn độc quyền</Link>
            </LuxuryButton>
          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION (Phần nói về triết lý của bạn) */}
      <section className="py-32 bg-luxury-taupe/10">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <SectionHeading 
              title="Tư vấn dựa trên dữ liệu thực" 
              subtitle="Triết lý làm việc" 
            />
            <p className="font-sans text-luxury-stone leading-relaxed text-lg">
              Tôi không chỉ giới thiệu những căn hộ hạng sang; tôi cung cấp các báo cáo phân tích dòng tiền và pháp lý chuyên sâu, giúp anh/chị đưa ra quyết định dựa trên con số thay vì cảm xúc.
            </p>
          </div>
        </div>
      </section>

      {/* 3. PROJECT GRID (Danh sách dự án) */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <SectionHeading 
            title="Dự án Tiêu điểm" 
            subtitle="Curated Collection" 
          />
          {showMockData && (
            <MockDataBadge className="mb-8 border-amber-700/30 bg-amber-50 text-amber-800" />
          )}
          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.name}
                  location={project.location || "Hà Nội"}
                  price={project.priceRange || "Liên hệ chuyên gia"}
                  image={project.thumbnailUrl || "/window.svg"}
                  slug={project.slug}
                />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center font-serif text-xl text-luxury-stone">
              {projectsUnavailable
                ? "Danh mục tiêu điểm đang được kết nối lại."
                : "Các dự án tiêu điểm đang được tuyển chọn."}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
