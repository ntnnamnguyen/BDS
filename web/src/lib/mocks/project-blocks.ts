import {
  projectBlocksSchema,
  type ProjectBlock,
} from "@/features/projects/schemas";

/**
 * Complete renderable block set for exercising the public project-detail UI.
 *
 * `satisfies` catches contract drift during type checking while the schema parse
 * below also protects developers who import these fixtures at runtime.
 */
const RAW_MOCK_PROJECT_BLOCKS = [
  {
    id: "mock-location",
    type: "LOCATION",
    data: {
      tagline: "Tâm điểm thượng lưu",
      heading: "Vị thế uy phong, tầm nhìn vĩnh cửu",
      description:
        "Tọa lạc bên Hồ Tây, dự án sở hữu kết nối thuận tiện tới trung tâm thành phố, sân bay và hệ thống trường quốc tế.",
      mapConfig: {
        lat: 21.058,
        lng: 105.825,
        zoom: 14,
        style: "luxury-dark",
        address: "69 Xuân Diệu, Quảng An, Tây Hồ, Hà Nội",
      },
      poiGroups: [
        {
          groupName: "Giao thông và kết nối",
          items: [
            {
              name: "Sân bay Nội Bài",
              value: "25",
              unit: "min",
              coordinates: { lat: 21.213, lng: 105.804 },
              highlight: true,
            },
            {
              name: "Cầu Nhật Tân",
              value: "5",
              unit: "min",
              coordinates: { lat: 21.095, lng: 105.819 },
            },
          ],
        },
        {
          groupName: "Giáo dục",
          items: [
            {
              name: "UNIS Hanoi",
              value: "8",
              unit: "min",
              coordinates: { lat: 21.072, lng: 105.812 },
            },
          ],
        },
      ],
      highlights: [
        {
          title: "Tầm nhìn",
          content: "Trực diện Hồ Tây, không bị che chắn bởi công trình cao tầng.",
        },
        {
          title: "Kết nối",
          content: "Tiếp cận nhanh khu Ngoại giao đoàn và trung tâm Hoàn Kiếm.",
        },
      ],
    },
  },
  {
    id: "mock-facilities",
    type: "FACILITIES_GRID",
    data: {
      heading: "Hệ tiện ích dành riêng cho chủ nhân",
      subHeading:
        "Không gian sức khỏe, giải trí và kết nối cộng đồng được bố trí khép kín.",
      layout: "grid",
      items: [
        {
          id: "facility-pool",
          title: "Bể bơi vô cực Panorama",
          description:
            "Bể bơi nước ấm trên cao với tầm nhìn rộng hướng Hồ Tây.",
          image:
            "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1600&auto=format&fit=crop",
          iconName: "Waves",
          category: "Sức khỏe",
        },
        {
          id: "facility-lounge",
          title: "Cigar & Wine Lounge",
          description:
            "Không gian tiếp khách riêng tư dành cho cư dân và đối tác.",
          image:
            "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=1600&auto=format&fit=crop",
          iconName: "GlassWater",
          category: "Giải trí",
        },
        {
          id: "facility-cinema",
          title: "Private Cinema",
          description:
            "Phòng chiếu riêng với hệ thống âm thanh và ghế ngồi cao cấp.",
          image:
            "https://images.unsplash.com/photo-1517604401157-538a9688394a?q=80&w=1600&auto=format&fit=crop",
          iconName: "Monitor",
          category: "Giải trí",
        },
        {
          id: "facility-garden",
          title: "Vườn thiền",
          description:
            "Khoảng xanh yên tĩnh giúp cư dân thư giãn và tái tạo năng lượng.",
          image:
            "https://images.unsplash.com/photo-1582103287241-2762adba6c36?q=80&w=1600&auto=format&fit=crop",
          iconName: "Trees",
          category: "Sức khỏe",
        },
        {
          id: "facility-gym",
          title: "Gym Center",
          description:
            "Khu luyện tập đầy đủ thiết bị cho cardio và sức mạnh.",
          image:
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop",
          iconName: "Dumbbell",
          category: "Sức khỏe",
        },
        {
          id: "facility-square",
          title: "Quảng trường ánh sáng",
          description:
            "Không gian tổ chức các hoạt động văn hóa và sự kiện cộng đồng.",
          image:
            "https://images.unsplash.com/photo-1496333036608-4f4461301d2f?q=80&w=1600&auto=format&fit=crop",
          iconName: "Sparkles",
          category: "Cộng đồng",
        },
      ],
    },
  },
  {
    id: "mock-gallery",
    type: "IMAGE_GALLERY",
    data: {
      heading: "Không gian sống giàu cảm xúc",
      subHeading:
        "Bộ ảnh mock có nhiều danh mục để kiểm tra bộ lọc và chế độ phóng to.",
      layout: "grid",
      aspectRatio: "video",
      images: [
        {
          id: "gallery-architecture-1",
          url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
          alt: "Mặt ngoài tòa nhà cao tầng hiện đại",
          caption: "Ngôn ngữ kiến trúc đương đại",
          category: "Kiến trúc",
        },
        {
          id: "gallery-interior-1",
          url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600&auto=format&fit=crop",
          alt: "Phòng khách căn hộ cao cấp",
          caption: "Phòng khách đón ánh sáng tự nhiên",
          category: "Nội thất",
        },
        {
          id: "gallery-interior-2",
          url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop",
          alt: "Không gian bếp tối giản",
          caption: "Vật liệu hoàn thiện tông màu ấm",
          category: "Nội thất",
        },
        {
          id: "gallery-lifestyle-1",
          url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop",
          alt: "Không gian sân vườn và hồ bơi",
          caption: "Khoảng nghỉ dưỡng ngay tại nhà",
          category: "Phong cách sống",
        },
      ],
    },
  },
  {
    id: "mock-floor-plan",
    type: "FLOOR_PLAN",
    data: {
      heading: "Thiết kế tối ưu công năng",
      description:
        "Nhiều nhóm căn hộ và phương án mặt bằng giúp kiểm tra đầy đủ tab chọn sản phẩm.",
      tabs: [
        {
          tabName: "Căn hộ 2 phòng ngủ",
          plans: [
            {
              id: "plan-2br-a1",
              title: "Căn hộ Deluxe A1",
              images: [
                {
                  src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop",
                  alt: "Không gian tham khảo căn hộ hai phòng ngủ",
                  caption: "Phối cảnh nội thất tham khảo",
                },
              ],
              areaNet: "68,5 m²",
              areaGross: "75,2 m²",
              bedroom: 2,
              bathroom: 2,
              direction: "Đông Nam",
              highlights: [
                "Phòng khách đón ánh sáng tự nhiên",
                "Logia rộng kết nối khu bếp",
              ],
            },
            {
              id: "plan-2br-b2",
              title: "Căn góc Suite B2",
              images: [
                {
                  src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1600&auto=format&fit=crop",
                  alt: "Không gian tham khảo căn hộ góc",
                },
              ],
              areaNet: "72,8 m²",
              areaGross: "80,5 m²",
              bedroom: 2,
              bathroom: 2,
              direction: "Tây Bắc",
              highlights: [
                "Căn góc hai mặt thoáng",
                "Phòng ngủ chính có ban công riêng",
              ],
            },
          ],
        },
        {
          tabName: "Căn hộ 3 phòng ngủ",
          plans: [
            {
              id: "plan-3br-c1",
              title: "Căn hộ Grand Suite C1",
              images: [
                {
                  src: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1600&auto=format&fit=crop",
                  alt: "Không gian tham khảo căn hộ ba phòng ngủ",
                },
              ],
              areaNet: "105,2 m²",
              areaGross: "115,8 m²",
              bedroom: 3,
              bathroom: 2,
              direction: "Đông Bắc",
              highlights: [
                "Tầm nhìn rộng hướng công viên",
                "Khu thay đồ riêng trong phòng ngủ chính",
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "mock-timeline",
    type: "TIMELINE_PROGRESS",
    data: {
      heading: "Hành trình kiến tạo dự án",
      subHeading:
        "Đủ ba trạng thái để kiểm tra cách hiển thị tiến độ thi công.",
      currentStatus: "Đang hoàn thiện mặt ngoài và cảnh quan",
      steps: [
        {
          id: "timeline-foundation",
          date: "Quý II/2024",
          title: "Khởi công và thi công móng",
          description: "Hoàn thành hệ thống móng cọc và kết cấu tầng hầm.",
          status: "completed",
          image:
            "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1600&auto=format&fit=crop",
        },
        {
          id: "timeline-finishing",
          date: "Quý III/2026",
          title: "Hoàn thiện nội thất và cảnh quan",
          description:
            "Lắp đặt thiết bị liền tường và hoàn thiện khu vườn trên cao.",
          status: "ongoing",
          image:
            "https://images.unsplash.com/photo-1600607687940-47a04b62d373?q=80&w=1600&auto=format&fit=crop",
        },
        {
          id: "timeline-handover",
          date: "Quý II/2027",
          title: "Bàn giao căn hộ",
          description: "Dự kiến chào đón những cư dân đầu tiên.",
          status: "upcoming",
        },
      ],
    },
  },
  {
    id: "mock-pricing",
    type: "PRICING_TABLE",
    data: {
      heading: "Biểu giá tham khảo",
      subHeading:
        "Số liệu mock dùng để kiểm tra định dạng tiền và các trạng thái giỏ hàng.",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop",
      priceList: [
        {
          unitType: "Căn hộ 1 phòng ngủ",
          minPrice: 4_200_000_000,
          maxPrice: 4_800_000_000,
          areaRange: "45–52 m²",
          status: "sold-out",
        },
        {
          unitType: "Căn hộ 2 phòng ngủ",
          minPrice: 6_500_000_000,
          maxPrice: 7_800_000_000,
          areaRange: "68–82 m²",
          status: "available",
        },
        {
          unitType: "Căn hộ 3 phòng ngủ",
          minPrice: 9_200_000_000,
          maxPrice: 11_500_000_000,
          areaRange: "105–128 m²",
          status: "booking",
        },
        {
          unitType: "Penthouse",
          minPrice: 25_000_000_000,
          areaRange: "240–350 m²",
          status: "booking",
        },
      ],
    },
  },
  {
    id: "mock-sales-policy",
    type: "SALES_POLICY",
    data: {
      heading: "Chính sách bán hàng tham khảo",
      subHeading:
        "Các nội dung dưới đây chỉ là mock phục vụ kiểm tra giao diện, không phải cam kết thương mại.",
      image:
        "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=1600&auto=format&fit=crop",
      policies: [
        {
          title: "Hỗ trợ lãi suất",
          description:
            "Kịch bản mock cho phương án hỗ trợ vay và ân hạn nợ gốc.",
          iconName: "BadgePercent",
        },
        {
          title: "Chiết khấu thanh toán sớm",
          description:
            "Kịch bản mock giúp kiểm tra thẻ ưu đãi có phần mô tả dài.",
          iconName: "TrendingDown",
        },
        {
          title: "Gói nội thất",
          description:
            "Quà tặng mô phỏng dành cho khách hàng hoàn tất giao dịch đúng hạn.",
          iconName: "Gift",
        },
        {
          title: "Đặc quyền cư dân",
          description:
            "Miễn phí quản lý trong thời gian mô phỏng và quyền ưu tiên tiện ích.",
          iconName: "Crown",
        },
      ],
      policyFileUrl: "/documents/mock-sales-policy.pdf",
    },
  },
] satisfies ProjectBlock[];

export const MOCK_PROJECT_BLOCKS = projectBlocksSchema.parse(
  RAW_MOCK_PROJECT_BLOCKS,
);
