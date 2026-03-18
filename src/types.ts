export interface OtherFee {
  id: string;
  type: string;
  amount: number;
  date: number;
}

export interface Donation {
  id: string;
  amount: number;
  purpose: string;
  date: number;
  donorName: string;
  editCount: number; // Max 1
}

export interface Family {
  id: string;
  name: string;
  membersCount: number;
  type: 'rich' | 'poor';
  fitraPaid: number;
  monthlyImamSalary: number;
  imamSalaryPaid: number;
  otherFees: OtherFee[];
  donations: Donation[];
  createdAt: number;
  editCount: number; // Max 1
}

export interface YearlyData {
  families: Family[];
  donations: Donation[];
}

export interface MosqueSettings {
  fitraRatePerPerson: number;
  currentYear: number;
  mosqueName: string;
  monthlyImamSalaryDefault: number;
  availableYears: number[];
}

export interface DistributionResult {
  familyId: string;
  familyName: string;
  type: 'rich' | 'poor';
  amountToReceive: number;
  source: 'own_fitra' | 'surplus_10_anna' | 'surplus_6_anna';
}
