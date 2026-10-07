import { Button } from "@/components/ui/button";
import Link from "next/link";

export const ContactCta = ({ title, description }: { title: string, description: string }) => (
  <div className="my-20 p-12 bg-slate-900 text-center text-white rounded-none">
    <h3 className="font-serif text-2xl mb-4 italic tracking-wide">{title}</h3>
    <p className="text-slate-400 font-light mb-8 max-w-md mx-auto">{description}</p>
    <Button asChild variant="outline" className="rounded-none border-luxury-bronze text-luxury-bronze hover:bg-luxury-bronze hover:text-white transition-all px-8 uppercase tracking-widest text-[10px]">
      <Link href="/contact">Yêu cầu nhận tài liệu</Link>
    </Button>
  </div>
);
