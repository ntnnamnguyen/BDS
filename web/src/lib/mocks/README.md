# UI mock data

Mock trong thư mục này dùng để phát triển giao diện khi backend NestJS chưa chạy
và để làm fixture cho component/unit test. Dữ liệu được kiểm tra bằng schema hoặc
TypeScript type thật của từng feature.

## Chạy mock khi phát triển

Chỉ cần chạy `pnpm dev`: chế độ mock được bật mặc định ở development và luôn
bị khóa ở production. Có thể tắt toàn bộ mock UI và mock API trong `.env.local`:

```bash
NEXT_PUBLIC_UI_ENABLE_MOCKS=false
```

Hoặc chỉ tắt phần mock project/lead phía server, nhưng vẫn giữ các bộ chọn kịch
bản trực quan của Insights và Analysis:

```bash
API_ENABLE_MOCK_FALLBACK=false
```

Form liên hệ có bộ chọn kết quả ngay trên giao diện. Biến sau dùng để chọn giá
trị mặc định:

```bash
API_MOCK_LEAD_RESULT=success # success | conflict | error
```

Không import barrel `@/lib/mocks` vào component production; hãy import trực tiếp
file cần dùng để tránh đưa toàn bộ fixture vào client bundle.

## Xem các trạng thái trên giao diện

- `/`, `/projects`, `/projects/[slug]`: danh sách, chi tiết và toàn bộ block dự án.
- `/admin`, `/admin/projects`: dashboard và dữ liệu quản trị dự án.
- `/expert-insights?mockState=populated`: danh sách đầy đủ.
- `/expert-insights?mockState=singleResult`: trạng thái chỉ có một kết quả.
- `/expert-insights?mockState=empty`: empty state.
- `/analysis`: chọn các kịch bản dòng tiền dương, âm, không vay và đòn bẩy cao.
- `/contact` và form riêng trong chi tiết dự án: chọn success, conflict hoặc error.

Nhãn **Dữ liệu mô phỏng** giúp phân biệt rõ fixture với dữ liệu backend thật.

## Phạm vi dữ liệu

- `projects.ts`: danh sách và chi tiết dự án; dùng cho cả `/projects` và giao
  diện quản trị project.
- `project-blocks.ts`: location, facilities, gallery, floor plan, timeline,
  pricing và sales policy.
- `insights.ts`: featured/list/category, metadata tối thiểu, tiêu đề dài và empty
  state.
- `investment.ts`: dòng tiền dương, dòng tiền âm, không vay và đòn bẩy cao.
- `leads.ts`: input hợp lệ, lead đã tạo và kết quả success/conflict/validation/error.
- `admin-dashboard.ts`: dashboard, activity và trạng thái tài nguyên
  healthy/warning/critical.
