'use client';

import React, { useState } from 'react';
import { CreateShareholderSchema } from '@/lib/validations';
import { z } from 'zod';

interface ShareholderFormProps {
  onSubmit: (name: string, shares: number) => void;
  isLoading?: boolean;
}

type FormErrors = {
  name?: string;
  shares?: string;
  general?: string;
};

export const ShareholderForm: React.FC<ShareholderFormProps> = ({ onSubmit, isLoading = false }) => {
  const [name, setName] = useState('');
  const [shares, setShares] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    try {
      const formData = {
        name: name.trim(),
        shares: parseInt(shares) || 0,
      };
      
      CreateShareholderSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: FormErrors = {};
        
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof FormErrors;
          if (field === 'name' || field === 'shares') {
            formErrors[field] = err.message;
          }
        });
        
        setErrors(formErrors);
      } else {
        setErrors({ general: 'Validation failed' });
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(name.trim(), parseInt(shares));
      // Reset form
      setName('');
      setShares('');
      setErrors({});
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        <h3 className="text-lg font-semibold text-primary">Add New Shareholder</h3>
      </div>
      
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-primary mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.name 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
              placeholder="Enter shareholder name"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="shares" className="block text-sm font-medium text-primary mb-1">
              Shares <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="shares"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.shares 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
              placeholder="Enter number of shares"
              min="1"
              disabled={isLoading}
            />
            {errors.shares && (
              <p className="mt-1 text-red-500 text-sm">{errors.shares}</p>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
                          className="bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              'Add Shareholder'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}; 