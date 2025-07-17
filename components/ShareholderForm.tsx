'use client';

import React, { useState, useEffect } from 'react';
import { CreateShareholderSchema } from '@/lib/validations';
import { z } from 'zod';

interface ShareholderFormProps {
  onSubmit: (name: string, shares: number) => void;
  isLoading?: boolean;
}

type FormErrors = {
  name?: string[];
  shares?: string[];
  general?: string;
};

type TouchedFields = {
  name: boolean;
  shares: boolean;
};

export const ShareholderForm: React.FC<ShareholderFormProps> = ({ onSubmit, isLoading = false }) => {
  const [name, setName] = useState('');
  const [shares, setShares] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({ name: false, shares: false });

  const validateForm = (showAllErrors = false): boolean => {
    try {
      // Parse the form data with Zod
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
            // Only show errors for touched fields unless showAllErrors is true
            if (showAllErrors || touched[field]) {
              if (!formErrors[field]) {
                formErrors[field] = [];
              }
              formErrors[field]!.push(err.message);
            }
          }
        });
        
        setErrors(formErrors);
      } else {
        setErrors({ general: 'Validation failed' });
      }
      return false;
    }
  };

  // Real-time validation when fields are touched
  useEffect(() => {
    if (touched.name || touched.shares) {
      validateForm(false);
    }
  }, [name, shares, touched]);

  const handleBlur = (field: keyof TouchedFields) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched and validate
    setTouched({ name: true, shares: true });
    
    if (validateForm(true)) {
      onSubmit(name.trim(), parseInt(shares));
      // Reset form
      setName('');
      setShares('');
      setErrors({});
      setTouched({ name: false, shares: false });
    }
  };

  const hasNameError = errors.name && errors.name.length > 0;
  const hasSharesError = errors.shares && errors.shares.length > 0;

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <svg className="w-5 h-5 text-jurata-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        <h3 className="text-lg font-semibold text-jurata-primary">Add New Shareholder</h3>
      </div>
      
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-jurata-primary mb-1">
              Name <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur('name')}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                hasNameError 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-jurata-primary focus:border-jurata-primary'
              }`}
              placeholder="Enter shareholder name"
              disabled={isLoading}
              aria-invalid={hasNameError}
              aria-describedby={hasNameError ? 'name-error' : undefined}
            />
            {hasNameError && (
              <div id="name-error" className="mt-1" role="alert">
                {errors.name!.map((error, index) => (
                  <p key={index} className="text-red-500 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="shares" className="block text-sm font-medium text-jurata-primary mb-1">
              Shares <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              type="number"
              id="shares"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              onBlur={() => handleBlur('shares')}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                hasSharesError 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-jurata-primary focus:border-jurata-primary'
              }`}
              placeholder="Enter number of shares"
              min="1"
              disabled={isLoading}
              aria-invalid={hasSharesError}
              aria-describedby={hasSharesError ? 'shares-error' : undefined}
            />
            {hasSharesError && (
              <div id="shares-error" className="mt-1" role="alert">
                {errors.shares!.map((error, index) => (
                  <p key={index} className="text-red-500 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-jurata-primary text-white px-6 py-3 rounded-lg hover:bg-jurata-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-jurata-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center"
            aria-describedby="submit-help"
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
        <p id="submit-help" className="text-xs text-jurata-secondary mt-2 text-right">
          All fields are required. Shares must be a positive whole number.
        </p>
      </form>
    </div>
  );
}; 