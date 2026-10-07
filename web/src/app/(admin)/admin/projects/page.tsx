import { Edit3, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CreateProjectButton, DeleteButton } from '@/app/(admin)/admin/projects/_components/ProjectActions';
import Link from 'next/link';
import type { ProjectSummary } from '@/features/projects/schemas';
import { getApiErrorMessage } from '@/lib/api/errors';
import { getAdminProjects } from '@/features/projects/api.server';
import { MockDataBadge } from '@/components/ui/mock-data-badge';
import { isApiMockFallbackEnabled } from '@/lib/env.server';

export const dynamic = 'force-dynamic';

function formatUpdatedAt(value?: string): string {
  if (!value) return 'Chưa có dữ liệu';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Không xác định';
  return formatDistanceToNow(date, { addSuffix: true, locale: vi });
}

export default async function ProjectListPage() {
  let projects: ProjectSummary[] = [];
  let backendError: string | null = null;
  const showMockData = isApiMockFallbackEnabled();

  try {
    const response = await getAdminProjects({ page: 1, limit: 100 });
    projects = response.data;
  } catch (error) {
    backendError = getApiErrorMessage(error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">Danh sách Dự án</h1>
            {showMockData && (
              <MockDataBadge className="border-amber-300 bg-amber-50 text-amber-800" />
            )}
          </div>
          <p className="text-slate-500 text-sm">Quản lý nội dung Quiet Luxury cho Hanoi Estate</p>
        </div>
        <CreateProjectButton />
      </div>

      {backendError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <p className="font-semibold">Không tải được dữ liệu từ backend.</p>
          <p className="mt-1 text-xs text-red-600">{backendError}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b text-slate-500 text-sm font-sans">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Tên dự án</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Slug</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Cập nhật</th>
              <th className="px-6 py-4 font-semibold text-right uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-700">{p.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">ID: {p.id.slice(0,8)}...</div>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm font-mono italic">/{p.slug}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider border ${
                    p.publicationStatus === 'PUBLISHED' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : p.publicationStatus === 'ARCHIVED'
                      ? 'bg-slate-100 text-slate-600 border-slate-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {p.publicationStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-sm">
                  {formatUpdatedAt(p.updatedAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link 
                      href={`/projects/${p.slug}`} 
                      target="_blank"
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link 
                      href={`/admin/projects/${p.id}/edit`}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                    >
                      <Edit3 size={18} />
                    </Link>
                    <DeleteButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
            {!backendError && projects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">
                  Chưa có dự án nào. Hãy nhấn &quot;Thêm dự án mới&quot;.
                </td> 
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
