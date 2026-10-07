import React from 'react';
import { 
  GripVertical, 
  Settings2, 
  Trash2, 
  Plus, 
  Save, 
  ChevronRight, 
  MapPin, 
  LayoutGrid, 
  Image as ImageIcon,
  Type,
  ListOrdered,
  Eye,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ProjectBlock } from '@/features/projects/schemas';
import { getApiErrorMessage, isApiError } from '@/lib/api/errors';
import { getAdminProject } from '@/features/projects/api.server';
import { MockDataBadge } from '@/components/ui/mock-data-badge';
import { isApiMockFallbackEnabled } from '@/lib/env.server';

export const dynamic = 'force-dynamic';

// 2. Map Icon tương ứng với loại Block
const blockIcons: Record<string, React.ReactNode> = {
  HERO: <ImageIcon size={18} />,
  LOCATION: <MapPin size={18} />,
  FACILITIES_GRID: <LayoutGrid size={18} />,
  IMAGE_GALLERY: <ImageIcon size={18} />,
  RICH_TEXT: <Type size={18} />,
  PRICING_TABLE: <ListOrdered size={18} />,
  FLOOR_PLAN: <FileText size={18} />,
};

function getBlockTitle(block: ProjectBlock): string {
  const title = block.data.title ?? block.data.heading ?? block.data.tagline;
  return typeof title === 'string' ? title : `Khối ${block.type}`;
}

export default async function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const showMockData = isApiMockFallbackEnabled();
  let project;

  try {
    project = await getAdminProject(id);
  } catch (error) {
    if (isApiError(error) && error.status === 404) notFound();

    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
        <h1 className="text-lg font-bold">Không tải được dự án</h1>
        <p className="mt-2 text-sm">{getApiErrorMessage(error)}</p>
        <Link href="/admin/projects" className="mt-6 inline-block text-sm font-semibold underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const blocks = project.page?.blocks ?? [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/admin/projects" className="hover:text-indigo-600 transition-colors">Dự án</Link>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-medium">{project.name}</span>
          {showMockData && (
            <MockDataBadge className="border-amber-300 bg-amber-50 text-amber-800" />
          )}
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-700 transition-all">
            <Eye size={16} /> Xem bản nháp
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
            <Save size={16} /> Lưu thay đổi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- CỘT TRÁI: QUẢN LÝ BLOCKS --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">Cấu trúc trang (Blocks)</h2>
              <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">
                <Plus size={14} /> Thêm Block
              </button>
            </div>
            
            <div className="space-y-3">
              {blocks.map((block, index) => (
                <div 
                  key={block.id || `${block.type}-${index}`} 
                  className="group flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all cursor-default"
                >
                  <div className="flex items-center gap-4">
                    <div className="cursor-grab text-slate-300 group-hover:text-slate-500 transition-colors">
                      <GripVertical size={20} />
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm">
                      {blockIcons[block.type] || <Settings2 size={18} />}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none mb-1">
                        {block.type}
                      </div>
                      <div className="text-sm font-bold text-slate-700">
                        {getBlockTitle(block)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <Link 
                      href={`/admin/projects/${id}/edit/${block.type.toLowerCase()}`}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Cấu hình Block"
                    >
                      <Settings2 size={18} />
                    </Link>
                    <button 
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa Block"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600">
                <Plus size={18} />
              </div>
              <span className="text-sm font-medium">Kéo thả hoặc nhấn để thêm khối nội dung mới</span>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: THÔNG TIN BỔ SUNG --- */}
        <div className="space-y-6">
          {/* Metadata Dự án */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800">Thông tin dự án</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên dự án</label>
                <input 
                  type="text" 
                  defaultValue={project.name}
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</label>
                <select 
                  defaultValue={project.publicationStatus}
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                >
                  <option value="DRAFT">Bản nháp (Draft)</option>
                  <option value="PUBLISHED">Công khai (Published)</option>
                  <option value="ARCHIVED">Đã lưu trữ (Archived)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Slug (Đường dẫn)</label>
                <div className="flex items-center gap-2 mt-1 p-3 bg-slate-100 border border-slate-100 rounded-xl text-sm text-slate-500 font-mono italic">
                  <span>/projects/</span>
                  <input 
                    type="text" 
                    defaultValue={project.slug}
                    className="bg-transparent border-none focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mẹo Quản trị */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm shadow-indigo-900/10 text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FileText size={18} />
              </div>
              <h3 className="font-bold text-sm">Hành trình khách hàng</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dự án BĐS Luxury nên bắt đầu bằng <strong className="text-indigo-400">HERO</strong> mạnh mẽ, tiếp nối bằng <strong className="text-indigo-400">LOCATION</strong> để khẳng định vị thế, và cuối cùng là <strong className="text-indigo-400">FACILITIES</strong> để khơi gợi cảm xúc.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
