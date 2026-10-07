'use client'

import { Trash2, Plus } from 'lucide-react';
import { deleteProject, createProject } from '@/features/projects/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  return (
    <button 
      onClick={async () => {
        if (confirm("Bạn có chắc chắn muốn lưu trữ dự án này? Dự án sẽ không còn xuất hiện công khai.")) {
          try {
            await deleteProject(id);
            toast.success("Đã lưu trữ dự án");
            router.refresh();
          } catch {
            toast.error("Không thể lưu trữ dự án. Vui lòng thử lại.");
          }
        }
      }}
      aria-label="Lưu trữ dự án"
      title="Lưu trữ dự án"
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
    >
      <Trash2 size={18} />
    </button>
  );
}

export function CreateProjectButton() {
  const handleAdd = async () => {
    const name = prompt("Nhập tên dự án mới:");
    if (!name) return;

    const formData = new FormData();
    formData.append("name", name);
    
    try {
      await createProject(formData);
    } catch {
      toast.error("Không thể tạo dự án. Có thể tên bị trùng.");
    }
  };

  return (
    <button 
      onClick={handleAdd}
      className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
    >
      <Plus size={18} /> Thêm dự án mới
    </button>
  );
}
