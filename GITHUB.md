# Đưa code lên GitHub

`web/` và `server/` dùng chung một Git repository tại thư mục BDS. Chạy lệnh
Git tại BDS để commit cả hai ứng dụng; mỗi ứng dụng vẫn deploy độc lập.

Khi chuyển sang repository chung, các thư mục `.git` cũ được chuyển vào
`backups/git-repositories/`. Thư mục này được ignore và chỉ lưu trên máy.
Lịch sử và trạng thái Git cũ vẫn nằm trong bản sao lưu, nhưng không được nhập
vào lịch sử repository chung. Không tạo thêm repository Git trong `web/`
hoặc `server/`.

## Các file được loại trừ

- Thư viện và cache: `node_modules/`, `.pnpm-store/`, `.cache/`.
- Kết quả build: `.next/`, `dist/`, `build/`, `out/`, `*.tsbuildinfo`.
- Log, báo cáo kiểm thử, file tạm và database/backup cục bộ.
- `.env` và các biến thể, khóa riêng, `.aws/`, `.ssh/`.
- Cấu hình triển khai cục bộ, IDE và công cụ agent.

Vẫn commit `pnpm-lock.yaml`, mã nguồn, tài nguyên giao diện, cấu hình ứng dụng,
Prisma schema và migration SQL. `.env.example` được phép commit và chỉ nên chứa
giá trị mẫu; không điền mật khẩu, token hoặc khóa thật vào file này.

## Kiểm tra và push

Thực hiện tại thư mục BDS:

```bash
cd /home/namnt/CodeSpace/bds
git status --short
git add .
git diff --cached --stat
git diff --cached
git commit -m "Prepare project for GitHub"
git remote -v
git branch --show-current
```

Kiểm tra nội dung đã stage trước khi commit, đặc biệt với file cấu hình và
`.env.example`. Nếu chưa có remote `origin`, thêm URL repository của bạn:

```bash
git remote add origin https://github.com/USERNAME/REPOSITORY.git
```

Push nhánh hiện tại và thiết lập upstream:

```bash
git push -u origin HEAD
```

Chỉ cần một URL repository cho cả hai ứng dụng. Nếu `origin` đã tồn tại, dùng
URL hiện có hoặc sửa bằng `git remote set-url origin URL` khi cần.

Sau lần push đầu tiên, mỗi lần cập nhật chạy `git add .`, kiểm tra
`git diff --cached`, rồi `git commit -m "Describe changes"` và `git push`.

## File đã được Git theo dõi

`.gitignore` chỉ ngăn thêm file chưa được theo dõi. Kiểm tra các file đã được
theo dõi nhưng nay khớp quy tắc ignore bằng:

```bash
git ls-files -ci --exclude-standard
```

Nếu lệnh trả về đường dẫn không nên commit, bỏ riêng đường dẫn đó khỏi index
bằng `git rm --cached -- DUONG_DAN` (thêm `-r` nếu là thư mục), rồi commit thay
đổi. File vẫn nằm trên máy. Không cần xóa toàn bộ index.

Nếu một secret từng được commit, bỏ theo dõi file không xóa secret khỏi lịch
sử Git; cần thu hồi/đổi secret đó.
