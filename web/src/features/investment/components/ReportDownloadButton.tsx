"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";

import type { InvestmentReportData } from "@/features/investment/calculator";
import { InvestmentReport } from "@/features/investment/components/InvestmentReport";

interface ReportDownloadButtonProps {
  data: InvestmentReportData;
  fileName: string;
}

export function ReportDownloadButton({
  data,
  fileName,
}: ReportDownloadButtonProps) {
  return (
    <PDFDownloadLink
      document={<InvestmentReport data={data} />}
      fileName={fileName}
      className="flex w-full items-center justify-center bg-luxury-bronze px-8 py-6 font-sans text-[10px] uppercase tracking-luxury text-white transition-colors duration-500 hover:bg-luxury-ink"
    >
      {({ loading }) =>
        loading ? "Đang khởi tạo PDF..." : "Tải báo cáo PDF chi tiết"
      }
    </PDFDownloadLink>
  );
}
