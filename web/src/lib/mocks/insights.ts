import {
  postMetadataSchema,
  postSummarySchema,
  type PostMetadata,
  type PostSummary,
} from "@/features/insights/schemas";

export const mockInsightViewStateNames = [
  "populated",
  "singleResult",
  "empty",
] as const;

export type MockInsightViewState =
  (typeof mockInsightViewStateNames)[number];

/**
 * Dữ liệu bài viết dùng cho visual test của trang Expert Insights.
 * Thứ tự là mới nhất trước; phần tử đầu tiên sẽ được giao diện chọn làm featured.
 */
export const mockInsightPosts: PostSummary[] = postSummarySchema.array().parse([
  {
    slug: "bao-cao-thi-truong-ha-noi-quy-3-2026",
    title: "Báo cáo thị trường căn hộ Hà Nội quý III/2026",
    date: "2026-07-20",
    category: "Thị trường",
    author: "Hanoi Estate Research",
    readTime: "10 phút đọc",
    excerpt:
      "Dữ liệu nguồn cung, thanh khoản và biến động giá tại các khu vực trọng điểm của Hà Nội trong quý III/2026.",
    cover:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000",
  },
  {
    slug: "chien-luoc-dong-tien-can-ho-cho-thue",
    title: "Chiến lược tối ưu dòng tiền căn hộ cho thuê",
    date: "2026-07-08",
    category: "Đầu tư",
    author: "Nguyễn Minh Anh",
    readTime: "7 phút đọc",
    excerpt:
      "So sánh lợi suất thuê, chi phí vận hành và đòn bẩy tài chính để xây dựng một kịch bản đầu tư bền vững.",
    cover:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000",
  },
  {
    slug: "phap-ly-mua-can-ho-hinh-thanh-tuong-lai",
    title: "Danh mục pháp lý cần kiểm tra khi mua nhà hình thành trong tương lai",
    date: "2026-06-26",
    category: "Pháp lý",
    author: "Ban Pháp lý Hanoi Estate",
    readTime: "9 phút đọc",
    excerpt:
      "Checklist hồ sơ dự án, điều kiện mở bán, bảo lãnh ngân hàng và những điều khoản người mua cần đọc kỹ trước khi ký.",
    cover:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000",
  },
  {
    slug: "quy-hoach-do-thi-song-hong",
    title: "Quy hoạch đô thị sông Hồng và tác động đến giá trị bất động sản",
    date: "2026-06-12",
    category: "Quy hoạch",
    author: "Hanoi Estate Research",
    readTime: "8 phút đọc",
    excerpt:
      "Phân tích kết nối hạ tầng, quỹ đất và các vùng có khả năng hưởng lợi từ định hướng phát triển hai bên sông Hồng.",
    cover:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=2000",
  },
  {
    slug: "phong-thuy-can-ho-huong-tay",
    title: "Cân bằng ánh sáng và phong thủy cho căn hộ hướng Tây",
    date: "2026-05-29",
    category: "Phong thủy",
    author: "Chuyên gia Minh Đức",
    readTime: "6 phút đọc",
    excerpt:
      "Các giải pháp bố trí không gian, vật liệu và cây xanh giúp căn hộ hướng Tây giảm nhiệt mà vẫn giữ luồng sinh khí tốt.",
    cover:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2000",
  },
  {
    slug: "can-ho-mau-toi-gian-tai-ho-tay",
    title: "Không gian sống tối giản bên Hồ Tây",
    date: "2026-05-14",
    category: "Phong cách sống",
    excerpt:
      "Một bài viết dùng ảnh dự phòng để kiểm tra trạng thái thiếu tác giả và khả năng hiển thị card với metadata tối thiểu.",
  },
  {
    slug: "tieu-chi-chon-chu-dau-tu-uy-tin",
    title:
      "Bảy tiêu chí đánh giá năng lực chủ đầu tư trước khi xuống tiền cho một dự án quy mô lớn",
    date: "2026-04-30",
    category: "Đầu tư",
    author: "Hanoi Estate Advisory",
    readTime: "12 phút đọc",
    excerpt:
      "Tình huống tiêu đề dài dùng để kiểm tra xuống dòng, giới hạn nội dung và chiều cao thẻ bài viết trên nhiều kích thước màn hình.",
    cover:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2000",
  },
]);

export const mockFeaturedInsightPost = postSummarySchema.parse(
  mockInsightPosts[0],
);

export const mockInsightCategories = Array.from(
  new Set(mockInsightPosts.map((post) => post.category)),
).sort((left, right) => left.localeCompare(right, "vi"));

/** Những tập dữ liệu nhỏ để test populated, single-result và empty state. */
export const mockInsightViewStates = {
  populated: mockInsightPosts,
  singleResult: [mockFeaturedInsightPost],
  empty: [] as PostSummary[],
} satisfies Record<MockInsightViewState, PostSummary[]>;

export function isMockInsightViewState(
  value: unknown,
): value is MockInsightViewState {
  return mockInsightViewStateNames.some((state) => state === value);
}

export interface MockInsightArticle {
  metadata: PostMetadata;
  content: string;
}

/**
 * Cung cấp nội dung MDX cho mọi card mock để link chi tiết luôn render được
 * trong mock mode, thay vì rơi vào trang 404.
 */
export function getMockInsightArticle(
  slug: string,
): MockInsightArticle | null {
  const post = mockInsightPosts.find((candidate) => candidate.slug === slug);
  if (!post) return null;

  return {
    metadata: postMetadataSchema.parse(post),
    content: `
## Tổng quan kịch bản

${post.excerpt}

Nội dung này là dữ liệu mô phỏng phục vụ kiểm tra bố cục bài viết, khả năng đọc trên thiết bị di động và các thành phần MDX. Nó không được sử dụng ở môi trường production.

<ExpertInsight name="Hanoi Estate Mock Lab">
  Đây là khối nhận định mẫu để kiểm tra khoảng cách, typography và cách nội dung dài xuống dòng trong trang chi tiết.
</ExpertInsight>

<ProjectHighlight items='[{"label":"Kịch bản","value":"Mock data"},{"label":"Danh mục","value":"${post.category}"},{"label":"Thời gian đọc","value":"${post.readTime}"},{"label":"Trạng thái","value":"Sẵn sàng"}]' />

## Dữ liệu minh họa

<ChartEngine
  type="bar"
  title="Chỉ số tham khảo theo quý"
  data='[{"quarter":"Q1","value":82},{"quarter":"Q2","value":91},{"quarter":"Q3","value":105},{"quarter":"Q4","value":112}]'
  xKey="quarter"
  yKey="value"
  unit="điểm"
/>

<DataTable
  title="Bảng dữ liệu kiểm thử"
  description="Dữ liệu hoàn toàn mô phỏng"
  columns='[{"key":"area","header":"Khu vực"},{"key":"price","header":"Giá tham khảo","align":"right"}]'
  data='[{"area":"Tây Hồ","price":"120 triệu/m²"},{"area":"Cầu Giấy","price":"95 triệu/m²"},{"area":"Nam Từ Liêm","price":"88 triệu/m²"}]'
/>

<ContactCta
  title="Bạn cần một phân tích riêng?"
  description="Liên hệ đội ngũ tư vấn để trao đổi về nhu cầu và khẩu vị đầu tư của bạn."
/>
`,
  };
}
