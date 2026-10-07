"use client"

import { useState } from 'react'
import { MockDataBadge } from "@/components/ui/mock-data-badge"
import { SectionHeading } from "@/components/ui/section-heading"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  calculateInvestment,
  createInvestmentReportData,
  formatVND,
  type InvestmentCalculatorInput,
} from "@/features/investment/calculator"
import { isUiMockModeEnabled } from "@/lib/mocks/config"
import {
  findMatchingMockInvestmentScenario,
  mockInvestmentScenarios,
} from "@/lib/mocks/investment"
import dynamic from 'next/dynamic';

const ReportDownloadButton = dynamic(
  () => import('@/features/investment/components/ReportDownloadButton').then((module) => module.ReportDownloadButton),
  {
    ssr: false,
    loading: () => (
      <div className="w-full bg-luxury-bronze px-8 py-6 text-center text-[10px] uppercase tracking-luxury text-white">
        Đang chuẩn bị công cụ xuất PDF...
      </div>
    ),
  },
);

const sliderValue = (values: number[], fallback: number) =>
  values[0] ?? fallback;

export default function AnalysisPage() {
  const mockModeEnabled = isUiMockModeEnabled();

  // --- STATE ĐẦU VÀO ---

  const [price, setPrice] = useState(10000000000)
  const [loanPcnt, setLoanPcnt] = useState(50)
  const [interest, setInterest] = useState(8.5)
  const [loanTerm, setLoanTerm] = useState(20)
  const [rent, setRent] = useState(40000000)
  const [appreciation, setAppreciation] = useState(6)
  const [opexPcnt, setOpexPcnt] = useState(10) // Mặc định 10% cho Thuế TNCN & Phí quản lý
  const [forecastYears, setForecastYears] = useState(5)

  const investmentInput: InvestmentCalculatorInput = {
    price,
    loanPcnt,
    interest,
    loanTerm,
    rent,
    appreciation,
    opexPcnt,
    forecastYears,
  };
  const activeMockScenario = mockModeEnabled
    ? findMatchingMockInvestmentScenario(investmentInput)
    : undefined;

  const applyMockScenario = (input: Readonly<InvestmentCalculatorInput>) => {
    setPrice(input.price);
    setLoanPcnt(input.loanPcnt);
    setInterest(input.interest);
    setLoanTerm(input.loanTerm);
    setRent(input.rent);
    setAppreciation(input.appreciation);
    setOpexPcnt(input.opexPcnt);
    setForecastYears(input.forecastYears);
  };

  const results = calculateInvestment(investmentInput);
  const reportData = createInvestmentReportData(investmentInput, results);
  return (
    <main className="min-h-screen bg-luxury-base pt-32 pb-20">
      <div className="container mx-auto px-6">
        <SectionHeading subtitle="Advanced Analysis" title="Phân tích Bài toán Đầu tư" />

        {mockModeEnabled && (
          <div className="mt-8 flex flex-col gap-4 border border-dashed border-luxury-bronze/40 bg-white/70 p-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <MockDataBadge />
              <p className="max-w-xl text-xs leading-relaxed text-luxury-stone">
                Chọn một kịch bản để cập nhật đồng thời toàn bộ thông số, kết
                quả dòng tiền và dữ liệu báo cáo PDF.
              </p>
            </div>
            <div className="w-full space-y-2 md:w-80">
              <Label
                htmlFor="mock-investment-scenario"
                className="text-[9px] uppercase tracking-widest text-luxury-stone"
              >
                Kịch bản kiểm thử
              </Label>
              <select
                id="mock-investment-scenario"
                value={activeMockScenario?.id ?? ""}
                onChange={(event) => {
                  const scenario = mockInvestmentScenarios.find(
                    (candidate) => candidate.id === event.target.value,
                  );
                  if (scenario) applyMockScenario(scenario.input);
                }}
                className="h-10 w-full border border-luxury-taupe/30 bg-white px-3 text-sm text-luxury-ink outline-none focus:border-luxury-bronze"
              >
                <option value="">Thông số tùy chỉnh hiện tại</option>
                {mockInvestmentScenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-12">

          {/* CỘT TRÁI: ĐIỀU CHỈNH BIẾN SỐ */}
          <div className="lg:col-span-5 space-y-10 bg-white/40 p-10 border border-luxury-taupe/20 backdrop-blur-sm">
            <h3 className="font-serif text-2xl text-luxury-ink border-b border-luxury-taupe/30 pb-4">Thông số giả định</h3>

            <div className="space-y-8">
              {/* Nhóm 1: Giá trị & Vay */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-end text-luxury-stone text-[10px] uppercase tracking-widest">
                    <Label>Giá trị tài sản</Label>
                    <span className="font-serif text-lg text-luxury-bronze">{formatVND(price)}</span>
                  </div>
                  <Slider value={[price]} min={2000000000} max={150000000000} step={500000000} onValueChange={(values) => setPrice(sliderValue(values, price))} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end text-luxury-stone text-[10px] uppercase tracking-widest">
                    <Label>Tỷ lệ vay ({loanPcnt}%)</Label>
                    <span className="font-serif text-lg text-luxury-ink">{formatVND(results.loanAmount)}</span>
                  </div>
                  <Slider value={[loanPcnt]} min={0} max={80} step={5} onValueChange={(values) => setLoanPcnt(sliderValue(values, loanPcnt))} />
                </div>
              </div>

              {/* Nhóm 2: Lãi suất & Thời hạn */}
              {loanPcnt > 0 && (
                <div className="grid grid-cols-2 gap-6 p-6 bg-luxury-ink/[0.02] border border-luxury-taupe/10">
                  <div className="space-y-3">
                    <Label className="text-[9px] uppercase tracking-widest opacity-60">Lãi suất ({interest}%)</Label>
                    <Slider value={[interest]} min={5} max={15} step={0.1} onValueChange={(values) => setInterest(sliderValue(values, interest))} />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[9px] uppercase tracking-widest opacity-60">Thời hạn ({loanTerm} năm)</Label>
                    <Slider value={[loanTerm]} min={5} max={35} step={1} onValueChange={(values) => setLoanTerm(sliderValue(values, loanTerm))} />
                  </div>
                </div>
              )}

              {/* Nhóm 3: Vận hành, Thuế & Dự báo */}
              <div className="space-y-6 pt-6 border-t border-luxury-taupe/10">
                <div className="grid grid-cols-2 gap-6 text-[10px] uppercase tracking-widest font-bold">
                  <div className="space-y-3 text-luxury-bronze">
                    <Label>Tăng giá ({appreciation}%/năm)</Label>
                    <Slider value={[appreciation]} min={0} max={15} step={0.5} onValueChange={(values) => setAppreciation(sliderValue(values, appreciation))} />
                  </div>
                  <div className="space-y-3 text-luxury-ink">
                    <Label>Thuế & Phí ({opexPcnt}%)</Label>
                    <Slider value={[opexPcnt]} min={0} max={20} step={0.1} onValueChange={(values) => setOpexPcnt(sliderValue(values, opexPcnt))} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end text-luxury-stone text-[10px] uppercase tracking-widest">
                    <Label>Giá thuê / tháng</Label>
                    <span className="font-serif text-lg text-luxury-bronze">{formatVND(rent)}</span>
                  </div>
                  <Slider value={[rent]} min={0} max={200000000} step={1000000} onValueChange={(values) => setRent(sliderValue(values, rent))} />
                </div>

                <div className="space-y-4 pt-2">
                  <Label className="text-[10px] uppercase tracking-widest opacity-60 italic">Dự báo trong vòng {forecastYears} năm</Label>
                  <Slider value={[forecastYears]} min={1} max={20} step={1} onValueChange={(values) => setForecastYears(sliderValue(values, forecastYears))} />
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: KẾT QUẢ */}
          <div className="lg:col-span-7 space-y-8">

            {/* 1. BÁO CÁO CƠ BẢN (GỒM THUẾ PHÍ) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border border-luxury-taupe/20 bg-white/60">
                <p className="text-[8px] uppercase tracking-widest text-luxury-stone mb-1 font-bold">Vốn tự có</p>
                <p className="font-serif text-sm truncate">{formatVND(results.equity)}</p>
              </div>
              <div className="p-4 border border-luxury-taupe/20 bg-white/60">
                <p className="text-[8px] uppercase tracking-widest text-luxury-stone mb-1 font-bold">Gốc + Lãi/tháng</p>
                <p className="font-serif text-sm truncate">{formatVND(results.totalMonthlyPayment)}</p>
              </div>
              <div className="p-4 border border-luxury-taupe/20 bg-white/60">
                <p className="text-[8px] uppercase tracking-widest text-luxury-bronze mb-1 font-bold">Thuế & Phí/tháng</p>
                <p className="font-serif text-sm truncate">{formatVND(results.monthlyOpex)}</p>
              </div>
              <div className="p-4 border border-luxury-taupe/20 bg-white/60">
                <p className="text-[8px] uppercase tracking-widest text-luxury-stone mb-1 font-bold">Lợi suất thuê</p>
                <p className="font-serif text-sm">{results.annualYield.toFixed(2)}%</p>
              </div>
            </div>

            {/* 2. CHỈ SỐ QUYẾT ĐỊNH */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-luxury-ink text-white shadow-2xl">
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-luxury-bronze font-bold mb-4">ROE trung bình hàng năm</p>
                <p className="font-serif text-6xl">{results.roe.toFixed(1)}%</p>
                <p className="text-[9px] opacity-40 uppercase tracking-widest mt-2 italic">Sau khi đã trừ thuế, phí & lãi vay</p>
              </div>

              <div className={`p-8 border border-luxury-bronze/20 flex flex-col justify-center ${results.netCashflow >= 0 ? 'bg-white' : 'bg-rose-50'}`}>
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-luxury-stone font-bold mb-2">Dòng tiền thuần thực tế</p>
                <p className={`font-serif text-3xl ${results.netCashflow >= 0 ? 'text-luxury-ink' : 'text-rose-900'}`}>
                  {formatVND(results.netCashflow)} <span className="text-xs font-sans text-luxury-stone italic">/tháng</span>
                </p>
                <p className="text-[8px] uppercase tracking-widest mt-2 opacity-50">Lợi nhuận cuối cùng bỏ túi</p>
              </div>
            </div>

            {/* 3. BÁO CÁO CHI TIẾT DỰ PHÓNG */}
            <div className="p-10 border border-luxury-taupe/30 space-y-8 bg-white/20 backdrop-blur-sm">
              <div className="flex justify-between items-end border-b border-luxury-taupe/20 pb-6">
                <div>
                  <h4 className="font-serif text-2xl uppercase tracking-tighter">Báo cáo dự phóng tài sản</h4>
                  <p className="text-[9px] text-luxury-stone uppercase tracking-widest mt-1">Dựa trên kịch bản {forecastYears} năm</p>
                </div>
                <div className="text-right text-luxury-bronze font-serif text-3xl">
                  {formatVND(results.futureValue)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4 font-sans text-xs">
                  <div className="flex justify-between pb-2 border-b border-luxury-taupe/10">
                    <span className="uppercase opacity-60">Lợi nhuận tăng giá nhà</span>
                    <span className="font-bold">{formatVND(results.totalCapitalGain)}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-luxury-taupe/10">
                    <span className="uppercase opacity-60">Dòng tiền thuê tích lũy (Sau thuế/phí)</span>
                    <span className="font-bold">{formatVND(results.totalNetRentAccumulated)}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="uppercase font-bold text-luxury-bronze">Tổng lợi nhuận ròng</span>
                    <span className="font-serif text-2xl text-luxury-ink">{formatVND(results.totalProfit)}</span>
                  </div>
                </div>

                <div className="bg-luxury-taupe/5 p-6 border-l-2 border-luxury-bronze">
                  <p className="text-xs text-luxury-stone leading-relaxed italic">
                    Bản tính toán này đã bao gồm mức thuế TNCN và phí quản lý
                    vận hành dự kiến là <strong>{opexPcnt}%</strong>. Dòng tiền{" "}
                    <strong>{formatVND(results.netCashflow)}/tháng</strong> là con
                    số ước tính sau các nghĩa vụ tài chính đã nhập.
                  </p>
                </div>
              </div>

              <ReportDownloadButton
                data={reportData}
                fileName={`Bao-cao-dau-tu-${forecastYears}-nam.pdf`}
              />
            </div>
          </div>
        </div>
      </div>

    </main>
  )
}
