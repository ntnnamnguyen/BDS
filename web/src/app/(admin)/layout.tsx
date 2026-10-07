import React from 'react';
import { LayoutDashboard, Building2, Image as ImageIcon, Settings, LogOut } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'Hanoi Estate - Admin Panel',
  description: 'Hệ thống quản trị bất động sản hạng sang',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Tổng quan', href: '/admin' },
    { icon: <Building2 size={20} />, label: 'Dự án', href: '/admin/projects' },
    { icon: <ImageIcon size={20} />, label: 'Thư viện Media', href: '/admin/media' },
    { icon: <Settings size={20} />, label: 'Cài đặt', href: '/admin/settings' },
  ];

  return (
    <>
        <div className="flex h-screen bg-slate-50 font-sans">
          {/* Sidebar */}
          <aside className="w-64 bg-slate-900 text-white flex flex-col">
            <div className="p-6 text-xl font-bold border-b border-slate-800 text-indigo-400">
              HANOI ESTATE <span className="text-xs block text-slate-500">ADMIN PANEL</span>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => (
                <a 
                  key={item.label} 
                  href={item.href} 
                  className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white"
                >
                  {item.icon} {item.label}
                </a>
              ))}
            </nav>
            <div className="p-4 border-t border-slate-800">
              <button className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-950/30 w-full rounded-lg transition-colors">
                <LogOut size={20} /> Đăng xuất
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
              <h2 className="font-semibold text-slate-700">Quản lý nội dung</h2>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  AD
                </div>
              </div>
            </header>
            
            {/* Đây là nơi nội dung của các trang con (page.tsx) sẽ hiển thị */}
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
        <Toaster position="top-right" />
    </>
  );
}
