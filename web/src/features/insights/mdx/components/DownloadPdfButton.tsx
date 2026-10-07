"use client";
import { FileDown } from "lucide-react";

export const DownloadPdfButton = () => {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden flex items-center gap-2 px-6 py-3 bg-white border border-luxury-bronze text-luxury-bronze hover:bg-luxury-bronze hover:text-white transition-all uppercase tracking-widest text-[11px] font-semibold shadow-sm"
    >
      <FileDown size={16} />
      Tải báo cáo PDF (Lưu trữ)
    </button>
  );
};
