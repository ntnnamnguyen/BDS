"use client";

import { parseData } from "@/lib/utils";

interface HighlightEntry {
  label?: string;
  value?: string | number;
}

interface ProjectHighlightProps {
  items: HighlightEntry[] | string;
}

export const ProjectHighlight = ({ items }: ProjectHighlightProps) => {
  const safeItems = parseData<HighlightEntry>(items);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-0 my-10 border border-slate-100 shadow-sm">
      {safeItems.map((item, index) => (
        <div
          key={`${item.label || "highlight"}-${index}`}
          className="p-6 border-r last:border-0 border-slate-100 flex flex-col items-center text-center"
        >
          <span className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">
            {item.label}
          </span>
          <span className="font-serif text-sm font-medium text-slate-800 uppercase">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};
