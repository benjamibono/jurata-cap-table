'use client';

import React from 'react';
import Link from 'next/link';
import { useCompany } from '../../context/CompanyContext';
import { CompanyCard } from '../../components/CompanyCard';
import { PieChart } from '../../components/PieChart';

export default function CompaniesPage() {
  const { companies } = useCompany();

  const totalCompanies = companies.length;
  const totalShareholders = companies.reduce((sum, company) => sum + company.shareholders.length, 0);
  const totalShares = companies.reduce((sum, company) => 
    sum + company.shareholders.reduce((shareSum, shareholder) => shareSum + shareholder.shares, 0), 0
  );

  const topCompanies = companies
    .map(company => ({
      ...company,
      totalShares: company.shareholders.reduce((sum, shareholder) => sum + shareholder.shares, 0)
    }))
    .sort((a, b) => b.totalShares - a.totalShares)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="main-container py-8">
        <header className="my-8">
          <h1 className="text-3xl font-bold text-jurata-primary">Portfolio Overview</h1>
          <p className="text-jurata-secondary mt-2">
            Manage cap tables across your portfolio companies
          </p>
        </header>

        {companies.length === 0 ? (
          <section className="text-center py-16" role="main" aria-labelledby="empty-state-title">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 id="empty-state-title" className="text-xl font-semibold text-jurata-primary mb-2">No companies yet</h2>
              <p className="text-jurata-secondary">
                Start by adding your first company to manage its cap table
              </p>
            </div>
          </section>
        ) : (
          <>
            {/* Dashboard Grid */}
            <section aria-labelledby="dashboard-title" className="mb-8">
              <h2 id="dashboard-title" className="sr-only">Portfolio Dashboard</h2>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Top Companies */}
                <div className="card h-full opacity-0 animate-fade-in" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
                  <h3 className="text-lg font-semibold text-jurata-primary mb-4">Top Companies by Share Volume</h3>
                  <div className="space-y-3 flex-1" role="list">
                    {topCompanies.map((company, index) => (
                      <div key={company.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" role="listitem">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-jurata-primary text-white rounded-full flex items-center justify-center text-sm font-bold" aria-label={`Rank ${index + 1}`}>
                            {index + 1}
                          </div>
                          <div>
                            <Link href={`/companies/${company.id}`} className="hover:text-jurata-primary transition-colors focus:outline-none focus:ring-2 focus:ring-jurata-primary focus:ring-offset-2 rounded">
                              <div className="font-medium text-jurata-primary hover:underline">{company.name}</div>
                            </Link>
                            <div className="text-sm text-jurata-secondary">
                              {company.shareholders.length} {company.shareholders.length === 1 ? 'shareholder' : 'shareholders'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-jurata-primary">{company.totalShares.toLocaleString()}</div>
                          <div className="text-sm text-jurata-secondary">shares</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Portfolio Distribution Chart */}
                {totalShares > 0 && (
                  <div className="card h-full xl:col-span-2 opacity-0 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-jurata-primary">Portfolio Distribution</h3>
                      <div className="flex items-center space-x-6 text-sm" role="group" aria-label="Portfolio statistics">
                        <div className="text-center">
                          <div className="font-bold text-jurata-primary" aria-label={`${totalCompanies} companies`}>{totalCompanies}</div>
                          <div className="text-jurata-secondary">Companies</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-jurata-primary" aria-label={`${totalShareholders} stakeholders`}>{totalShareholders}</div>
                          <div className="text-jurata-secondary">Stakeholders</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center flex-1">
                      <PieChart 
                        shareholders={companies.map(company => ({
                          id: company.id,
                          name: company.name,
                          shares: company.shareholders.reduce((sum, shareholder) => sum + shareholder.shares, 0)
                        }))}
                        size={280}
                        className="w-full max-w-2xl"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Companies Grid */}
            <section aria-labelledby="companies-title">
              <h2 id="companies-title" className="text-xl font-semibold text-jurata-primary mb-4">All Companies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" role="list">
                {companies.map((company, index) => (
                  <div key={company.id} role="listitem">
                    <CompanyCard company={company} index={index + 3} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
} 