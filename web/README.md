# Hanoi Estate Web

Next.js 16 frontend cho website Hanoi Estate. Ứng dụng này chịu trách nhiệm
giao diện, SSR và SEO; toàn bộ dữ liệu nghiệp vụ được đọc/ghi qua REST API của
NestJS. Next.js không kết nối trực tiếp PostgreSQL.

## Kiến trúc dữ liệu

```text
Browser -> Next.js Server Components / Server Actions -> NestJS REST API
Mobile  -----------------------------------------------> NestJS REST API
                                                        -> PostgreSQL
```

- Public pages gọi API từ Server Components qua `src/lib/api`.
- Form và thao tác admin gọi các Server Actions mỏng; admin key không được gửi
  xuống browser.
- DTO dùng tại biên API nằm trong `src/contracts`.
- Prisma schema/migrations cũ của web được lưu chỉ để tham khảo tại
  `legacy/prisma`; không còn được chạy bởi ứng dụng này.
- Ba project từng hard-code trong `src/lib/data.ts` chỉ còn làm mock cho local.
  Production lấy catalog từ Nest; runbook của server có importer idempotent để
  bảo toàn chúng dưới dạng draft, chờ duyệt trước khi publish.

## Chạy local

Yêu cầu Node.js phù hợp với Next.js 16 và pnpm.

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Mặc định:

- Web: `http://localhost:3000`
- NestJS API: `http://localhost:3001/api/v1`

Các biến môi trường:

- `API_BASE_URL`: base URL server-side của NestJS; bắt buộc ở production.
- `BACKEND_ADMIN_API_KEY`: key tối thiểu 32 ký tự, phải trùng
  `server.ADMIN_API_KEY`; production từ chối giá trị mẫu `replace-*`.
- `ADMIN_UI_USERNAME` và `ADMIN_UI_PASSWORD`: lớp HTTP Basic Auth chuyển tiếp
  cho `/admin`; production yêu cầu mật khẩu tối thiểu 16 ký tự, HTTPS và từ
  chối mọi giá trị mẫu `replace-*`.
- `NEXT_PUBLIC_UI_ENABLE_MOCKS`: công tắc mock tổng. Development mặc định bật
  nếu bỏ qua biến này; production luôn vô hiệu hóa mock.
- `API_ENABLE_MOCK_FALLBACK`: mock project/lead phía server; mặc định bật theo
  công tắc tổng ở development. Đặt `false` nếu muốn gọi backend thật nhưng vẫn
  giữ các bộ chọn kịch bản UI.
- `API_MOCK_LEAD_RESULT`: kết quả mặc định của form mock (`success`, `conflict`
  hoặc `error`); người phát triển cũng có thể chọn trực tiếp trên giao diện.
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`: public token dành cho Mapbox trong browser.

Không đặt `API_BASE_URL` hoặc admin key dưới tiền tố `NEXT_PUBLIC_`.

Basic Auth chỉ là lớp bảo vệ tạm thời cho giai đoạn chuyển đổi. Trước khi có
nhiều quản trị viên hoặc ứng dụng mobile quản trị, thay nó bằng đăng nhập có
session và phân quyền theo vai trò. Mọi lời gọi admin trong data-access layer
đều kiểm tra lại Basic Auth trước khi đính kèm `BACKEND_ADMIN_API_KEY`.

## Kiểm tra

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Backend nên chạy khi kiểm thử luồng dữ liệu thực. Các public route được SSR ở
runtime và cache request API trong thời gian ngắn; admin luôn dùng dữ liệu mới.
