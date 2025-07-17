import { 
  CreateShareholderSchema, 
  CreateCompanySchema,
  UpdateShareholderSchema,
  UpdateCompanySchema,
  ShareholderSchema,
  CompanySchema
} from '@/lib/validations';

describe('Validation Schemas', () => {
  describe('CreateShareholderSchema', () => {
    it('should validate valid shareholder data', () => {
      const validData = {
        name: 'John Doe',
        shares: 100
      };
      
      expect(() => CreateShareholderSchema.parse(validData)).not.toThrow();
    });
    
    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        shares: 100
      };
      
      expect(() => CreateShareholderSchema.parse(invalidData)).toThrow();
    });
    
    it('should reject negative shares', () => {
      const invalidData = {
        name: 'John Doe',
        shares: -1
      };
      
      expect(() => CreateShareholderSchema.parse(invalidData)).toThrow();
    });
    
    it('should reject zero shares', () => {
      const invalidData = {
        name: 'John Doe',
        shares: 0
      };
      
      expect(() => CreateShareholderSchema.parse(invalidData)).toThrow();
    });
    
    it('should reject non-integer shares', () => {
      const invalidData = {
        name: 'John Doe',
        shares: 10.5
      };
      
      expect(() => CreateShareholderSchema.parse(invalidData)).toThrow();
    });
    
    it('should trim whitespace from name', () => {
      const dataWithWhitespace = {
        name: '  John Doe  ',
        shares: 100
      };
      
      const result = CreateShareholderSchema.parse(dataWithWhitespace);
      expect(result.name).toBe('John Doe');
    });
  });
  
  describe('CreateCompanySchema', () => {
    it('should validate valid company data', () => {
      const validData = {
        name: 'Tech Corp',
        shareholders: []
      };
      
      expect(() => CreateCompanySchema.parse(validData)).not.toThrow();
    });
    
    it('should reject empty company name', () => {
      const invalidData = {
        name: '',
        shareholders: []
      };
      
      expect(() => CreateCompanySchema.parse(invalidData)).toThrow();
    });
    
    it('should default shareholders to empty array', () => {
      const dataWithoutShareholders = {
        name: 'Tech Corp'
      };
      
      const result = CreateCompanySchema.parse(dataWithoutShareholders);
      expect(result.shareholders).toEqual([]);
    });
    
    it('should trim whitespace from company name', () => {
      const dataWithWhitespace = {
        name: '  Tech Corp  ',
        shareholders: []
      };
      
      const result = CreateCompanySchema.parse(dataWithWhitespace);
      expect(result.name).toBe('Tech Corp');
    });
  });
  
  describe('UpdateShareholderSchema', () => {
    it('should validate partial updates', () => {
      const validData = {
        name: 'Updated Name'
      };
      
      expect(() => UpdateShareholderSchema.parse(validData)).not.toThrow();
    });
    
    it('should validate shares only update', () => {
      const validData = {
        shares: 200
      };
      
      expect(() => UpdateShareholderSchema.parse(validData)).not.toThrow();
    });
    
    it('should reject empty name in update', () => {
      const invalidData = {
        name: ''
      };
      
      expect(() => UpdateShareholderSchema.parse(invalidData)).toThrow();
    });
  });
  
  describe('ShareholderSchema', () => {
    it('should validate complete shareholder object', () => {
      const validShareholder = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        shares: 100
      };
      
      expect(() => ShareholderSchema.parse(validShareholder)).not.toThrow();
    });
    
    it('should reject invalid UUID', () => {
      const invalidShareholder = {
        id: 'invalid-uuid',
        name: 'John Doe',
        shares: 100
      };
      
      expect(() => ShareholderSchema.parse(invalidShareholder)).toThrow();
    });
  });
  
  describe('CompanySchema', () => {
    it('should validate complete company object', () => {
      const validCompany = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Tech Corp',
        shareholders: [
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'John Doe',
            shares: 100
          }
        ]
      };
      
      expect(() => CompanySchema.parse(validCompany)).not.toThrow();
    });
    
    it('should validate company with no shareholders', () => {
      const validCompany = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Tech Corp',
        shareholders: []
      };
      
      expect(() => CompanySchema.parse(validCompany)).not.toThrow();
    });
  });
}); 