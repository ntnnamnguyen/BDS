import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PrivateContactForm } from "@/features/leads/components/PrivateContactForm";
import ProjectDetailTabs from "@/features/projects/blocks/ProjectDetailTabs";
import { getProjectImageSource } from "@/features/projects/image";
import { MockDataBadge } from "@/components/ui/mock-data-badge";
import type { ProjectDetail } from "@/features/projects/schemas";
import { isApiError } from "@/lib/api/errors";
import { getProjectBySlug } from "@/features/projects/api.server";
import { isApiMockFallbackEnabled } from "@/lib/env.server";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

async function loadProject(slug: string): Promise<ProjectDetail> {
  try {
    return await getProjectBySlug(slug);
  } catch (error) {
    if (isApiError(error) && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const project = await getProjectBySlug(slug);
    return {
      title: project.seoTitle || `${project.name} | Phân tích chuyên sâu`,
      description: project.seoDescription || project.description || undefined,
    };
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return { title: "Dự án không tồn tại" };
    }
    throw error;
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await loadProject(slug);
  const showMockData = isApiMockFallbackEnabled();
  const features = project.features || [];
  const pros = project.analysis?.pros || [];
  const cons = project.analysis?.cons || [];

  return (
    <main className="bg-luxury-base min-h-screen">
      <section className="relative h-[60vh] w-full bg-luxury-taupe">
        <Image
          src={getProjectImageSource(project.thumbnailUrl)}
          alt={project.name}
          fill
          sizes="100vw"
          className="object-cover grayscale-10"
          priority
        />
        <div className="absolute inset-0 bg-luxury-ink/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-4 text-center">
            <p className="font-sans text-xs uppercase tracking-[0.4em] text-white/80">
              {project.location || "Hà Nội"}
            </p>
            <h1 className="font-serif text-5xl text-white md:text-7xl">
              {project.name}
            </h1>
            {showMockData && (
              <MockDataBadge className="mx-auto border-white/40 bg-black/30 text-white backdrop-blur-sm" />
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="space-y-16 lg:col-span-8">
            {project.description && (
              <section className="space-y-6">
                <div className="h-px w-12 bg-luxury-bronze" />
                <p className="font-serif text-2xl leading-relaxed text-luxury-ink md:text-3xl">
                  {project.description}
                </p>
              </section>
            )}

            {(features.length > 0 ||
              project.expectedYield ||
              project.priceRange) && (
              <section className="grid gap-12 border-t border-luxury-taupe/30 pt-12 md:grid-cols-2">
                <div className="space-y-6">
                  <h3 className="font-serif text-2xl uppercase tracking-tight text-luxury-ink">
                    Giá trị độc bản
                  </h3>
                  <ul className="space-y-4">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-3 font-sans text-sm text-luxury-stone"
                      >
                        <span className="text-luxury-bronze">/</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6 bg-luxury-taupe/10 p-8">
                  <h3 className="font-serif text-2xl text-luxury-ink">
                    Chỉ số tài chính
                  </h3>
                  <div className="space-y-4">
                    {project.expectedYield && (
                      <div>
                        <p className="text-[10px] uppercase tracking-luxury text-luxury-stone">
                          Lợi suất cho thuê
                        </p>
                        <p className="font-serif text-2xl text-luxury-bronze">
                          {project.expectedYield}
                        </p>
                      </div>
                    )}
                    {project.priceRange && (
                      <div>
                        <p className="text-[10px] uppercase tracking-luxury text-luxury-stone">
                          Tầm giá thị trường
                        </p>
                        <p className="font-serif text-2xl text-luxury-ink">
                          {project.priceRange}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {(pros.length > 0 || cons.length > 0 || project.analysis) && (
              <section className="space-y-8 border border-luxury-taupe/20 bg-white/40 p-10">
                <h3 className="text-center font-serif text-3xl text-luxury-ink">
                  Đánh giá của cố vấn
                </h3>
                <div className="grid gap-10 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-sans text-xs uppercase tracking-widest text-emerald-800">
                      Ưu điểm
                    </h4>
                    {pros.map((pro) => (
                      <p
                        key={pro}
                        className="text-sm leading-relaxed text-luxury-stone"
                      >
                        • {pro}
                      </p>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-sans text-xs uppercase tracking-widest text-rose-800">
                      Lưu ý
                    </h4>
                    {cons.map((con) => (
                      <p
                        key={con}
                        className="text-sm leading-relaxed text-luxury-stone"
                      >
                        • {con}
                      </p>
                    ))}
                  </div>
                </div>
                {project.analysis?.investmentTarget && (
                  <div className="border-t border-luxury-taupe/30 pt-6">
                    <p className="text-center font-sans text-xs italic text-luxury-stone">
                      <span className="font-bold not-italic uppercase">
                        Mục tiêu:
                      </span>{" "}
                      {project.analysis.investmentTarget}
                    </p>
                  </div>
                )}
              </section>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8 border border-luxury-bronze/20 bg-white/50 p-8 backdrop-blur-md">
              <div className="space-y-2 text-center">
                <h4 className="font-serif text-2xl">Nhận hồ sơ dự án</h4>
                <p className="font-sans text-[10px] uppercase leading-loose tracking-widest text-luxury-stone">
                  Bao gồm bảng giá chi tiết <br /> & Báo cáo dòng tiền 5 năm
                </p>
              </div>

              <PrivateContactForm
                projectId={project.id}
                sourcePath={`/projects/${project.slug}`}
              />

              <div className="border-t border-luxury-taupe/30 pt-6 text-center">
                <p className="font-sans text-[10px] text-luxury-stone/60">
                  Phản hồi trong vòng 30 phút qua Zalo/Phone
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProjectDetailTabs blocks={project.page?.blocks} />
    </main>
  );
}
