export interface Shareholder {
  id: string;
  name: string;
  shares: number;
}

export interface Company {
  id: string;
  name: string;
  shareholders: Shareholder[];
}

export interface CompanyContextType {
  companies: Company[];
  addCompany: (company: Omit<Company, 'id'>) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  getCompanyById: (id: string) => Company | undefined;
  addShareholder: (companyId: string, shareholder: Omit<Shareholder, 'id'>) => void;
  updateShareholder: (companyId: string, shareholderId: string, shareholder: Partial<Shareholder>) => void;
  deleteShareholder: (companyId: string, shareholderId: string) => void;
} 