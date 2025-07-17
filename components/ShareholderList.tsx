'use client';

import React, { useState, useEffect } from 'react';
import { Shareholder } from '../types';

interface ShareholderListProps {
  shareholders: Shareholder[];
  onDeleteShareholder: (shareholderId: string) => void;
  isLoading?: boolean;
}

export const ShareholderList: React.FC<ShareholderListProps> = ({ 
  shareholders, 
  onDeleteShareholder, 
  isLoading = false 
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmEnabled, setConfirmEnabled] = useState(false);
  const [countdown, setCountdown] = useState(2);

  const totalShares = shareholders.reduce((sum, shareholder) => sum + shareholder.shares, 0);
  const sortedShareholders = [...shareholders].sort((a, b) => b.shares - a.shares);

  // Reset confirm enabled state when confirmDeleteId changes
  useEffect(() => {
    if (confirmDeleteId) {
      setConfirmEnabled(false);
      setCountdown(2);
      
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setConfirmEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [confirmDeleteId]);

  const handleDeleteClick = (shareholderId: string) => {
    setConfirmDeleteId(shareholderId);
  };

  const handleConfirmDelete = (shareholderId: string) => {
    setConfirmDeleteId(null);
    setConfirmEnabled(false);
    onDeleteShareholder(shareholderId);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
    setConfirmEnabled(false);
  };

  if (shareholders.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-primary mb-4">Shareholders</h3>
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-primary mb-2">No shareholders yet</h4>
          <p className="text-secondary mb-4">
            Get started by adding your first shareholder using the form above.
          </p>
          <div className="text-sm text-secondary bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">💡 Quick tip:</p>
            <p>Add shareholders to track ownership percentages and visualize equity distribution.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-primary">Shareholders</h3>
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-primary">
              <span className="block sm:inline">
                {shareholders.length} {shareholders.length === 1 ? 'shareholder' : 'shareholders'}
              </span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline">
                {totalShares.toLocaleString()} shares
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Shares
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Percentage
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedShareholders.map((shareholder) => {
              const percentage = totalShares > 0 ? (shareholder.shares / totalShares) * 100 : 0;
              const isConfirming = confirmDeleteId === shareholder.id;
              
              return (
                <tr key={shareholder.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-primary">{shareholder.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary">{shareholder.shares.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm text-primary font-medium">
                        {percentage.toFixed(2)}%
                      </div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {isConfirming ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={handleCancelDelete}
                          className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
                          title="Cancel"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleConfirmDelete(shareholder.id)}
                          disabled={!confirmEnabled || isLoading}
                          className={`transition-all duration-200 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                            confirmEnabled && !isLoading
                              ? 'text-red-600 hover:text-red-900 cursor-pointer'
                              : 'text-red-300 cursor-not-allowed'
                          }`}
                          title={confirmEnabled ? 'Confirm delete' : 'Please wait...'}
                        >
                          {confirmEnabled ? 'Confirm' : `Confirm (${countdown}s)`}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDeleteClick(shareholder.id)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        title={`Delete ${shareholder.name}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-200">
          {sortedShareholders.map((shareholder) => {
            const percentage = totalShares > 0 ? (shareholder.shares / totalShares) * 100 : 0;
            const isConfirming = confirmDeleteId === shareholder.id;
            
            return (
              <div key={shareholder.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-primary mb-1">
                      {shareholder.name}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-secondary">
                      <span>{shareholder.shares.toLocaleString()} shares</span>
                      <span className="font-medium text-primary">
                        {percentage.toFixed(2)}%
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {isConfirming ? (
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={handleCancelDelete}
                          className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-xs"
                          title="Cancel"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleConfirmDelete(shareholder.id)}
                          disabled={!confirmEnabled || isLoading}
                          className={`transition-all duration-200 px-2 py-1 rounded text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                            confirmEnabled && !isLoading
                              ? 'text-red-600 hover:text-red-900 cursor-pointer'
                              : 'text-red-300 cursor-not-allowed'
                          }`}
                          title={confirmEnabled ? 'Confirm delete' : 'Please wait...'}
                        >
                          {confirmEnabled ? 'Confirm' : `Confirm (${countdown}s)`}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDeleteClick(shareholder.id)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        title={`Delete ${shareholder.name}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 