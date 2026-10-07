'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import type { GalleryBlockData } from '@/features/projects/schemas';

export default function GalleryBlock({ data }: { data: GalleryBlockData }) {
  const { heading, subHeading, layout, aspectRatio, images } = data;
  const [filter, setFilter] = useState('all');

  // Lấy danh sách category duy nhất để làm bộ lọc
  const categories = [
    'all',
    ...new Set(images.flatMap((image) => image.category ? [image.category] : [])),
  ];

  const filteredImages = filter === 'all' 
    ? images 
    : images.filter((image) => image.category === filter);

  // Định nghĩa tỷ lệ khung hình
  const ratioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]'
  }[aspectRatio as 'square' | 'video' | 'portrait'] || 'aspect-video';

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            {heading && <h2 className="text-4xl font-serif text-slate-900 mb-4">{heading}</h2>}
            {subHeading && <p className="text-slate-500 font-light">{subHeading}</p>}
          </div>

          {/* Bộ lọc Category */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-4 border-b border-slate-100 pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-[10px] uppercase tracking-[0.2em] font-bold pb-2 transition-all relative ${
                    filter === cat ? 'text-luxury-bronze' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {cat === 'all' ? 'Tất cả' : cat}
                  {filter === cat && (
                    <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-luxury-bronze" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Layout Engine */}
        <motion.div 
          layout
          className={`grid gap-4 ${
            layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 
            layout === 'masonry' ? 'columns-1 md:columns-2 lg:columns-3 space-y-4 gap-4' : 
            'grid-cols-1'
          }`}
        >
          <AnimatePresence mode='popLayout'>
            {filteredImages.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className={`${layout === 'masonry' ? 'break-inside-avoid' : ''}`}
              >
                <div className="group relative overflow-hidden bg-slate-100">
                  <Zoom>
                    <div className={`relative w-full ${layout === 'masonry' ? 'h-auto' : ratioClass}`}>
                      <Image
                        src={img.url}
                        alt={img.alt}
                        width={layout === 'masonry' ? 800 : undefined}
                        height={layout === 'masonry' ? 600 : undefined}
                        fill={layout !== 'masonry'}
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    </div>
                  </Zoom>

                  {/* Caption & Category Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none flex flex-col justify-end p-6">
                    {img.category && (
                      <span className="text-[9px] text-luxury-bronze uppercase tracking-[0.3em] font-bold mb-2">
                        {img.category}
                      </span>
                    )}
                    {img.caption && (
                      <p className="text-white text-sm font-light italic tracking-wide">
                        {img.caption}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <style jsx global>{`
        /* Tùy chỉnh icon zoom cho Gallery */
        [data-rmiz-btn-zoom] {
          display: none; /* Ẩn nút zoom mặc định để trải nghiệm click mượt hơn */
        }
        .rmiz-container {
          display: block !important;
          width: 100%;
        }
      `}</style>
    </section>
  );
}
