import {
  projectDetailSchema,
  projectListResponseSchema,
  type ProjectDetail,
} from "@/features/projects/schemas";
import { MOCK_PROJECT_BLOCKS } from "@/lib/mocks/project-blocks";

const RAW_MOCK_PROJECTS = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "The Heritage West Lake",
    slug: "heritage-west-lake",
    description:
      "Biểu tượng sống bên Hồ Tây với sảnh thang máy riêng và tầm nhìn panorama.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop",
    publicationStatus: "PUBLISHED",
    salesStatus: "OPEN_FOR_SALE",
    location: "Lạc Long Quân, Tây Hồ, Hà Nội",
    priceRange: "Từ 140 triệu/m²",
    legalStatus: "Sở hữu lâu dài theo quy định",
    expectedYield: "5,5%–6,2%/năm (giả lập)",
    features: [
      "Bể bơi vô cực nước ấm trên cao",
      "Sảnh thang máy riêng cho từng căn hộ",
      "Dịch vụ quản lý tiêu chuẩn quốc tế",
      "Tiêu chuẩn bàn giao cao cấp",
    ],
    analysis: {
      pros: [
        "Vị trí ven Hồ Tây có nguồn cung giới hạn",
        "Hệ thống tiện ích và dịch vụ đồng bộ",
        "Phù hợp nhóm khách thuê chuyên gia dài hạn",
      ],
      cons: [
        "Tổng giá trị tài sản thuộc phân khúc cao",
        "Lợi suất thực tế phụ thuộc thời điểm và phương án vận hành",
      ],
      investmentTarget:
        "Khách hàng mua tích sản hoặc khai thác cho thuê dài hạn.",
    },
    featured: true,
    sortOrder: 1,
    seoTitle: "The Heritage West Lake | Dữ liệu giao diện mẫu",
    seoDescription:
      "Trang chi tiết mock chứa đủ các block để kiểm tra giao diện dự án.",
    updatedAt: "2026-07-30T09:30:00.000Z",
    publishedAt: "2026-06-15T02:00:00.000Z",
    createdAt: "2026-05-01T02:00:00.000Z",
    page: {
      version: 1,
      blocks: MOCK_PROJECT_BLOCKS,
    },
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Grand Marina Hanoi",
    slug: "grand-marina-hanoi",
    description: null,
    thumbnailUrl: null,
    publicationStatus: "PUBLISHED",
    salesStatus: "COMING_SOON",
    location: "Hoàn Kiếm, Hà Nội",
    priceRange: null,
    legalStatus: null,
    expectedYield: null,
    features: [],
    analysis: null,
    featured: false,
    sortOrder: 2,
    seoTitle: null,
    seoDescription: null,
    updatedAt: "2026-07-25T08:15:00.000Z",
    publishedAt: "2026-07-25T08:15:00.000Z",
    createdAt: "2026-07-20T04:00:00.000Z",
    page: null,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    name: "The Metropole Thanh Xuân",
    slug: "the-metropole-thanh-xuan",
    description:
      "Dự án đã bàn giao dùng để kiểm tra trạng thái bán hàng và trang không có block nội dung.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
    publicationStatus: "PUBLISHED",
    salesStatus: "HANDED_OVER",
    location: "Nguyễn Tuân, Thanh Xuân, Hà Nội",
    priceRange: "Từ 85 triệu/m²",
    legalStatus: "Đã bàn giao hồ sơ theo tiến độ",
    expectedYield: "6,0%–7,0%/năm (giả lập)",
    features: ["Căn hộ đã bàn giao", "Tiện ích nội khu khép kín"],
    analysis: {
      pros: ["Có thể khảo sát sản phẩm thực tế", "Khu vực có nhu cầu ở thật"],
      cons: ["Mật độ xây dựng xung quanh cao"],
      investmentTarget:
        "Khách hàng ưu tiên tài sản đã hình thành và dòng tiền cho thuê.",
    },
    featured: true,
    sortOrder: 3,
    seoTitle: null,
    seoDescription: null,
    updatedAt: "2026-07-18T10:45:00.000Z",
    publishedAt: "2026-05-12T03:00:00.000Z",
    createdAt: "2026-04-10T03:00:00.000Z",
    page: {
      version: 1,
      blocks: [],
    },
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    name: "West Gate Residence",
    slug: "west-gate-residence-draft",
    description:
      "Bản nháp dành cho việc kiểm tra trạng thái và màn hình chỉnh sửa quản trị.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1600607687940-47a04b62d373?q=80&w=1600&auto=format&fit=crop",
    publicationStatus: "DRAFT",
    salesStatus: "OPEN_FOR_SALE",
    location: "Nam Từ Liêm, Hà Nội",
    priceRange: "Đang cập nhật",
    legalStatus: "Đang cập nhật",
    expectedYield: null,
    features: ["Dữ liệu chỉ hiển thị trong quản trị"],
    analysis: null,
    featured: false,
    sortOrder: 4,
    seoTitle: null,
    seoDescription: null,
    updatedAt: "2026-08-01T07:20:00.000Z",
    publishedAt: null,
    createdAt: "2026-07-31T02:30:00.000Z",
    page: {
      version: 1,
      blocks: MOCK_PROJECT_BLOCKS.slice(0, 2),
    },
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    name: "Riverside Legacy",
    slug: "riverside-legacy-archived",
    description:
      "Bản ghi lưu trữ dùng để kiểm tra trạng thái ARCHIVED trong bảng quản trị.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop",
    publicationStatus: "ARCHIVED",
    salesStatus: null,
    location: "Long Biên, Hà Nội",
    priceRange: null,
    legalStatus: null,
    expectedYield: null,
    features: [],
    analysis: null,
    featured: false,
    sortOrder: 5,
    seoTitle: null,
    seoDescription: null,
    updatedAt: "2026-06-20T05:00:00.000Z",
    publishedAt: null,
    createdAt: "2026-03-11T05:00:00.000Z",
    page: null,
  },
] satisfies ProjectDetail[];

/** All scenarios, including draft and archived records for admin screens. */
export const MOCK_PROJECTS = projectDetailSchema.array().parse(
  RAW_MOCK_PROJECTS,
);

/** The public API never exposes draft or archived mock records. */
export const MOCK_PUBLIC_PROJECTS = MOCK_PROJECTS.filter(
  (project) => project.publicationStatus === "PUBLISHED",
);

/** Reusable empty-state response for component and route tests. */
export const EMPTY_PROJECT_LIST_RESPONSE = projectListResponseSchema.parse({
  data: [],
  meta: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
});
