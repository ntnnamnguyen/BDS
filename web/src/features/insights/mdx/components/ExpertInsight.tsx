import { Quote } from "lucide-react";

export const ExpertInsight = ({ children, name = "Hanoi Estate Expert" }: { children: React.ReactNode, name?: string }) => (
  <div className="my-12 relative p-8 bg-slate-50 border-t-2 border-luxury-bronze">
    <Quote className="absolute -top-4 left-8 text-luxury-bronze bg-white p-1 w-8 h-8" />
    <div className="font-serif italic text-lg text-slate-700 leading-relaxed italic">
      {children}
    </div>
    <div className="mt-6 flex items-center gap-3">
      <div className="h-[1px] w-8 bg-luxury-bronze" />
      <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-500">{name}</span>
    </div>
  </div>
);
