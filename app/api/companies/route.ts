import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { CreateCompanySchema, CompanySchema } from '@/lib/validations';
import { companies, initializeData } from '@/lib/data';

export async function GET() {
  try {
    initializeData();
    return NextResponse.json({ companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = CreateCompanySchema.parse(body);
    
    // Create new company
    const newCompany = {
      id: uuidv4(),
      ...validatedData,
    };
    
    // Validate the complete company object
    const validatedCompany = CompanySchema.parse(newCompany);
    
    initializeData();
    companies.push(validatedCompany);
    
    return NextResponse.json(
      { company: validatedCompany, message: 'Company created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating company:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
} 