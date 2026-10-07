# Kiến trúc Hanoi Estate

## Ranh giới hệ thống

```text
┌──────────────┐       ┌──────────────────────────────────────┐
│ Next.js web  │──────>│ NestJS API /api/v1                  │
│ SSR + UI     │       │                                      │
└──────────────┘       │  health  projects  leads  ai-port   │
                       │                  │                   │
┌──────────────┐       │             Prisma                  │
│ Mobile app   │──────>│                  │                   │
└──────────────┘       └──────────────────┼───────────────────┘
                                          v
                                      PostgreSQL
```

### `web/`

- Render giao diện, SEO và nội dung MDX dành riêng cho website.
- Đọc dữ liệu công khai bằng API client server-only.
- Mutation từ Client Component đi qua Next Server Action rồi tới NestJS.
- Không chứa database credential và không sinh Prisma Client.
- `/admin` dùng HTTP Basic Auth chuyển tiếp; data-access layer kiểm tra lại
  request trước khi gắn backend admin key. Cần thay bằng session/RBAC khi có
  nhiều quản trị viên.

### `server/`

- Là nguồn sự thật duy nhất cho dữ liệu dự án và khách hàng tiềm năng.
- Chịu trách nhiệm validation, authorization, versioning và OpenAPI.
- Sở hữu Prisma schema cùng toàn bộ migration history.
- Cung cấp abstraction cho AI provider; queue/worker được thêm khi có tác vụ AI
  thực tế.

## Quy ước API

- Base path: `/api/v1`.
- Public: đọc dự án đã xuất bản và tạo lead.
- Admin: quản lý dự án/lead, bắt buộc xác thực.
- Payload đầu vào được validate tại NestJS; web validation chỉ phục vụ UX.
- Không trả trực tiếp Prisma model nếu response có thể chứa trường nội bộ.

## Ownership dữ liệu

```text
server/prisma/schema.prisma       canonical schema
server/prisma/migrations/         canonical migration history
web/src/lib/api/                  web-to-api adapter
web/src/contracts/                response/request types dùng trong UI
```

Lịch sử Prisma cũ của frontend chỉ được giữ làm hồ sơ chuyển đổi, không được sử
dụng để chạy migration mới.

## Hướng mở rộng AI

AI nằm sau một provider interface trong NestJS. Tác vụ ngắn có thể xử lý đồng
bộ; tác vụ tạo nội dung, phân tích tài liệu hoặc tổng hợp lead nên được biểu
diễn dưới dạng job và chạy bởi worker riêng. Dữ liệu nhận diện cá nhân phải được
giảm thiểu hoặc che trước khi gửi sang provider.
