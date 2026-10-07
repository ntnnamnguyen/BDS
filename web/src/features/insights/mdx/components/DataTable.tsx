"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, parseData } from "@/lib/utils";

interface ColumnConfig {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  format?: (value: unknown) => React.ReactNode;
}

type DataRow = Record<string, unknown>;

interface DataTableProps {
  title?: string;
  description?: string;
  columns?: ColumnConfig[] | string; // Đổi thành optional để an toàn
  data?: DataRow[] | string;        // Đổi thành optional để an toàn
  className?: string;
}

export const DataTable = ({
  title,
  description,
  columns = [], // Gán mặc định mảng rỗng
  data = [],    // Gán mặc định mảng rỗng
  className,
}: DataTableProps) => {
 
  const safeColumns = parseData<ColumnConfig>(columns);
  const safeData = parseData<DataRow>(data);

  const renderValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) return null;
    if (React.isValidElement(value)) return value;
    if (typeof value === "string" || typeof value === "number") return value;
    if (typeof value === "boolean") return value ? "true" : "false";
    return JSON.stringify(value);
  };

  // Nếu hoàn toàn không có dữ liệu, không render bảng để tránh tốn không gian
  if (safeData.length === 0) return null;

  return (
    <div className={cn("my-16 w-full", className)}>
      {/* Header của Bảng */}
      {(title || description) && (
        <div className="mb-8 text-center">
          {title && (
            <h4 className="font-serif text-xl text-slate-800 tracking-[0.15em] uppercase italic mb-3">
              {title}
            </h4>
          )}
          {description && (
            <div className="flex justify-center items-center gap-4">
              <div className="h-px w-10 bg-luxury-bronze/30" />
              <span className="text-[10px] text-slate-400 font-mono tracking-[0.3em] uppercase">
                {description}
              </span>
              <div className="h-px w-10 bg-luxury-bronze/30" />
            </div>
          )}
        </div>
      )}

      {/* Cấu trúc Bảng Luxury */}
      <div className="overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-none">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b border-slate-100">
              {safeColumns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "h-12 px-6 font-serif text-[11px] uppercase tracking-[0.2em] text-slate-500",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right"
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeData.map((item, rowIndex) => (
              <TableRow 
                key={rowIndex} 
                className="group border-b border-slate-50 last:border-0 hover:bg-luxury-bronze/2 transition-colors"
              >
                {safeColumns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={cn(
                      "px-6 py-4 text-sm font-light text-slate-600 transition-colors group-hover:text-slate-900",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right font-mono text-[13px]"
                    )}
                  >
                    {/* Kiểm tra an toàn trước khi truy cập item[col.key] */}
                    {col.format
                      ? col.format(item[col.key])
                      : renderValue(item[col.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
