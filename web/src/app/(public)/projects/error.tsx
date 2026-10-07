"use client";

export default function ProjectsError({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-screen bg-luxury-base px-6 pt-40 text-center">
      <h1 className="font-serif text-4xl text-luxury-ink">
        Danh mục đang tạm gián đoạn
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-sm text-luxury-stone">
        Hệ thống dữ liệu chưa phản hồi. Quý khách vui lòng thử lại sau ít phút.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 border-b border-luxury-bronze pb-1 text-[10px] uppercase tracking-widest text-luxury-bronze"
      >
        Thử lại
      </button>
    </main>
  );
}
