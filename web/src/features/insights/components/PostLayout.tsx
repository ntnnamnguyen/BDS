"use client";

import React from "react";
import { motion } from "framer-motion";

import { DownloadPdfButton } from "@/features/insights/mdx/components/DownloadPdfButton";
import { PrintFooter } from "@/features/insights/mdx/components/PrintFooter";
import { PrintHeader } from "@/features/insights/mdx/components/PrintHeader";
import type { PostMetadata } from "@/features/insights/schemas";
import { cn } from "@/lib/utils";

interface PostLayoutProps {
  children: React.ReactNode;
  metadata: PostMetadata;
}

export const PostLayout = ({ children, metadata }: PostLayoutProps) => {
  return (
    <article className="relative max-w-4xl mx-auto px-6 py-12 md:py-20 bg-white">
      {/* 1. PDF ONLY: Header bản quyền xuất hiện ở đầu mỗi trang in */}
      <PrintHeader />

      {/* 2. WEB ONLY: Điều hướng & Actions */}
      <div className="print:hidden flex justify-between items-center mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="h-[1px] w-8 bg-luxury-bronze" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-bronze font-bold">
            {metadata.category}
          </span>
        </motion.div>
        
        <DownloadPdfButton />
      </div>

      {/* 3. MAIN HEADER: Xuất hiện trên cả Web & PDF */}
      <header className="mb-16 print:mb-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl md:text-6xl text-slate-900 leading-[1.1] italic mb-8"
        >
          {metadata.title}
        </motion.h1>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-[10px] text-slate-400 uppercase tracking-[0.2em] border-y border-slate-100 py-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-300">Tác giả:</span>
            <span className="text-slate-900 font-semibold">{metadata.author || "Hanoi Estate"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-300">Ngày xuất bản:</span>
            <span className="text-slate-600">{metadata.date}</span>
          </div>
          {metadata.readTime && (
            <div className="flex items-center gap-2">
              <span className="text-slate-300">Thời gian đọc:</span>
              <span className="text-slate-600">{metadata.readTime}</span>
            </div>
          )}
        </div>
      </header>

      {/* 4. CONTENT AREA: Typography được tinh chỉnh */}
      <main className={cn(
        "prose prose-slate max-w-none",
        "prose-headings:font-serif prose-headings:italic prose-headings:text-slate-900",
        "prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-light text-justify",
        "prose-strong:text-slate-900 prose-strong:font-medium",
        "print:prose-sm print:prose-p:text-black" // Khi in, chữ chuyển sang đen để rõ nét
      )}>
        {children}
      </main>

      {/* 5. PDF ONLY: Footer bản quyền & Số trang */}
      <PrintFooter />

      {/* 6. WEB ONLY: Chữ ký cuối bài mang phong cách cá nhân */}
      <div className="print:hidden mt-20 pt-12 border-t border-slate-100 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-slate-900 mb-4 flex items-center justify-center text-luxury-bronze font-serif italic text-xl">
          H
        </div>
        <p className="font-serif italic text-slate-800 mb-2">Đội ngũ Phân tích Hanoi Estate</p>
        <p className="text-[10px] uppercase tracking-widest text-slate-400">
          Cung cấp góc nhìn thực tế từ trái tim Hà Nội
        </p>
      </div>
    </article>
  );
};
