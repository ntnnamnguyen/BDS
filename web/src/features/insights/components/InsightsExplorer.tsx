'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { PostSummary } from "@/features/insights/schemas";

interface Props {
  initialPosts: PostSummary[];
}

export function InsightsExplorer({ initialPosts }: Props) {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(
    () => [
      'Tất cả',
      ...Array.from(new Set(initialPosts.map((post) => post.category))).sort(
        (left, right) => left.localeCompare(right, 'vi'),
      ),
    ],
    [initialPosts],
  );

  // Logic lọc và tìm kiếm bài viết
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCategory = activeCategory === 'Tất cả' || post.category === activeCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, initialPosts]);

  // Bài viết nổi bật (Featured) - Lấy bài mới nhất trong danh sách đã lọc
  const featuredPost = filteredPosts[0];
  const listPosts = filteredPosts.slice(1);

  return (
    <section className="bg-white min-h-screen">
      
      {/* SECTION 1: HERO - FEATURED POST */}
      <AnimatePresence mode="wait">
        {featuredPost ? (
          <motion.div 
            key={featuredPost.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-[80vh] w-full overflow-hidden bg-slate-900"
          >
            <Image
              src={featuredPost.cover}
              alt={featuredPost.title}
              fill
              sizes="100vw"
              className="object-cover opacity-60 transition-transform duration-1000 hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end pb-20 px-6">
              <div className="max-w-7xl mx-auto w-full">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-3xl space-y-6"
                >
                  <Badge className="bg-luxury-bronze hover:bg-luxury-bronze text-white rounded-none px-4 py-1 uppercase tracking-[0.2em] text-[10px]">
                    {featuredPost.category}
                  </Badge>
                  <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight italic">
                    {featuredPost.title}
                  </h1>
                  <p className="text-white/70 font-light text-lg line-clamp-2 max-w-2xl">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-white/50 text-xs uppercase tracking-widest pt-4">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {featuredPost.date}</span>
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {featuredPost.readTime}</span>
                  </div>
                  <Link
                    href={`/expert-insights/${featuredPost.slug}`}
                    className="flex w-fit items-center gap-3 pt-4 text-white group"
                  >
                    <span className="uppercase tracking-[0.3em] text-[10px] font-bold">Khám phá bài viết</span>
                    <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-[40vh] flex items-center justify-center bg-slate-50 text-slate-400 font-serif italic">
            Không tìm thấy bài viết nổi bật...
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        
        {/* SECTION 2: SEARCH & FILTER BAR */}
        <div className="bg-white p-8 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all relative pb-2 ${
                  activeCategory === cat ? 'text-luxury-bronze' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div 
                    layoutId="blog-underline" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-bronze" 
                  />
                )}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Tìm kiếm bài phân tích"
              placeholder="Tìm kiếm phân tích..."
              className="pl-10 border-slate-100 rounded-none focus-visible:ring-luxury-bronze placeholder:text-slate-300 text-sm"
            />
          </div>
        </div>

        {/* SECTION 3: ARTICLE GRID */}
        <div className="py-20">
          {filteredPosts.length > 0 ? (
            listPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <AnimatePresence>
                {listPosts.map((post, idx) => (
                  <motion.div
                    key={post.slug}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link href={`/expert-insights/${post.slug}`} className="group block">
                      <article className="space-y-6">
                        <div className="relative aspect-16/10 overflow-hidden bg-slate-100 shadow-sm">
                          <Image
                            src={post.cover}
                            alt={post.title}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/95 backdrop-blur-sm text-slate-900 border-none rounded-none text-[9px] uppercase font-bold tracking-widest px-3 py-1 shadow-sm">
                              {post.category}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                            <span>{post.date}</span>
                          </div>
                          <h3 className="text-2xl font-serif text-slate-900 group-hover:text-luxury-bronze transition-colors leading-snug italic">
                            {post.title}
                          </h3>
                          <p className="text-slate-500 font-light text-sm line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                          <div className="pt-4 flex items-center gap-2 text-slate-900 group-hover:gap-4 transition-all">
                            <span className="text-[10px] uppercase tracking-widest font-bold border-b border-slate-200 group-hover:border-luxury-bronze group-hover:text-luxury-bronze pb-1">
                              Xem chi tiết
                            </span>
                            <ArrowRight className="w-3 h-3 group-hover:text-luxury-bronze" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            ) : null
          ) : (
            <div className="text-center py-20 border border-dashed border-slate-200">
              <p className="font-serif italic text-slate-400">Không có bài viết nào khớp với tiêu chí của bạn.</p>
              <button 
                onClick={() => {setActiveCategory('Tất cả'); setSearchQuery('');}}
                className="mt-4 text-[10px] uppercase tracking-widest text-luxury-bronze font-bold"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
