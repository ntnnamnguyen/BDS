import {
  Building2,
  Cloud,
  Clock,
  Minus,
  MousePointerClick,
  TrendingDown,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import {
  adminDashboardFixture,
  type AdminDashboardStatKind,
  type AdminResourceState,
} from "@/lib/mocks/admin-dashboard";
import { MockDataBadge } from "@/components/ui/mock-data-badge";
import { isApiMockFallbackEnabled } from "@/lib/env.server";

const statPresentation = {
  projects: { icon: Building2, color: "bg-blue-500" },
  views: { icon: MousePointerClick, color: "bg-indigo-500" },
  storage: { icon: Cloud, color: "bg-sky-500" },
  leads: { icon: Users, color: "bg-emerald-500" },
} satisfies Record<
  AdminDashboardStatKind,
  { icon: LucideIcon; color: string }
>;

const trendPresentation = {
  up: { icon: TrendingUp, color: "text-emerald-500" },
  down: { icon: TrendingDown, color: "text-red-500" },
  stable: { icon: Minus, color: "text-slate-400" },
} as const;

const resourceStatePresentation = {
  healthy: {
    progress: "bg-emerald-500",
    panel: "border-emerald-100 bg-emerald-50",
    heading: "text-emerald-800",
    text: "text-emerald-700",
  },
  warning: {
    progress: "bg-amber-500",
    panel: "border-amber-100 bg-amber-50",
    heading: "text-amber-800",
    text: "text-amber-700",
  },
  critical: {
    progress: "bg-red-500",
    panel: "border-red-100 bg-red-50",
    heading: "text-red-800",
    text: "text-red-700",
  },
} satisfies Record<
  AdminResourceState,
  { progress: string; panel: string; heading: string; text: string }
>;

export default function AdminDashboard() {
  const showMockData = isApiMockFallbackEnabled();

  if (!showMockData) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-2xl font-bold text-slate-800">Tổng quan</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
          Dữ liệu thống kê thật chưa được kết nối. Bật mock data trong môi trường
          development để kiểm tra giao diện dashboard.
        </p>
      </div>
    );
  }

  const { stats, recentActivities, storage, optimization } =
    adminDashboardFixture;
  const storageStyle = resourceStatePresentation[storage.state];
  const optimizationStyle = resourceStatePresentation[optimization.state];

  return (
    <div className="space-y-8">
      {/* Header chào hỏi */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-800">
            Chào buổi sáng, Admin
          </h1>
          <MockDataBadge className="border-amber-300 bg-amber-50 text-amber-800" />
        </div>
        <p className="text-slate-500">Dưới đây là tình hình hoạt động của Hanoi Estate hôm nay.</p>
      </div>

      {/* Grid thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const { icon: StatIcon, color } = statPresentation[stat.kind];
          const { icon: TrendIcon, color: trendColor } =
            trendPresentation[stat.trend.direction];

          return (
            <div key={stat.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl text-white ${color}`}>
                  <StatIcon aria-hidden="true" />
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
                  <TrendIcon aria-hidden="true" size={16} />
                  {stat.trend.label}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hoạt động gần đây */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <h3 className="font-bold text-slate-800">Hoạt động gần đây</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                  <div>
                    <div className="text-sm font-semibold text-slate-700">{activity.project}</div>
                    <div className="text-xs text-slate-500">{activity.action}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock aria-hidden="true" size={12} /> {activity.time}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50/50 text-center">
            <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Xem tất cả hoạt động
            </button>
          </div>
        </div>

        {/* Trạng thái Cloudinary */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-slate-800">Tối ưu tài nguyên</h3>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-500 uppercase">{storage.label}</span>
                <span className="text-slate-800">
                  {storage.used} / {storage.limit} {storage.unit}
                </span>
              </div>
              <div
                aria-label={`${storage.label}: ${storage.percentage}%`}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={storage.percentage}
                className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"
                role="progressbar"
              >
                <div
                  className={`h-full rounded-full ${storageStyle.progress}`}
                  style={{ width: `${storage.percentage}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-500 uppercase">{optimization.label}</span>
                <span className="text-slate-800">
                  {optimization.used} / {optimization.limit} {optimization.unit}
                </span>
              </div>
              <div
                aria-label={`${optimization.label}: ${optimization.percentage}%`}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={optimization.percentage}
                className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"
                role="progressbar"
              >
                <div
                  className={`h-full rounded-full ${optimizationStyle.progress}`}
                  style={{ width: `${optimization.percentage}%` }}
                />
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${optimizationStyle.panel}`}>
              <h4 className={`text-sm font-bold mb-1 ${optimizationStyle.heading}`}>
                {optimization.tipTitle}
              </h4>
              <p className={`text-xs leading-relaxed ${optimizationStyle.text}`}>
                {optimization.tip}
              </p>
            </div>

            <button type="button" className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
              {optimization.actionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
