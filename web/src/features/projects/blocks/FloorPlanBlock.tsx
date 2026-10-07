'use client';

import { useState } from 'react';
import { Bed, Bath, Compass, ChevronRight, ZoomIn } from 'lucide-react';
import Link from 'next/link';

// Shadcn UI
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { FloorPlanBlockData } from '@/features/projects/schemas';
import { ImageGallery } from '@/components/ui/image-gallery';

export function FloorPlanBlock({ data }: { data: FloorPlanBlockData }) {
  const { heading, description, tabs } = data;

  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [activePlanIdx, setActivePlanIdx] = useState(0);

  const currentTab = tabs[activeTabIdx];
  const currentPlan = currentTab?.plans[activePlanIdx];

  if (!currentTab || !currentPlan) return null;

  return (
    <section className="py-24 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">{heading}</h2>
            <p className="text-slate-500 font-light leading-relaxed">{description}</p>
          </div>
          <Button asChild variant="outline" className="rounded-none border-slate-300 hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest text-[10px] h-12">
            <Link href="/contact">Yêu cầu Brochure Mặt Bằng</Link>
          </Button>
        </div>

        <Tabs defaultValue="0" className="w-full" onValueChange={(v) => { setActiveTabIdx(parseInt(v)); setActivePlanIdx(0); }}>
          <TabsList className="bg-transparent h-auto p-0 flex-wrap gap-8 border-b border-slate-200 w-full justify-start rounded-none mb-12">
            {tabs.map((tab, idx) => (
              <TabsTrigger
                key={idx}
                value={idx.toString()}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-luxury-bronze data-[state=active]:bg-transparent data-[state=active]:text-luxury-bronze pb-4 px-0 text-sm tracking-widest uppercase font-medium transition-all"
              >
                {tab.tabName}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar (Giữ nguyên như cũ) */}
            <div className="lg:col-span-4 order-2 lg:order-1 space-y-6">
              <div className="grid grid-cols-1 gap-2">
                {currentTab.plans.map((plan, pIdx) => (
                  <button
                    key={plan.id}
                    onClick={() => setActivePlanIdx(pIdx)}
                    className={`group w-full flex items-center justify-between p-4 transition-all duration-300 border ${activePlanIdx === pIdx
                      ? 'border-luxury-bronze bg-white shadow-lg translate-x-2'
                      : 'border-transparent bg-white/50 hover:bg-white hover:shadow-sm'
                      }`}
                  >
                    <span className={`text-sm font-medium ${activePlanIdx === pIdx ? 'text-luxury-bronze' : 'text-slate-600'}`}>
                      {plan.title}
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activePlanIdx === pIdx ? 'text-luxury-bronze translate-x-1' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>

              <Card className="border-none shadow-xl bg-white rounded-none overflow-hidden">
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Thông thủy</p>
                      <p className="font-serif text-2xl text-slate-800">{currentPlan.areaNet}</p>
                    </div>
                    <div className="space-y-2 border-l pl-8 border-slate-100">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Tim tường</p>
                      <p className="font-serif text-2xl text-slate-800">{currentPlan.areaGross}</p>
                    </div>
                  </div>
                  <Separator className="bg-slate-100" />
                  <div className="flex justify-between items-center px-2">
                    <div className="flex flex-col items-center gap-2">
                      <Bed className="w-5 h-5 text-luxury-bronze/70" />
                      <span className="text-xs text-slate-500 font-medium">{currentPlan.bedroom} PN</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Bath className="w-5 h-5 text-luxury-bronze/70" />
                      <span className="text-xs text-slate-500 font-medium">{currentPlan.bathroom} WC</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Compass className="w-5 h-5 text-luxury-bronze/70" />
                      <span className="text-xs text-slate-500 font-medium">{currentPlan.direction}</span>
                    </div>
                  </div>
                  <Button asChild className="w-full bg-slate-900 hover:bg-luxury-bronze text-white rounded-none h-14 uppercase tracking-[0.2em] text-[10px] font-bold">
                    <Link href="/contact">Yêu cầu tư vấn căn này</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Khu vực ảnh với tính năng Zoom */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <div className="relative bg-white shadow-inner border border-slate-100 flex items-center justify-center p-4 md:p-12 group overflow-hidden">

                {/* Overlay Hint cho khách hàng */}
                <div className="absolute top-6 right-6 z-10 flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold bg-white/80 backdrop-blur px-3 py-2 rounded-full border border-slate-100 transition-opacity group-hover:opacity-100 md:opacity-0">
                  <ZoomIn className="w-3 h-3" /> Click để phóng to
                </div>
                <div className="relative aspect-[4/3] w-full">
                  <ImageGallery images={currentPlan.images}></ImageGallery>
                </div>
                {/* Grid trang trí */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />
              </div>

              <div className="mt-4 flex justify-center lg:justify-end">
                <p className="text-[11px] text-slate-400 italic">
                  * Lưu ý: Hình ảnh mặt bằng mang tính chất minh họa và có thể thay đổi theo thiết kế chi tiết.
                </p>
              </div>
            </div>
          </div>
        </Tabs>
      </div>

      {/* Tùy chỉnh CSS cho thư viện Zoom để hợp style Luxury */}
      <style jsx global>{`
        [data-rmiz-modal-overlay="visible"] {
          background-color: rgba(255, 255, 255, 0.98) !important;
          backdrop-filter: blur(10px);
        }
        [data-rmiz-btn-unzoom] {
          background-color: #000 !important;
          color: #fff !important;
          border-radius: 0 !important; /* Vuông vức sang trọng */
        }
      `}</style>
    </section>
  );
}
