import Link from 'next/link';

import { InsightsExplorer } from '@/features/insights/components/InsightsExplorer';
import { getAllPosts } from '@/features/insights/content.server';
import { MockDataBadge } from '@/components/ui/mock-data-badge';
import { isUiMockModeEnabled } from '@/lib/mocks/config';
import {
  isMockInsightViewState,
  mockInsightViewStateNames,
  mockInsightViewStates,
} from '@/lib/mocks/insights';

interface PageProps {
  searchParams: Promise<{
    mockState?: string | string[];
  }>;
}

export default async function ExpertInsightsPage({ searchParams }: PageProps) {
  const mockModeEnabled = isUiMockModeEnabled();

  if (!mockModeEnabled) {
    return <InsightsExplorer initialPosts={getAllPosts()} />;
  }

  const requestedStateParam = (await searchParams).mockState;
  const requestedState = Array.isArray(requestedStateParam)
    ? requestedStateParam[0]
    : requestedStateParam;
  const mockState = isMockInsightViewState(requestedState)
    ? requestedState
    : 'populated';
  const posts = mockInsightViewStates[mockState];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex max-w-[calc(100vw-3rem)] flex-col gap-2 rounded-sm bg-white/95 p-3 shadow-lg backdrop-blur-sm">
        <MockDataBadge />
        <nav aria-label="Chọn trạng thái mock của bài viết" className="flex flex-wrap gap-1">
          {mockInsightViewStateNames.map((state) => (
            <Link
              key={state}
              href={{ pathname: '/expert-insights', query: { mockState: state } }}
              aria-current={state === mockState ? 'page' : undefined}
              className={`px-2 py-1 text-[9px] font-semibold uppercase tracking-wider ${
                state === mockState
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {state}
            </Link>
          ))}
        </nav>
      </div>
      <InsightsExplorer initialPosts={posts} />
    </>
  );
}
