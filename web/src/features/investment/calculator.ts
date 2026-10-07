export interface InvestmentCalculatorInput {
  price: number;
  loanPcnt: number;
  interest: number;
  loanTerm: number;
  rent: number;
  appreciation: number;
  opexPcnt: number;
  forecastYears: number;
}

export interface InvestmentCalculation {
  loanAmount: number;
  equity: number;
  monthlyOpex: number;
  netRentMonthly: number;
  totalMonthlyPayment: number;
  netCashflow: number;
  futureValue: number;
  totalCapitalGain: number;
  totalNetRentAccumulated: number;
  totalProfit: number;
  annualYield: number;
  roe: number;
}

export interface InvestmentReportData {
  formatPrice: string;
  formatEquity: string;
  loanPcnt: number;
  formatLoan: string;
  interest: number;
  loanTerm: number;
  formatRent: string;
  opexPcnt: number;
  formatOpex: string;
  formatMonthlyPayment: string;
  formatNetCashflow: string;
  forecastYears: number;
  roe: number;
  formatFutureValue: string;
  formatCapitalGain: string;
  formatAccumulatedRent: string;
  formatTotalProfit: string;
}

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export function formatVND(value: number): string {
  return vndFormatter.format(value);
}

export function calculateInvestment(
  input: Readonly<InvestmentCalculatorInput>,
): InvestmentCalculation {
  const {
    price,
    loanPcnt,
    interest,
    loanTerm,
    rent,
    appreciation,
    opexPcnt,
    forecastYears,
  } = input;

  const loanAmount = (price * loanPcnt) / 100;
  const equity = price - loanAmount;
  const monthlyOpex = rent * (opexPcnt / 100);
  const netRentMonthly = rent - monthlyOpex;
  const loanMonths = loanTerm * 12;
  const monthlyInterest =
    loanAmount > 0 ? (loanAmount * (interest / 100)) / 12 : 0;
  const monthlyPrincipal =
    loanAmount > 0 && loanMonths > 0 ? loanAmount / loanMonths : 0;
  const totalMonthlyPayment = monthlyPrincipal + monthlyInterest;
  const netCashflow = netRentMonthly - totalMonthlyPayment;
  const futureValue = price * Math.pow(1 + appreciation / 100, forecastYears);
  const totalCapitalGain = futureValue - price;
  const totalNetRentAccumulated = netCashflow * 12 * forecastYears;
  const totalProfit = totalCapitalGain + totalNetRentAccumulated;
  const annualYield = price > 0 ? ((netRentMonthly * 12) / price) * 100 : 0;
  const roe =
    equity > 0 && forecastYears > 0
      ? (totalProfit / forecastYears / equity) * 100
      : 0;

  return {
    loanAmount,
    equity,
    monthlyOpex,
    netRentMonthly,
    totalMonthlyPayment,
    netCashflow,
    futureValue,
    totalCapitalGain,
    totalNetRentAccumulated,
    totalProfit,
    annualYield,
    roe,
  };
}

export function createInvestmentReportData(
  input: Readonly<InvestmentCalculatorInput>,
  calculation: Readonly<InvestmentCalculation>,
): InvestmentReportData {
  return {
    formatPrice: formatVND(input.price),
    formatEquity: formatVND(calculation.equity),
    loanPcnt: input.loanPcnt,
    formatLoan: formatVND(calculation.loanAmount),
    interest: input.interest,
    loanTerm: input.loanTerm,
    formatRent: formatVND(input.rent),
    opexPcnt: input.opexPcnt,
    formatOpex: formatVND(calculation.monthlyOpex),
    formatMonthlyPayment: formatVND(calculation.totalMonthlyPayment),
    formatNetCashflow: formatVND(calculation.netCashflow),
    forecastYears: input.forecastYears,
    roe: calculation.roe,
    formatFutureValue: formatVND(calculation.futureValue),
    formatCapitalGain: formatVND(calculation.totalCapitalGain),
    formatAccumulatedRent: formatVND(calculation.totalNetRentAccumulated),
    formatTotalProfit: formatVND(calculation.totalProfit),
  };
}
