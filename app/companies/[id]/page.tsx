'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCompany } from '../../../context/CompanyContext';
import { ShareholderList } from '../../../components/ShareholderList';
import { ShareholderForm } from '../../../components/ShareholderForm';
import { PieChart } from '../../../components/PieChart';

export default function CompanyDetailPage() {
  const params = useParams();
  const { getCompanyById, addShareholder, deleteShareholder } = useCompany();
  const [isLoading, setIsLoading] = useState(false);
  
  const companyId = params.id as string;
  const company = getCompanyById(companyId);

  if (!company) {
    return (
      <div className="page-container">
        <div className="main-container">
          <div className="page-content">
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h2 className="text-xl font-semibold text-primary mb-2">Company Not Found</h2>
              <p className="text-secondary mb-4">
                The company you&apos;re looking for doesn&apos;t exist or has been deleted.
              </p>
              <Link 
                href="/companies"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Back to Companies
              </Link>
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddShareholder = (name: string, shares: number) => {
    setIsLoading(true);
    addShareholder(companyId, { name, shares });
    setIsLoading(false);
  };

  const handleDeleteShareholder = (shareholderId: string) => {
    setIsLoading(true);
    deleteShareholder(companyId, shareholderId);
    setIsLoading(false);
  };

  const totalShares = company.shareholders.reduce((sum, shareholder) => sum + shareholder.shares, 0);

  return (
    <div className="page-container">
      <div className="main-container">
        <div className="page-content">
        {/* Breadcrumb */}
        <nav className="page-header">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/companies" className="text-primary hover:opacity-80 transition-opacity">
                Companies
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-secondary">{company.name}</li>
          </ol>
        </nav>

        {/* Company Header */}
        <section className="section">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-primary">{company.name}</h1>
              </div>
              <div className="text-center md:text-right">
                <div className="text-xl md:text-2xl font-bold text-primary">{totalShares.toLocaleString()}</div>
                <div className="text-sm text-secondary">Total Shares</div>
              </div>
            </div>
          </div>
        </section>

        {/* Grid for Company Details */}
        <section className="section">
          <div className="company-details-grid">
            {/* Ownership Distribution Chart */}
            {company.shareholders.length > 0 && (
              <div className="card">
                <h3 className="card-title">Ownership Distribution</h3>
                <PieChart 
                  shareholders={company.shareholders}
                  size={220}
                  className="w-full"
                />
              </div>
            )}
            {/* Add Shareholder Form */}
            <div className="card">
              <ShareholderForm 
                onSubmit={handleAddShareholder}
                isLoading={isLoading}
              />
            </div>
          </div>
        </section>

        {/* Shareholders List */}
        <section className="section">
          <ShareholderList 
            shareholders={company.shareholders}
            onDeleteShareholder={handleDeleteShareholder}
            isLoading={isLoading}
          />
        </section>
        </div>
      </div>
    </div>
  );
} 