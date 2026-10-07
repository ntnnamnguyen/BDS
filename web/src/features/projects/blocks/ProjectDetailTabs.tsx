'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';

import {
  isProjectBlock,
  type ProjectBlock,
  type ProjectBlockType,
} from '@/features/projects/schemas';
import BlockRenderer from './BlockRenderer';

interface ProjectDetailTabsProps {
  blocks?: readonly ProjectBlock[] | null;
  queryParam?: string;
}

interface TabDefinition {
  label: string;
  slug: string;
  types: readonly ProjectBlockType[];
}

interface TabGroup extends TabDefinition {
  blocks: ProjectBlock[];
}

const TAB_DEFINITIONS: readonly TabDefinition[] = [
  { label: 'Vị trí', slug: 'location', types: ['LOCATION', 'LOCATION_MAP'] },
  { label: 'Tiện ích', slug: 'facilities', types: ['FACILITIES_GRID'] },
  { label: 'Hình ảnh', slug: 'gallery', types: ['IMAGE_GALLERY'] },
  { label: 'Mặt bằng', slug: 'floor-plan', types: ['FLOOR_PLAN'] },
  { label: 'Tiến độ', slug: 'timeline', types: ['TIMELINE_PROGRESS'] },
  { label: 'Bảng giá', slug: 'pricing', types: ['PRICING_TABLE'] },
  { label: 'Chính sách', slug: 'policy', types: ['SALES_POLICY'] },
];

function groupBlocks(blocks: readonly ProjectBlock[]): TabGroup[] {
  const safeBlocks = blocks.filter(isProjectBlock);

  return TAB_DEFINITIONS.flatMap((definition) => {
    const matchingBlocks = safeBlocks.filter((block) =>
      definition.types.includes(block.type),
    );

    return matchingBlocks.length > 0
      ? [{ ...definition, blocks: matchingBlocks }]
      : [];
  });
}

function TabPanel({ group }: { group: TabGroup }) {
  return <BlockRenderer blocks={group.blocks} />;
}

interface TabsViewProps {
  activeSlug: string;
  groups: TabGroup[];
  hrefFor: (slug: string) => string;
}

function TabsView({ activeSlug, groups, hrefFor }: TabsViewProps) {
  const activeGroup =
    groups.find((group) => group.slug === activeSlug) ?? groups[0];
  if (!activeGroup) return null;

  return (
    <section aria-label="Thông tin chi tiết dự án" className="bg-luxury-base">
      <div className="sticky top-20 z-40 border-y border-luxury-taupe/20 bg-luxury-base/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl overflow-x-auto px-6">
          <nav
            aria-label="Danh mục thông tin dự án"
            className="flex min-w-max justify-start gap-8 py-5 md:justify-center"
          >
            {groups.map((group) => {
              const selected = group.slug === activeGroup.slug;

              return (
                <Link
                  aria-current={selected ? 'page' : undefined}
                  className={
                    selected
                      ? 'border-b border-luxury-bronze pb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-luxury-bronze'
                      : 'border-b border-transparent pb-1 text-[10px] font-medium uppercase tracking-[0.25em] text-luxury-stone transition-colors hover:text-luxury-bronze'
                  }
                  href={hrefFor(group.slug)}
                  key={group.slug}
                  scroll={false}
                >
                  {group.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div key={activeGroup.slug}>
        <TabPanel group={activeGroup} />
      </div>
    </section>
  );
}

function QueryDrivenTabs({
  groups,
  queryParam,
}: {
  groups: TabGroup[];
  queryParam: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedSlug = searchParams.get(queryParam) ?? '';
  const activeSlug = groups.some((group) => group.slug === requestedSlug)
    ? requestedSlug
    : groups[0]?.slug ?? '';

  const hrefFor = (slug: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set(queryParam, slug);
    const query = nextParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  return (
    <TabsView activeSlug={activeSlug} groups={groups} hrefFor={hrefFor} />
  );
}

export default function ProjectDetailTabs({
  blocks = [],
  queryParam = 'tab',
}: ProjectDetailTabsProps) {
  const groups = useMemo(() => groupBlocks(blocks ?? []), [blocks]);
  if (groups.length === 0) return null;

  const firstSlug = groups[0]?.slug ?? '';
  return (
    <Suspense
      fallback={
        <TabsView
          activeSlug={firstSlug}
          groups={groups}
          hrefFor={(slug) => `?${queryParam}=${encodeURIComponent(slug)}`}
        />
      }
    >
      <QueryDrivenTabs groups={groups} queryParam={queryParam} />
    </Suspense>
  );
}
