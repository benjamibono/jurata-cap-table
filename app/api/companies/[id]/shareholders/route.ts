import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { CreateShareholderSchema, ShareholderSchema, Company } from '@/lib/validations';
import { companies, initializeData } from '@/lib/data';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: companyId } = await params;
    const body = await request.json();
    
    // Validate the request body
    const validatedData = CreateShareholderSchema.parse(body);
    
    initializeData();
    const companyIndex = companies.findIndex((c: Company) => c.id === companyId);
    
    if (companyIndex === -1) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    // Create new shareholder
    const newShareholder = {
      id: uuidv4(),
      ...validatedData,
    };
    
    // Validate the complete shareholder object
    const validatedShareholder = ShareholderSchema.parse(newShareholder);
    
    // Add shareholder to company
    companies[companyIndex].shareholders.push(validatedShareholder);
    
    return NextResponse.json(
      { 
        shareholder: validatedShareholder, 
        message: 'Shareholder created successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating shareholder:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create shareholder' },
      { status: 500 }
    );
  }
} 