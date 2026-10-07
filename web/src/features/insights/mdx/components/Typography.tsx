'use client';

import React from 'react';
import { cn } from "@/lib/utils";

export const Typography = {
  // Tiêu đề chương/phần lớn (H2) - Điểm nhấn Serif và vạch kẻ đồng
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "mt-16 scroll-m-20 border-b border-luxury-bronze/20 pb-4 font-serif text-3xl font-light tracking-wide text-slate-800 italic first:mt-0",
        className
      )}
      {...props}
    />
  ),

  // Tiêu đề phụ (H3) - Mạnh mẽ và sang trọng
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "mt-10 scroll-m-20 text-xl font-serif font-semibold tracking-tight text-slate-800",
        className
      )}
      {...props}
    />
  ),

  // Đoạn văn bản (P) - Ưu tiên sự thông thoáng (Readability)
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        "leading-8 not-first:mt-6 text-slate-600 font-light text-[17px] antialiased",
        className
      )}
      {...props}
    />
  ),

  // Trích dẫn (Blockquote) - Biến thành hộp Expert Insight
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        "mt-10 border-l-2 border-luxury-bronze bg-slate-50/50 py-8 px-10 italic font-serif text-xl text-slate-700 shadow-sm",
        className
      )}
      {...props}
    />
  ),

  // Danh sách không thứ tự (UL)
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-3 text-slate-600 font-light", className)} {...props} />
  ),

  // Danh sách có thứ tự (OL)
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("my-6 ml-6 list-decimal [&>li]:mt-3 text-slate-600 font-light", className)} {...props} />
  ),

  // Nhấn mạnh (Strong) - Dùng màu thương hiệu
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn("font-semibold text-luxury-bronze", className)} {...props} />
  ),

  // Đường kẻ ngang (HR)
  hr: ({ ...props }) => <hr className="my-12 border-slate-200" {...props} />,
};