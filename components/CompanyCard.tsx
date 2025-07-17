import React from 'react';
import Link from 'next/link';
import { Company } from '../types';

interface CompanyCardProps {
  company: Company;
  index?: number;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, index = 0 }) => {
  const totalShares = company.shareholders.reduce((sum, shareholder) => sum + shareholder.shares, 0);
  
  return (
    <Link href={`/companies/${company.id}`} className="block h-full">
      <article 
        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-jurata-primary cursor-pointer h-full flex flex-col opacity-0 animate-fade-in focus-within:ring-2 focus-within:ring-jurata-primary focus-within:ring-offset-2"
        style={{ 
          animationDelay: `${index * 100}ms`,
          animationFillMode: 'forwards'
        }}
        aria-labelledby={`company-${company.id}-title`}
      >
        <header className="flex items-start justify-between mb-4 gap-3">
          <h3 id={`company-${company.id}-title`} className="text-xl font-semibold text-jurata-primary flex-1 min-w-0">
            {company.name}
          </h3>
          <div className="bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
            <span className="text-xs sm:text-sm font-medium text-jurata-primary whitespace-nowrap">
              {company.shareholders.length} {company.shareholders.length === 1 ? 'holder' : 'holders'}
            </span>
          </div>
        </header>
        
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-jurata-secondary">Total Shares:</span>
            <span className="text-lg font-bold text-jurata-primary">
              {totalShares.toLocaleString()}
            </span>
          </div>
          
          <div className="flex-1">
            {company.shareholders.length > 0 ? (
              <div>
                <p className="text-sm text-jurata-secondary mb-2">Top Shareholders:</p>
                <div className="space-y-1 min-h-[3rem]">
                  {company.shareholders
                    .sort((a, b) => b.shares - a.shares)
                    .slice(0, 2)
                    .map((shareholder) => (
                      <div key={shareholder.id} className="flex justify-between text-sm">
                        <span className="text-jurata-secondary font-medium truncate pr-2">{shareholder.name}</span>
                        <span className="text-jurata-secondary flex-shrink-0">{shareholder.shares.toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="min-h-[3rem] flex items-center">
                <p className="text-sm text-gray-400 italic">No shareholders yet</p>
              </div>
            )}
          </div>
        </div>
        
        <footer className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-jurata-primary text-sm font-medium transition-colors">
            <span>View cap table</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </footer>
      </article>
    </Link>
  );
}; 