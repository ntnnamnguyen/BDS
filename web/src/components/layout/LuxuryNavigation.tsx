'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

export interface NavItem {
  id: string | number;
  name: string;
  link: string;
  slug: string;
}

interface LuxuryNavigationProps {
  data: readonly NavItem[];
  className?: string;
  activeSlug?: string;
  includeContact?: boolean;
}

export function LuxuryNavigation({
  data,
  className,
  activeSlug,
  includeContact = false,
}: LuxuryNavigationProps) {
  const pathname = usePathname();
  const mobileMenuId = useId();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);

  const isItemActive = (item: NavItem) =>
    activeSlug
      ? activeSlug === item.slug
      : pathname === item.link || pathname.startsWith(`${item.link}/`);

  useEffect(() => {
    if (!mobileOpen) return;

    mobileMenuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMobileOpen(false);
      mobileTriggerRef.current?.focus();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (
        mobileContainerRef.current &&
        !mobileContainerRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [mobileOpen]);

  return (
    <>
      <NavigationMenu
        aria-label="Điều hướng chính"
        className={cn('site-nav hidden md:flex', className)}
      >
        <NavigationMenuList className="gap-8">
          {data.map((item) => {
            const isActive = isItemActive(item);

            return (
              <NavigationMenuItem key={item.id}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.link}
                    scroll={item.link.startsWith('?') ? false : undefined}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative cursor-pointer bg-transparent pb-1 font-sans text-[10px] uppercase tracking-[0.3em] transition-colors duration-300',
                      'focus:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-bronze active:bg-transparent',
                      isActive
                        ? 'font-bold text-luxury-bronze'
                        : 'text-luxury-stone hover:text-luxury-bronze',
                    )}
                  >
                    {item.name}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-px w-full bg-luxury-bronze"
                      />
                    )}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>

      <div ref={mobileContainerRef} className="relative justify-self-end md:hidden">
        <button
          ref={mobileTriggerRef}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls={mobileMenuId}
          aria-label={mobileOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
          onClick={() => setMobileOpen((open) => !open)}
          className="flex size-11 items-center justify-center border border-luxury-taupe/60 text-luxury-ink transition-colors hover:border-luxury-bronze hover:text-luxury-bronze focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-bronze"
        >
          {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        {mobileOpen && (
          <nav
            ref={mobileMenuRef}
            id={mobileMenuId}
            aria-label="Điều hướng chính trên thiết bị di động"
            className="site-nav absolute right-0 top-[calc(100%+0.75rem)] w-[min(20rem,calc(100vw-3rem))] border border-luxury-taupe/40 bg-luxury-base p-3 shadow-2xl"
          >
            <ul className="space-y-1">
              {data.map((item) => {
                const isActive = isItemActive(item);

                return (
                  <li key={item.id}>
                    <Link
                      href={item.link}
                      scroll={item.link.startsWith('?') ? false : undefined}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'block px-4 py-3 font-sans text-xs uppercase tracking-[0.2em] transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-luxury-bronze',
                        isActive
                          ? 'bg-luxury-taupe/30 font-bold text-luxury-bronze'
                          : 'text-luxury-stone hover:bg-luxury-taupe/20 hover:text-luxury-bronze',
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
              {includeContact && (
                <li className="mt-2 border-t border-luxury-taupe/40 pt-2">
                  <Link
                    href="/contact"
                    aria-current={pathname === '/contact' ? 'page' : undefined}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 font-sans text-xs uppercase tracking-[0.2em] text-luxury-bronze transition-colors hover:bg-luxury-taupe/20 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-luxury-bronze"
                  >
                    Kết nối riêng tư
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </>
  );
}
