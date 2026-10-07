import Link from "next/link";
import { LuxuryNavigation, type NavItem } from "./LuxuryNavigation";

export function Header({ data }: { data: readonly NavItem[] }) {
  return (
    <header className="site-header fixed top-0 w-full z-50 border-b border-luxury-taupe/20 bg-luxury-base/80 backdrop-blur-md">
      <div className="container mx-auto grid h-20 grid-cols-[1fr_auto] items-center px-6 md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="justify-self-start font-serif text-2xl tracking-tighter text-luxury-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-bronze"
          aria-label="Hanoi Estate - Trang chủ"
        >
          HANOI<span className="font-light italic text-luxury-bronze">ESTATE</span>
        </Link>

        <LuxuryNavigation data={data} includeContact />

        <div className="hidden items-center justify-self-end md:flex">
          <Link
            href="/contact"
            className="border-b border-luxury-ink pb-1 font-sans text-[10px] uppercase tracking-luxury transition-colors hover:border-luxury-bronze hover:text-luxury-bronze focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-bronze"
          >
            Kết nối riêng tư
          </Link>
        </div>
      </div>
    </header>
  );
}
