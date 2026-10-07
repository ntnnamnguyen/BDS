'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Dumbbell,
  GlassWater,
  Home,
  Monitor,
  Sparkles,
  Trees,
  Waves,
  Zap,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';
import type { FacilitiesBlockData } from '@/features/projects/schemas';
// Shadcn UI
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
// Helper để lấy Icon động
const iconRegistry: Record<string, LucideIcon> = {
  Dumbbell,
  GlassWater,
  Home,
  Monitor,
  Sparkles,
  Trees,
  Waves,
  Zap,
};

const IconRender = ({ name, ...props }: { name: string } & LucideProps) => {
  const LucideIcon = iconRegistry[name] || Zap;
  return <LucideIcon {...props} />;
};

export function FacilitiesBlock({ data }: { data: FacilitiesBlockData }) {
  const { heading, subHeading, items } = data;

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-luxury-bronze font-bold tracking-[0.3em] uppercase text-xs mb-4"
            >
              {subHeading}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight"
            >
              {heading}
            </motion.h2>
          </div>
          <div className="hidden lg:block w-32 h-[1px] bg-luxury-bronze mb-4" />
        </div>

        {/* Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group border-none shadow-none bg-transparent overflow-hidden">
                <CardContent className="p-0">
                  {/* Image Area */}
                  <div className="relative overflow-hidden">
                    <AspectRatio ratio={4 / 5}>
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                          <IconRender name={item.iconName || 'Home'} className="w-12 h-12 text-slate-300" />
                        </div>
                      )}
                    </AspectRatio>
                    
                    {/* Overlay khi hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                       <div className="p-6 text-center scale-90 group-hover:scale-100 transition-transform duration-500">
                          <p className="text-white text-sm font-light leading-relaxed">
                            {item.description}
                          </p>
                       </div>
                    </div>

                    {/* Category Badge (Top Left) */}
                    {item.category && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                          {item.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info Area */}
                  <div className="mt-6 flex items-start gap-4">
                    {item.iconName && (
                      <div className="p-2 border border-luxury-bronze/20 rounded-sm">
                        <IconRender name={item.iconName} className="w-5 h-5 text-luxury-bronze" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-serif text-slate-900 mb-2 group-hover:text-luxury-bronze transition-colors">
                        {item.title}
                      </h3>
                      <div className="h-[2px] w-0 group-hover:w-full bg-luxury-bronze transition-all duration-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
