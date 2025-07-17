'use client';

import React, { useState } from 'react';
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

  const totalShares = shareholders.reduce((sum, shareholder) => sum + shareholder.shares, 0);
  const sortedShareholders = [...shareholders].sort((a, b) => b.shares - a.shares);

  const handleDeleteClick = (shareholderId: string) => {
    setConfirmDeleteId(shareholderId);
  };

  const handleConfirmDelete = (shareholderId: string) => {
    setConfirmDeleteId(null);
    onDeleteShareholder(shareholderId);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  if (shareholders.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-jurata-primary mb-4">Shareholders</h3>
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-jurata-primary mb-2">No shareholders yet</h4>
          <p className="text-jurata-secondary mb-4">
            Get started by adding your first shareholder using the form above.
          </p>
          <div className="text-sm text-jurata-secondary bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">💡 Quick tip:</p>
            <p>Add shareholders to track ownership percentages and visualize equity distribution.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-jurata-primary">Shareholders</h3>
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-jurata-primary">
                {shareholders.length} {shareholders.length === 1 ? 'shareholder' : 'shareholders'} • {totalShares.toLocaleString()} shares
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-jurata-secondary uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-jurata-secondary uppercase tracking-wider">
                  Shares
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-jurata-secondary uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-jurata-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedShareholders.map((shareholder) => {
                const percentage = totalShares > 0 ? (shareholder.shares / totalShares) * 100 : 0;
                
                return (
                  <tr key={shareholder.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-jurata-primary">{shareholder.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-jurata-secondary">{shareholder.shares.toLocaleString()}</div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-jurata-primary font-medium">
                          {percentage.toFixed(2)}%
                        </div>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-jurata-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center mb-4">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Shareholder
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete{' '}
                <span className="font-medium text-gray-900">
                  {sortedShareholders.find(s => s.id === confirmDeleteId)?.name}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 bg-white py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jurata-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDelete(confirmDeleteId)}
                className="flex-1 bg-red-600 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 