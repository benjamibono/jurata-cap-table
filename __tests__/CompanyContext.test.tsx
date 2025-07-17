import { render, renderHook, act } from '@testing-library/react';
import { CompanyProvider, useCompany } from '@/context/CompanyContext';
import React from 'react';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock UUID
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
}));

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<CompanyProvider>{ui}</CompanyProvider>);
};

const renderHookWithProvider = <T,>(callback: () => T) => {
  return renderHook(callback, {
    wrapper: ({ children }) => <CompanyProvider>{children}</CompanyProvider>,
  });
};

describe('CompanyContext', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
    mockLocalStorage.clear.mockClear();
  });

  describe('Company Operations', () => {
    it('should add a new company', () => {
      const { result } = renderHookWithProvider(() => useCompany());
      
      const newCompany = {
        name: 'New Tech Corp',
        shareholders: [],
      };
      
      act(() => {
        result.current.addCompany(newCompany);
      });
      
      expect(result.current.companies).toHaveLength(5); // 4 initial + 1 new
      expect(result.current.companies[4].name).toBe('New Tech Corp');
      expect(result.current.companies[4].shareholders).toEqual([]);
    });

    it('should update a company', () => {
      const { result } = renderHookWithProvider(() => useCompany());
      
      const companyId = result.current.companies[0].id;
      const updates = { name: 'Updated Company Name' };
      
      act(() => {
        result.current.updateCompany(companyId, updates);
      });
      
      expect(result.current.companies[0].name).toBe('Updated Company Name');
    });

    it('should delete a company', () => {
      const { result } = renderHookWithProvider(() => useCompany());
      
      const companyId = result.current.companies[0].id;
      const initialLength = result.current.companies.length;
      
      act(() => {
        result.current.deleteCompany(companyId);
      });
      
      expect(result.current.companies).toHaveLength(initialLength - 1);
      expect(result.current.companies.find(c => c.id === companyId)).toBeUndefined();
    });

    it('should get company by id', () => {
      const { result } = renderHookWithProvider(() => useCompany());
      
      const companyId = result.current.companies[0].id;
      const company = result.current.getCompanyById(companyId);
      
      expect(company).toBeDefined();
      expect(company?.id).toBe(companyId);
    });

    it('should return undefined for non-existent company', () => {
      const { result } = renderHookWithProvider(() => useCompany());
      
      const company = result.current.getCompanyById('non-existent-id');
      
      expect(company).toBeUndefined();
    });
  });

  describe('Shareholder Operations', () => {
    it('should add a new shareholder to a company', () => {
      const { result } = renderHookWithProvider(() => useCompany());
      
      const companyId = result.current.companies[0].id;
      const initialShareholderCount = result.current.companies[0].shareholders.length;
      
      const newShareholder = {
        name: 'New Shareholder',
        shares: 100,
      };
      
      act(() => {
        result.current.addShareholder(companyId, newShareholder);
      });
      
      const updatedCompany = result.current.companies[0];
      expect(updatedCompany.shareholders).toHaveLength(initialShareholderCount + 1);
      expect(updatedCompany.shareholders[initialShareholderCount].name).toBe('New Shareholder');
      expect(updatedCompany.shareholders[initialShareholderCount].shares).toBe(100);
    });

    it('should update an existing shareholder', () => {
      const { result } = renderHookWithProvider(() => useCompany());
      
      const companyId = result.current.companies[0].id;
      const shareholderId = result.current.companies[0].shareholders[0].id;
      
      const updates = { name: 'Updated Shareholder Name', shares: 500 };
      
      act(() => {
        result.current.updateShareholder(companyId, shareholderId, updates);
      });
      
      const updatedShareholder = result.current.companies[0].shareholders[0];
      expect(updatedShareholder.name).toBe('Updated Shareholder Name');
      expect(updatedShareholder.shares).toBe(500);
    });

    it('should delete a shareholder from a company', () => {
      const { result } = renderHookWithProvider(() => useCompany());
      
      const companyId = result.current.companies[0].id;
      const shareholderId = result.current.companies[0].shareholders[0].id;
      const initialShareholderCount = result.current.companies[0].shareholders.length;
      
      act(() => {
        result.current.deleteShareholder(companyId, shareholderId);
      });
      
      const updatedCompany = result.current.companies[0];
      expect(updatedCompany.shareholders).toHaveLength(initialShareholderCount - 1);
      expect(updatedCompany.shareholders.find(s => s.id === shareholderId)).toBeUndefined();
    });

    it('should handle adding shareholder to non-existent company', () => {
      const { result } = renderHookWithProvider(() => useCompany());
      
      const newShareholder = {
        name: 'New Shareholder',
        shares: 100,
      };
      
      act(() => {
        result.current.addShareholder('non-existent-company', newShareholder);
      });
      
      // Should not throw error and should not affect existing companies
      expect(result.current.companies).toHaveLength(4);
    });

    it('should handle updating non-existent shareholder', () => {
      const { result } = renderHookWithProvider(() => useCompany());
      
      const companyId = result.current.companies[0].id;
      const updates = { name: 'Updated Name' };
      
      act(() => {
        result.current.updateShareholder(companyId, 'non-existent-shareholder', updates);
      });
      
      // Should not throw error and should not affect existing shareholders
      const company = result.current.companies[0];
      expect(company.shareholders.find(s => s.name === 'Updated Name')).toBeUndefined();
    });

    it('should handle deleting non-existent shareholder', () => {
      const { result } = renderHookWithProvider(() => useCompany());
      
      const companyId = result.current.companies[0].id;
      const initialShareholderCount = result.current.companies[0].shareholders.length;
      
      act(() => {
        result.current.deleteShareholder(companyId, 'non-existent-shareholder');
      });
      
      // Should not throw error and should not affect existing shareholders
      expect(result.current.companies[0].shareholders).toHaveLength(initialShareholderCount);
    });
  });

  describe('Data Persistence', () => {
    it('should persist data to localStorage', () => {
      const { result } = renderHookWithProvider(() => useCompany());
      
      // Add a new company
      act(() => {
        result.current.addCompany({ name: 'New Company', shareholders: [] });
      });
      
      expect(result.current.companies).toHaveLength(5);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('jurata-companies', expect.any(String));
    });
  });
}); 