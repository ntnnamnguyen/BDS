export type AdminDashboardStatKind =
  | "projects"
  | "views"
  | "storage"
  | "leads";

export type AdminResourceState = "healthy" | "warning" | "critical";

export type AdminTrendDirection = "up" | "down" | "stable";

export interface AdminDashboardStat {
  id: string;
  kind: AdminDashboardStatKind;
  label: string;
  value: string;
  trend: {
    direction: AdminTrendDirection;
    label: string;
  };
}

export interface AdminRecentActivity {
  id: string;
  project: string;
  action: string;
  time: string;
}

export interface AdminCapacityFixture {
  id: string;
  label: string;
  used: number;
  limit: number;
  unit: string;
  percentage: number;
  state: AdminResourceState;
}

export interface AdminOptimizationFixture extends AdminCapacityFixture {
  tipTitle: string;
  tip: string;
  actionLabel: string;
}

export const adminStorageStateFixtures = {
  healthy: {
    id: "cloudinary-storage-healthy",
    label: "Cloudinary Storage",
    used: 1.2,
    limit: 25,
    unit: "GB",
    percentage: 4.8,
    state: "healthy",
  },
  warning: {
    id: "cloudinary-storage-warning",
    label: "Cloudinary Storage",
    used: 20,
    limit: 25,
    unit: "GB",
    percentage: 80,
    state: "warning",
  },
  critical: {
    id: "cloudinary-storage-critical",
    label: "Cloudinary Storage",
    used: 24.5,
    limit: 25,
    unit: "GB",
    percentage: 98,
    state: "critical",
  },
} as const satisfies Record<AdminResourceState, AdminCapacityFixture>;

export const adminOptimizationStateFixtures = {
  healthy: {
    id: "transformation-credits-healthy",
    label: "Transformation Credits",
    used: 8,
    limit: 25,
    unit: "credits",
    percentage: 32,
    state: "healthy",
    tipTitle: "Tài nguyên ổn định",
    tip: "Mức sử dụng credit đang an toàn cho chu kỳ hiện tại.",
    actionLabel: "Kiểm tra Media Library",
  },
  warning: {
    id: "transformation-credits-warning",
    label: "Transformation Credits",
    used: 18,
    limit: 25,
    unit: "credits",
    percentage: 72,
    state: "warning",
    tipTitle: "Mẹo tiết kiệm",
    tip: "Bạn đã sử dụng 72% credit biến đổi ảnh. Hãy tái sử dụng kích thước ảnh đã tối ưu khi có thể.",
    actionLabel: "Kiểm tra Media Library",
  },
  critical: {
    id: "transformation-credits-critical",
    label: "Transformation Credits",
    used: 24,
    limit: 25,
    unit: "credits",
    percentage: 96,
    state: "critical",
    tipTitle: "Sắp hết credit",
    tip: "Credit biến đổi ảnh gần chạm giới hạn. Hãy kiểm tra các biến thể chưa sử dụng trước khi tạo thêm.",
    actionLabel: "Kiểm tra Media Library",
  },
} as const satisfies Record<AdminResourceState, AdminOptimizationFixture>;

const defaultStorage = adminStorageStateFixtures.healthy;

export const adminDashboardStatsFixture = [
  {
    id: "total-projects",
    kind: "projects",
    label: "Tổng Dự án",
    value: "12",
    trend: { direction: "up", label: "+9%" },
  },
  {
    id: "monthly-views",
    kind: "views",
    label: "Lượt xem tháng",
    value: "8,432",
    trend: { direction: "up", label: "+12%" },
  },
  {
    id: "cloudinary-storage",
    kind: "storage",
    label: defaultStorage.label,
    value: `${defaultStorage.used} ${defaultStorage.unit} / ${defaultStorage.limit} ${defaultStorage.unit}`,
    trend: { direction: "stable", label: "Ổn định" },
  },
  {
    id: "interested-leads",
    kind: "leads",
    label: "Khách hàng quan tâm",
    value: "156",
    trend: { direction: "up", label: "+12%" },
  },
] as const satisfies readonly AdminDashboardStat[];

export const adminRecentActivitiesFixture = [
  {
    id: "activity-location-block",
    project: "Vinhomes Metropolis",
    action: "Cập nhật Location Block",
    time: "10 phút trước",
  },
  {
    id: "activity-gallery",
    project: "Sun Grand City",
    action: "Thêm 5 ảnh vào Gallery",
    time: "2 giờ trước",
  },
  {
    id: "activity-published",
    project: "Hanoi Signature",
    action: "Thay đổi trạng thái: Published",
    time: "5 giờ trước",
  },
] as const satisfies readonly AdminRecentActivity[];

export const adminDashboardFixture = {
  stats: adminDashboardStatsFixture,
  recentActivities: adminRecentActivitiesFixture,
  storage: defaultStorage,
  optimization: adminOptimizationStateFixtures.warning,
} as const;
