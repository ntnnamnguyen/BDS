import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { PUBLIC_NAVIGATION_ITEMS } from "@/config/navigation";

export const metadata: Metadata = {
  title: "Hanoi Estate | Cố vấn bất động sản Hà Nội",
  description: "Giải pháp đầu tư và phân tích dòng tiền bất động sản cao cấp tại Hà Nội.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 bg-luxury-ink px-4 py-3 text-sm text-white transition-transform focus:translate-y-0"
      >
        Bỏ qua điều hướng
      </a>
      <Header data={PUBLIC_NAVIGATION_ITEMS} />
      <div id="main-content" tabIndex={-1} className="flex-1 pt-5">
        {children}
      </div>
      <Footer />
      <Toaster
        theme="light"
        position="top-right"
        richColors={false}
        toastOptions={{
          unstyled: false,
          classNames: {
            toast:
              "group !rounded-none !border-luxury-bronze/30 !bg-[#F7F7F7]/90 !p-6 !shadow-[0_20px_50px_rgba(0,0,0,0.5)] !backdrop-blur-xl",
            title: "font-serif text-lg italic tracking-wide !text-luxury-ink",
            description:
              "mt-1 text-xs font-light uppercase tracking-[0.2em] !text-luxury-stone",
            actionButton: "rounded-none !bg-luxury-ink !text-white",
            cancelButton: "rounded-none !bg-luxury-taupe !text-luxury-ink",
            success: "!border-luxury-bronze",
            error: "!border-red-900/50",
          },
        }}
      />
    </div>
  );
}
