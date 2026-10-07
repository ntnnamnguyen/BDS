import Link from "next/link";

const disabledLinkClass =
  "cursor-not-allowed text-white/35";

export default function Footer() {
  return (
    <footer className="site-footer bg-luxury-ink text-white pt-24 pb-12 border-t border-luxury-taupe/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">

          {/* CỘT 1: DẤU ẤN CÁ NHÂN (BRANDING) */}
          <div className="md:col-span-5 space-y-8">
            <h2 className="font-serif text-3xl tracking-tighter">
              Hanoi Estate <span className="text-luxury-bronze">.</span>
            </h2>
            <p className="font-sans text-sm text-white/60 leading-relaxed max-w-sm">
              Kết hợp giữa tư duy phân tích dữ liệu của một lập trình viên và sự am hiểu thị trường bất động sản thủ đô. Tôi không bán nhà, tôi cung cấp giải pháp tích sản bền vững.
            </p>
            <div className="flex flex-wrap items-center gap-6 font-sans text-[10px] uppercase tracking-widest">
              <span aria-disabled="true" className={disabledLinkClass}>LinkedIn — sắp cập nhật</span>
              <span aria-disabled="true" className={disabledLinkClass}>Zalo — sắp cập nhật</span>
              <span aria-disabled="true" className={disabledLinkClass}>Facebook — sắp cập nhật</span>
            </div>
          </div>

          {/* CỘT 2: NAVIGATION NHANH */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.3em] text-luxury-bronze">Danh mục</h4>
            <ul className="space-y-4 font-serif text-lg">
              <li><Link href="/projects" className="inline-block transition-transform duration-300 hover:translate-x-2">Quỹ căn tuyển lựa</Link></li>
              <li><Link href="/analysis" className="inline-block transition-transform duration-300 hover:translate-x-2">Công cụ dòng tiền</Link></li>
              <li><Link href="/expert-insights" className="inline-block transition-transform duration-300 hover:translate-x-2">Báo cáo thị trường</Link></li>
              <li><span aria-disabled="true" className={disabledLinkClass}>Về tôi — sắp cập nhật</span></li>
            </ul>
          </div>

          {/* CỘT 3: CALL TO ACTION NHỎ */}
          <div className="md:col-span-4 space-y-6 bg-white/5 p-8 border border-white/10">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.3em] text-luxury-bronze">Liên kết riêng tư</h4>
            <p className="font-sans text-xs text-white/50 leading-relaxed">
              Để nhận danh sách các căn hộ ngoại giao không công khai trên thị trường, vui lòng kết nối trực tiếp.
            </p>
            <div className="pt-2">
              <p className="font-serif text-xl mb-4">Hotline đang cập nhật</p>
              <Link
                href="/contact"
                className="border-b border-luxury-bronze pb-1 text-[10px] uppercase tracking-widest transition-colors hover:text-luxury-bronze focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-bronze"
              >
                Bắt đầu cuộc hội thoại
              </Link>
            </div>
          </div>
        </div>
       

        {/* PHẦN CUỐI: LEGAL & COPYRIGHT */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6">
          <p className="font-sans text-[9px] uppercase tracking-widest text-white/40">
            © 2026 Design & Coded by Nguyễn Thế Nam - Bất động sản dòng tiền Hà Nội.
          </p>
          <div className="flex gap-8 font-sans text-[9px] uppercase tracking-widest text-white/40">
            <span aria-disabled="true" className={disabledLinkClass}>Chính sách bảo mật — sắp cập nhật</span>
            <Link href="/disclaimer" className="hover:text-white transition-colors">Miễn trừ trách nhiệm</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
