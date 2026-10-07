'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgePercent,
  Crown,
  FileDown,
  Gift,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SalesPolicyBlockData } from '@/features/projects/schemas';

export default function SalesPolicyBlock({ data }: { data: SalesPolicyBlockData }) {
  const { heading, subHeading, image, policies, policyFileUrl } = data;

  const iconRegistry: Record<string, LucideIcon> = {
    BadgePercent,
    Crown,
    Gift,
    TrendingDown,
  };

  // Helper để lấy Icon động từ Lucide
  const IconRender = ({ name }: { name: string }) => {
    const Icon = iconRegistry[name] || Gift;
    return <Icon className="w-6 h-6 text-luxury-bronze" strokeWidth={1.5} />;
  };

  return (
    <section className="py-24 bg-[#FAF9F6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* CỘT TRÁI: ẢNH LIFESTYLE (6 PHẦN) */}
          {image && (
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden shadow-2xl">
                <Image 
                  src={image} 
                  alt={heading} 
                  fill 
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                  priority
                />
                {/* Lớp phủ mờ tinh tế */}
                <div className="absolute inset-0 bg-black/5" />
              </div>
              
              {/* Trang trí: Một khung viền lệch tạo điểm nhấn nghệ thuật */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-l-2 border-b-2 border-luxury-bronze/40 -z-10" />
            </motion.div>
          )}

          {/* CỘT PHẢI: NỘI DUNG CHÍNH SÁCH (6 PHẦN) */}
          <div className="w-full lg:w-1/2 space-y-12">
            <header className="space-y-4">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-luxury-bronze text-[10px] font-bold uppercase tracking-[0.4em]"
              >
                Exclusive Offers
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-serif text-slate-900 leading-[1.1]"
              >
                {heading}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-500 font-light text-lg"
              >
                {subHeading}
              </motion.p>
            </header>

            {/* Danh sách các item chính sách */}
            <div className="grid gap-6">
              {policies.map((policy, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="group border-none bg-white/50 hover:bg-white hover:shadow-xl transition-all duration-500 rounded-none border-l-0 hover:border-l-4 hover:border-l-luxury-bronze">
                    <CardContent className="p-6 flex gap-6">
                      <div className="shrink-0 flex items-center justify-center w-14 h-14 bg-white shadow-sm rounded-full group-hover:scale-110 transition-transform duration-500">
                        <IconRender name={policy.iconName} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xl font-serif text-slate-800">{policy.title}</h4>
                        <p className="text-sm text-slate-500 font-light leading-relaxed">
                          {policy.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Phần Download & Liên hệ */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-6 pt-6"
            >
              {policyFileUrl && (
                <Button 
                  onClick={() => window.open(policyFileUrl, '_blank')}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-luxury-bronze text-white rounded-none h-14 px-8 uppercase tracking-widest text-[10px] font-bold transition-all shadow-lg shadow-slate-200"
                >
                  <FileDown className="w-4 h-4 mr-2" /> 
                  Tải file CSBH chi tiết
                </Button>
              )}
              
              <Link href="/contact" className="flex items-center text-[10px] uppercase tracking-widest font-bold text-slate-900 hover:text-luxury-bronze transition-colors group">
                Liên hệ tư vấn viên 
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
