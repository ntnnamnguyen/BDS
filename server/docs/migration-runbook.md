# Runbook chuyển quyền sở hữu database sang NestJS

Migration `20260503160000_expand_projects_and_add_leads` đã được tạo nhưng chưa
được áp dụng. Chỉ chạy quy trình này trong một cửa sổ triển khai có backup và
quyền rollback rõ ràng.

## 1. Chuẩn bị

- Tạo backup PostgreSQL và thử phục hồi backup trên môi trường staging.
- Cấu hình `server/.env` trỏ đúng database đích.
- Dừng mọi tiến trình cũ còn có thể ghi trực tiếp từ Next.js vào bảng
  `customer` trong thời gian cutover.
- Đọc lại SQL trong
  `server/prisma/migrations/20260503160000_expand_projects_and_add_leads`.

Không chạy `prisma db push`, `prisma migrate reset` hoặc sửa migration đã được
ghi nhận trong `_prisma_migrations`.

## 2. Kiểm tra trước triển khai

```bash
cd server
pnpm prisma:validate
pnpm prisma:migrate:status
```

Kết quả mong đợi là bốn migration cũ đã áp dụng và đúng một migration mới đang
pending. Prisma trả exit code `1` khi còn migration pending; ở bước kiểm tra này
đó là trạng thái dự kiến. Nếu checksum hoặc lịch sử khác, dừng triển khai để
đối chiếu trước.

Ghi lại số dòng trước migration:

```sql
SELECT COUNT(*) AS legacy_customers FROM customer;
SELECT COUNT(*) AS projects FROM projects;
```

## 3. Triển khai

```bash
cd server
pnpm prisma:generate
pnpm prisma:migrate:deploy
pnpm data:legacy-projects:plan
pnpm data:legacy-projects:apply
pnpm build
pnpm start:prod
```

Import project là idempotent theo `slug`: project đã tồn tại sẽ được giữ nguyên,
không bị ghi đè. Importer luôn tạo `DRAFT`; phải xác minh tên, giá, pháp lý, lợi
suất và publish từng project đã duyệt trước khi chuyển traffic. Ba đường dẫn
thumbnail cũ không có asset tương ứng trong web, vì vậy importer để
`thumbnailUrl = null` để UI dùng placeholder cho tới khi có media URL tuyệt đối.

Sau khi health check thành công, cấu hình web với `API_BASE_URL` và
`BACKEND_ADMIN_API_KEY`, rồi triển khai Next.js. Không đưa admin key vào biến
`NEXT_PUBLIC_*`.

## 4. Xác minh sau triển khai

```sql
SELECT COUNT(*) AS legacy_customers FROM customer;
SELECT COUNT(*) AS migrated_leads
FROM leads
WHERE legacy_customer_id IS NOT NULL;

SELECT COUNT(*) AS published_projects
FROM projects
WHERE status = 'PUBLISHED';

SELECT migration_name, finished_at, rolled_back_at
FROM _prisma_migrations
ORDER BY started_at DESC
LIMIT 5;
```

- Số lead có `legacy_customer_id` phải bằng số customer tại thời điểm cutover.
- Nếu database ban đầu chưa có project, phải có ba draft sau bước import; số
  project published chỉ tăng sau khi nội dung đã được duyệt thủ công.
- `GET /api/v1/health` và `GET /api/v1/health/ready` phải trả thành công.
- Gửi thử một contact form và xác minh chỉ có một lead cho cùng
  `client_request_id`.
- Kiểm tra danh sách/chi tiết dự án công khai và trang quản trị qua NestJS.

Giữ bảng `customer` ít nhất một release. Việc xóa bảng cũ phải là một migration
riêng sau khi đã xác nhận không còn consumer và không còn delta cần đồng bộ.
