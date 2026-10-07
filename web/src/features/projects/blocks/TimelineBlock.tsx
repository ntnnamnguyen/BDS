'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Construction, Camera } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import type { TimelineBlockData } from '@/features/projects/schemas';

export default function TimelineBlock({ data }: { data: TimelineBlockData }) {
  const { heading, subHeading, currentStatus, steps } = data;

  return (
    <section className="py-24 bg-white px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">{heading}</h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-luxury-bronze/30" />
              <Badge variant="outline" className="text-luxury-bronze border-luxury-bronze/50 px-4 py-1 uppercase tracking-widest text-[10px] bg-luxury-bronze/5">
                <Construction className="w-3 h-3 mr-2 animate-pulse" />
                {currentStatus}
              </Badge>
              <div className="h-[1px] w-12 bg-luxury-bronze/30" />
            </div>
            <p className="mt-6 text-slate-500 font-light tracking-wide">{subHeading}</p>
          </motion.div>
        </div>

        {/* Timeline Core */}
        <div className="relative">
          {/* Đường trục giữa (chỉ hiện từ MD trở lên) */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-[1px] bg-slate-100" />

          <div className="space-y-16">
            {steps.map((step, index) => {
              const isCompleted = step.status === 'completed';
              const isOngoing = step.status === 'ongoing';
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-start ${
                    index % 2 !== 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Icon mốc thời gian trên trục */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 z-10 flex items-center justify-center">
                    <div className={`w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
                      isCompleted ? 'bg-luxury-bronze text-white' : 
                      isOngoing ? 'bg-white border-luxury-bronze text-luxury-bronze' : 
                      'bg-slate-50 text-slate-300 border-slate-100'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                       isOngoing ? <Clock className="w-5 h-5 animate-spin-slow" /> : 
                       <div className="w-2 h-2 rounded-full bg-current" />}
                    </div>
                  </div>

                  {/* Nội dung Content */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12">
                    <div className={`p-8 transition-all duration-500 border ${
                      isOngoing ? 'bg-white border-luxury-bronze/20 shadow-xl scale-105' : 'bg-transparent border-transparent'
                    }`}>
                      <div className={`flex items-center gap-3 mb-2 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                        <span className="text-luxury-bronze font-bold text-xs tracking-tighter uppercase font-mono">
                          {step.date}
                        </span>
                        {isOngoing && (
                          <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-luxury-bronze opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-luxury-bronze"></span>
                          </span>
                        )}
                      </div>
                      
                      <h3 className={`text-xl font-serif mb-3 ${index % 2 !== 0 ? 'md:text-right' : ''}`}>
                        {step.title}
                      </h3>
                      
                      {step.description && (
                        <p className={`text-sm text-slate-500 font-light leading-relaxed mb-6 ${index % 2 !== 0 ? 'md:text-right' : ''}`}>
                          {step.description}
                        </p>
                      )}

                      {/* Ảnh thực tế công trường */}
                      {step.image && (
                        <div className="relative group overflow-hidden bg-slate-100 aspect-video md:aspect-[16/10]">
                          <Image
                            src={step.image}
                            alt={step.title}
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0"
                          />
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-black/40 backdrop-blur-md text-[10px] border-none">
                              <Camera className="w-3 h-3 mr-1" /> Thực tế
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Spacer cho phía đối diện */}
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </section>
  );
}
