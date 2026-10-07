import type { NavItem } from "@/components/layout/LuxuryNavigation";

export const PUBLIC_NAVIGATION_ITEMS = [
  { id: "projects", name: "Dự án", link: "/projects", slug: "projects" },
  {
    id: "analysis",
    name: "Phân tích dòng tiền",
    link: "/analysis",
    slug: "analysis",
  },
  {
    id: "insights",
    name: "Góc nhìn chuyên gia",
    link: "/expert-insights",
    slug: "expert-insights",
  },
] satisfies readonly NavItem[];
