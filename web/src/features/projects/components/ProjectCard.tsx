import Image from "next/image"
import Link from "next/link" // Import Link từ Next.js

import { getProjectImageSource } from "@/features/projects/image";

interface ProjectProps {
  title: string
  location: string
  price: string
  image: string
  slug: string
}

export function ProjectCard({ title, location, price, image, slug }: ProjectProps) {
  return (
    <Link href={`/projects/${slug}`} className="block group cursor-pointer">
      <div className="relative aspect-[4/5] overflow-hidden bg-luxury-taupe">
        <Image 
          src={getProjectImageSource(image)} 
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
      </div>
      
      <div className="mt-6 space-y-2">
        <p className="font-sans text-[10px] uppercase tracking-widest text-luxury-stone">
          {location}
        </p>
        <h3 className="font-serif text-2xl text-luxury-ink group-hover:text-luxury-bronze transition-colors">
          {title}
        </h3>
        <p className="font-sans text-xs italic text-luxury-stone">
          {price}
        </p>
      </div>
    </Link>
  )
}
