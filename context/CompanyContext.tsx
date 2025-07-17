'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Company, Shareholder, CompanyContextType } from '../types';

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Sample data for initial load featuring Jurata team members
const sampleCompanies: Company[] = [
  {
    id: 'legaltech-innovations',
    name: 'LegalTech Innovations',
    shareholders: [
      { id: 'luca-fabian', name: 'Luca Fábián', shares: 3500 },
      { id: 'david-roegiers', name: 'David Roegiers', shares: 3200 },
      { id: 'sercan-izgi', name: 'Sercan Izgi', shares: 1800 },
      { id: 'selim-gautschi', name: 'Selim Gautschi', shares: 1200 },
      { id: 'jurata-capital-partners-1', name: 'Jurata Capital Partners', shares: 2300 }
    ]
  },
  {
    id: 'swiss-ai-solutions',
    name: 'Swiss AI Solutions',
    shareholders: [
      { id: 'mihai-chiciu', name: 'Mihai Chiciu', shares: 2200 },
      { id: 'joel-wohlhauser', name: 'Joel Wohlhauser', shares: 2000 },
      { id: 'jakub-zak', name: 'Jakub Zak', shares: 1800 },
      { id: 'pauline-meyer', name: 'Pauline Meyer', shares: 1500 },
      { id: 'luca-buchi', name: 'Luca Büchi', shares: 1200 },
      { id: 'venture-capital-zurich', name: 'Venture Capital Zurich', shares: 2800 }
    ]
  },
  {
    id: 'digital-operations-hub',
    name: 'Digital Operations Hub',
    shareholders: [
      { id: 'tristan-schloesser', name: 'Tristan Schloesser', shares: 1600 },
      { id: 'moesha-hagmann', name: 'Moesha Hagmann', shares: 1400 },
      { id: 'tatjana-russo', name: 'Tatjana Russo', shares: 1200 },
      { id: 'francoise-birnholz', name: 'Françoise Birnholz', shares: 2000 },
      { id: 'manuel-hauslaib', name: 'Manuel Hauslaib', shares: 1800 },
      { id: 'swiss-innovation-fund', name: 'Swiss Innovation Fund', shares: 2400 }
    ]
  },
  {
    id: 'advisory-ventures',
    name: 'Advisory Ventures',
    shareholders: [
      { id: 'florian-faes', name: 'Florian Faes', shares: 1500 },
      { id: 'sandor-horvath', name: 'Sandor Horvath', shares: 1400 },
      { id: 'simon-raess', name: 'Simon Raess', shares: 1300 },
      { id: 'milena-reutlinger', name: 'Milena Reutlinger', shares: 1200 },
      { id: 'ralf-schlaepfer', name: 'Ralf Schlaepfer', shares: 1100 },
      { id: 'andrin-spring', name: 'Andrin Spring', shares: 1000 },
      { id: 'jurata-capital-partners-2', name: 'Jurata Capital Partners', shares: 3500 }
    ]
  }
];

interface CompanyProviderProps {
  children: ReactNode;
}

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCompanies = localStorage.getItem('jurata-companies');
    if (savedCompanies) {
      try {
        setCompanies(JSON.parse(savedCompanies));
      } catch (error) {
        console.error('Error parsing saved companies:', error);
        setCompanies(sampleCompanies);
      }
    } else {
      setCompanies(sampleCompanies);
    }
  }, []);

  // Save to localStorage whenever companies change
  useEffect(() => {
    if (companies.length > 0) {
      localStorage.setItem('jurata-companies', JSON.stringify(companies));
    }
  }, [companies]);

  const addCompany = (company: Omit<Company, 'id'>) => {
    const newCompany: Company = {
      ...company,
      id: uuidv4()
    };
    setCompanies(prev => [...prev, newCompany]);
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies(prev => 
      prev.map(company => 
        company.id === id ? { ...company, ...updates } : company
      )
    );
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(company => company.id !== id));
  };

  const getCompanyById = (id: string): Company | undefined => {
    return companies.find(company => company.id === id);
  };

  const addShareholder = (companyId: string, shareholder: Omit<Shareholder, 'id'>) => {
    const newShareholder: Shareholder = {
      ...shareholder,
      id: uuidv4()
    };

    setCompanies(prev => 
      prev.map(company => 
        company.id === companyId 
          ? { ...company, shareholders: [...company.shareholders, newShareholder] }
          : company
      )
    );
  };

  const updateShareholder = (companyId: string, shareholderId: string, updates: Partial<Shareholder>) => {
    setCompanies(prev => 
      prev.map(company => 
        company.id === companyId
          ? {
              ...company,
              shareholders: company.shareholders.map(shareholder =>
                shareholder.id === shareholderId
                  ? { ...shareholder, ...updates }
                  : shareholder
              )
            }
          : company
      )
    );
  };

  const deleteShareholder = (companyId: string, shareholderId: string) => {
    setCompanies(prev => 
      prev.map(company => 
        company.id === companyId
          ? {
              ...company,
              shareholders: company.shareholders.filter(shareholder => shareholder.id !== shareholderId)
            }
          : company
      )
    );
  };

  const value: CompanyContextType = {
    companies,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
    addShareholder,
    updateShareholder,
    deleteShareholder
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}; 