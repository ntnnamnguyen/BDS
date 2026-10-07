import {
  calculateInvestment,
  createInvestmentReportData,
  type InvestmentCalculatorInput,
} from "@/features/investment/calculator";

export type InvestmentMockScenarioId =
  | "positive-cashflow"
  | "negative-cashflow"
  | "no-loan"
  | "high-leverage";

export const mockInvestmentInputs = {
  "positive-cashflow": {
    price: 6_000_000_000,
    loanPcnt: 30,
    interest: 7.5,
    loanTerm: 25,
    rent: 45_000_000,
    appreciation: 6,
    opexPcnt: 10,
    forecastYears: 5,
  },
  "negative-cashflow": {
    price: 12_000_000_000,
    loanPcnt: 60,
    interest: 10.5,
    loanTerm: 15,
    rent: 28_000_000,
    appreciation: 4,
    opexPcnt: 15,
    forecastYears: 5,
  },
  "no-loan": {
    price: 8_000_000_000,
    loanPcnt: 0,
    interest: 8.5,
    loanTerm: 20,
    rent: 38_000_000,
    appreciation: 5,
    opexPcnt: 8,
    forecastYears: 10,
  },
  "high-leverage": {
    price: 20_000_000_000,
    loanPcnt: 80,
    interest: 12,
    loanTerm: 10,
    rent: 55_000_000,
    appreciation: 7,
    opexPcnt: 20,
    forecastYears: 7,
  },
} satisfies Record<InvestmentMockScenarioId, InvestmentCalculatorInput>;

const scenarioLabels: Record<InvestmentMockScenarioId, string> = {
  "positive-cashflow": "Dòng tiền dương",
  "negative-cashflow": "Dòng tiền âm",
  "no-loan": "Không sử dụng vốn vay",
  "high-leverage": "Đòn bẩy cao",
};

const scenarioIds = [
  "positive-cashflow",
  "negative-cashflow",
  "no-loan",
  "high-leverage",
] as const satisfies readonly InvestmentMockScenarioId[];

/** Kết quả và dữ liệu PDF được tính từ calculator thật, không sao chép công thức. */
export const mockInvestmentScenarios = scenarioIds.map((id) => {
  const input = mockInvestmentInputs[id];
  const calculation = calculateInvestment(input);

  return {
    id,
    label: scenarioLabels[id],
    input,
    calculation,
    reportData: createInvestmentReportData(input, calculation),
  };
});

export const getMockInvestmentScenario = (id: InvestmentMockScenarioId) =>
  mockInvestmentScenarios.find((scenario) => scenario.id === id);

const investmentInputFields = [
  "price",
  "loanPcnt",
  "interest",
  "loanTerm",
  "rent",
  "appreciation",
  "opexPcnt",
  "forecastYears",
] as const satisfies readonly (keyof InvestmentCalculatorInput)[];

export const findMatchingMockInvestmentScenario = (
  input: Readonly<InvestmentCalculatorInput>,
) =>
  mockInvestmentScenarios.find((scenario) =>
    investmentInputFields.every(
      (field) => scenario.input[field] === input[field],
    ),
  );
