import { z } from 'zod';

// Base validation schemas
export const ShareholderSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').trim(),
  shares: z.number().min(1, 'Shares must be greater than 0').int('Shares must be a whole number'),
});

export const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Company name is required').trim(),
  shareholders: z.array(ShareholderSchema),
});

// Form validation schemas (for creating new entities)
export const CreateShareholderSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  shares: z.number().min(1, 'Shares must be greater than 0').int('Shares must be a whole number'),
});

export const CreateCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').trim(),
  shareholders: z.array(ShareholderSchema).default([]),
});

// Update validation schemas (for editing existing entities)
export const UpdateShareholderSchema = z.object({
  name: z.string().min(1, 'Name is required').trim().optional(),
  shares: z.number().min(1, 'Shares must be greater than 0').int('Shares must be a whole number').optional(),
});

export const UpdateCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').trim().optional(),
  shareholders: z.array(ShareholderSchema).optional(),
});

// API request validation schemas
export const ApiCreateShareholderSchema = z.object({
  companyId: z.string().uuid(),
  ...CreateShareholderSchema.shape,
});

export const ApiUpdateShareholderSchema = z.object({
  companyId: z.string().uuid(),
  shareholderId: z.string().uuid(),
  ...UpdateShareholderSchema.shape,
});

export const ApiDeleteShareholderSchema = z.object({
  companyId: z.string().uuid(),
  shareholderId: z.string().uuid(),
});

// Type exports
export type Shareholder = z.infer<typeof ShareholderSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type CreateShareholder = z.infer<typeof CreateShareholderSchema>;
export type CreateCompany = z.infer<typeof CreateCompanySchema>;
export type UpdateShareholder = z.infer<typeof UpdateShareholderSchema>;
export type UpdateCompany = z.infer<typeof UpdateCompanySchema>;
export type ApiCreateShareholder = z.infer<typeof ApiCreateShareholderSchema>;
export type ApiUpdateShareholder = z.infer<typeof ApiUpdateShareholderSchema>;
export type ApiDeleteShareholder = z.infer<typeof ApiDeleteShareholderSchema>; 