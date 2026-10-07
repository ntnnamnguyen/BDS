# Hanoi Estate

Workspace này gồm hai ứng dụng triển khai độc lập:

- `web/`: Next.js, phụ trách giao diện web, SSR và SEO.
- `server/`: NestJS, sở hữu API, nghiệp vụ và PostgreSQL.

Hai ứng dụng dùng chung một Git repository tại thư mục BDS; mỗi ứng dụng vẫn
có thể build và triển khai độc lập. Quy trình commit và push nằm tại
[`GITHUB.md`](GITHUB.md).

Tài liệu kiến trúc và quy tắc phân chia trách nhiệm nằm tại
[`server/docs/architecture.md`](server/docs/architecture.md). Quy trình triển
khai migration an toàn nằm tại
[`server/docs/migration-runbook.md`](server/docs/migration-runbook.md).

## Luồng chạy local

```text
Browser -> Next.js :3000 -> NestJS :3001 -> PostgreSQL
Mobile  ----------------^             |
                                      +-> AI provider/worker (giai đoạn sau)
```

Khởi động mỗi ứng dụng trong một terminal riêng:

```bash
cd server
pnpm install
pnpm prisma:generate
pnpm run start:dev
```

```bash
cd web
pnpm install
pnpm run dev
```

Sao chép `.env.example` trong từng ứng dụng thành `.env` hoặc `.env.local` và
điền giá trị phù hợp. Không commit secret.

## Quy tắc quan trọng

- Chỉ `server/` được truy cập PostgreSQL và quản lý Prisma migrations.
- `web/` gọi REST API; không import Prisma Client.
- Mobile dùng cùng REST API với web.
- Không chạy `prisma db push` trên database dùng chung.
- Migration phải được tạo và triển khai từ `server/`.
