import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  PublicationStatus,
  SalesStatus,
} from '../src/generated/prisma/client.js';

const legacyProjects = [
  {
    slug: 'heritage-west-lake',
    name: 'The Heritage West Lake',
    location: 'Lạc Long Quân, Tây Hồ',
    priceRange: 'Từ 140 triệu/m²',
    salesStatus: SalesStatus.OPEN_FOR_SALE,
    legalStatus: 'Sổ hồng lâu dài',
    expectedYield: '5.5% - 6.2%',
    description:
      'Biểu tượng sống thượng lưu bên bờ Hồ Tây với 100% căn hộ sở hữu sảnh thang máy riêng và tầm nhìn panorama vĩnh cửu.',
    features: [
      'Hồ bơi vô cực nước ấm trên cao',
      'Sảnh thang máy riêng cho từng căn hộ',
      'Quản lý bởi thương hiệu quốc tế',
      'Tiêu chuẩn bàn giao hạng S',
    ],
    analysis: {
      pros: [
        'Vị trí độc tôn ven Hồ Tây, quỹ đất cuối cùng',
        'Chủ đầu tư Capitaland uy tín toàn cầu',
        'Cộng đồng cư dân tinh hoa, bảo mật cao',
      ],
      cons: [
        'Mức giá thuộc ngưỡng cao nhất thị trường',
        'Diện tích căn hộ lớn, tổng giá trị tài sản cao',
      ],
      investmentTarget:
        'Khách hàng mua tích sản hoặc cho người nước ngoài, cấp quản lý thuê lâu dài.',
    },
  },
  {
    slug: 'grand-marina-hanoi',
    name: 'Grand Marina Hanoi',
    location: 'Hàng Bài, Hoàn Kiếm',
    priceRange: 'Giá theo yêu cầu',
    salesStatus: SalesStatus.COMING_SOON,
    legalStatus: 'Hợp đồng mua bán',
    expectedYield: '4.8% - 5.5%',
    description:
      'Dòng bất động sản hàng hiệu (Branded Residences) đầu tiên tại trung tâm phố cổ, định nghĩa lại khái niệm xa xỉ tại thủ đô.',
    features: [
      'Dịch vụ quản gia chuẩn Marriott',
      'Kiến trúc tân cổ điển tinh tế',
      'Hầm rượu và khu Cigar Lounge riêng biệt',
    ],
    analysis: {
      pros: [
        'Giá trị di sản không thể thay thế',
        'Số lượng giới hạn, tính khan hiếm cực cao',
        'Dịch vụ vận hành đẳng cấp thế giới',
      ],
      cons: [
        'Khu vực phố cổ hạn chế về hạ tầng giao thông giờ cao điểm',
        'Yêu cầu chứng minh tài chính khi đặt chỗ',
      ],
      investmentTarget: 'Nhà đầu tư sưu tầm bất động sản độc bản.',
    },
  },
  {
    slug: 'the-metropole-thanh-xuan',
    name: 'The Metropole',
    location: 'Nguyễn Tuân, Thanh Xuân',
    priceRange: 'Từ 85 triệu/m²',
    salesStatus: SalesStatus.HANDED_OVER,
    legalStatus: 'Đã có sổ đỏ',
    expectedYield: '6.5% - 7.5%',
    description:
      'Tổ hợp căn hộ cao cấp và văn phòng hạng A, điểm đến lý tưởng cho các chuyên gia và gia đình hiện đại tại cửa ngõ phía Tây.',
    features: [
      'Gần tuyến Metro số 2A',
      'Hệ thống Smart Home toàn diện',
      'Tiện ích nội khu khép kín',
    ],
    analysis: {
      pros: [
        'Dòng tiền cho thuê cực tốt nhờ vị trí trung tâm hành chính',
        'Pháp lý an toàn tuyệt đối',
        'Giá trị sử dụng thực tế cao',
      ],
      cons: [
        'Mật độ xây dựng khu vực xung quanh khá cao',
        'Không gian xanh nội khu vừa phải',
      ],
      investmentTarget:
        'Nhà đầu tư ưu tiên dòng tiền hàng tháng và tính an toàn.',
    },
  },
] as const;

async function importProjects(): Promise<void> {
  if (!process.argv.includes('--apply')) {
    console.table(
      legacyProjects.map(({ name, slug, salesStatus }, index) => ({
        order: index + 1,
        slug,
        name,
        salesStatus,
      })),
    );
    console.log(
      'Dry run only. Run pnpm data:legacy-projects:apply after the canonical migration is deployed.',
    );
    return;
  }

  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) throw new Error('DATABASE_URL is required');

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });

  try {
    for (const [index, project] of legacyProjects.entries()) {
      const existing = await prisma.project.findUnique({
        where: { slug: project.slug },
        select: { id: true },
      });

      if (existing) {
        console.log(`Skipped existing project: ${project.slug}`);
        continue;
      }

      await prisma.project.create({
        data: {
          ...project,
          analysis: { ...project.analysis },
          features: [...project.features],
          featured: true,
          publicationStatus: PublicationStatus.DRAFT,
          publishedAt: null,
          seoDescription: project.description,
          seoTitle: project.name,
          sortOrder: index + 1,
          thumbnailUrl: null,
          page: { create: { blocks: [] } },
        },
      });
      console.log(`Imported draft project: ${project.slug}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

void importProjects().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
