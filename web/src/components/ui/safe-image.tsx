'use client'

import Image from 'next/image'
import {
  TransformWrapper,
  TransformComponent
} from 'react-zoom-pan-pinch'
import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Plus, Minus, RotateCcw, X } from 'lucide-react'

interface SafeImageProps {
  src: string          // ảnh preview (low/medium)
  hdSrc?: string       // ảnh HD
  alt: string
  caption?: string
  blurDataURL?: string // base64 blur (optional nhưng nên có)
  className?: string
}

export const SafeImage = ({
  src,
  hdSrc,
  alt,
  caption,
  blurDataURL,
  className
}: SafeImageProps) => {
  const [open, setOpen] = useState(false)
  const [loadedHD, setLoadedHD] = useState(false)

  const ref = useRef<HTMLDivElement | null>(null)
  const preloadedSrcRef = useRef<string | null>(null)

  // 🔥 preload HD
  const preloadHD = useCallback(() => {
    if (!hdSrc || preloadedSrcRef.current === hdSrc) return

    preloadedSrcRef.current = hdSrc
    const img = new window.Image()
    img.src = hdSrc
    img.onerror = () => {
      if (preloadedSrcRef.current === hdSrc) preloadedSrcRef.current = null
    }
  }, [hdSrc])

  // 🔥 preload khi gần viewport (giống Medium)
  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          preloadHD()
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [preloadHD])

  // 🔥 ESC để đóng
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <figure ref={ref} className={cn("my-10 group", className)}>
      {/* Preview */}
      <div
        onMouseEnter={preloadHD}
        onClick={() => {
          preloadHD()
          setOpen(true)
          setLoadedHD(false)
        }}
        className="relative cursor-zoom-in overflow-hidden rounded-sm bg-black/5"
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          className={cn(
            "w-full h-auto object-cover",
            "transition-transform duration-700 group-hover:scale-105"
          )}
        />

        {/* overlay hover */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
          <Plus className="text-white opacity-0 group-hover:opacity-100 transition-all" />
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[999]">

          {/* overlay */}
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          <div className="relative w-full h-full flex items-center justify-center">

            {/* close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 text-white/80 hover:text-white z-50"
            >
              <X size={28} />
            </button>

            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={8}
              centerOnInit
              doubleClick={{ mode: 'zoomIn', step: 1 }}
              wheel={{ step: 0.01 }}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  {/* toolbar */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex gap-4 p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full">
                    <button onClick={() => zoomIn()} className="p-2 text-white hover:bg-white/10 rounded-full">
                      <Plus size={18} />
                    </button>

                    <button onClick={() => zoomOut()} className="p-2 text-white hover:bg-white/10 rounded-full">
                      <Minus size={18} />
                    </button>

                    <button onClick={() => resetTransform()} className="p-2 text-white hover:bg-white/10 rounded-full">
                      <RotateCcw size={18} />
                    </button>
                  </div>

                  {/* image container */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <TransformComponent
                      wrapperStyle={{ width: '100vw', height: '100vh' }}
                    >
                      <div className="relative">

                        {/* 🔥 blurred preview phía dưới */}
                        <Image
                          src={src}
                          alt=""
                          fill
                          sizes="100vw"
                          className={cn(
                            "absolute inset-0 w-full h-full object-contain",
                            "blur-xl scale-110 opacity-70"
                          )}
                        />

                        {/* 🔥 HD image fade-in */}
                        <Image
                          src={hdSrc || src}
                          alt={alt}
                          width={2400}
                          height={1600}
                          onLoad={() => setLoadedHD(true)}
                          className={cn(
                            "relative max-w-full h-auto object-contain",
                            "transition-opacity duration-700",
                            loadedHD ? "opacity-100" : "opacity-0"
                          )}
                          draggable={false}
                        />
                      </div>
                    </TransformComponent>
                  </div>
                </>
              )}
            </TransformWrapper>
          </div>
        </div>
      )}

      {caption && (
        <figcaption className="mt-4 text-center text-xs italic text-neutral-400">
          — {caption}
        </figcaption>
      )}
    </figure>
  )
}
