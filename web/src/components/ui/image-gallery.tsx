import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/ui/safe-image";

export const ImageGallery = ({ images, columns = 2 }: { 
  images: { src: string, alt: string, caption?: string }[],
  columns?: number 
}) => {
  return (
    <div className={cn(
      "grid gap-4 my-10",
      columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"
    )}>
      {images.map((img, index) => (
        <SafeImage 
          key={index} 
          src={img.src} 
          alt={img.alt} 
          caption={img.caption} 
          className="my-0" // Reset margin để grid đẹp hơn
        />
      ))}
    </div>
  );
};
