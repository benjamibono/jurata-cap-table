import { NextRequest, NextResponse } from 'next/server';
import { UpdateCompanySchema, CompanySchema, Company } from '@/lib/validations';
import { companies, initializeData } from '@/lib/data';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    initializeData();
    
    const company = companies.find((c: Company) => c.id === id);
    
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ company });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate the request body
    const validatedData = UpdateCompanySchema.parse(body);
    
    initializeData();
    const companyIndex = companies.findIndex((c: Company) => c.id === id);
    
    if (companyIndex === -1) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    // Update the company
    companies[companyIndex] = {
      ...companies[companyIndex],
      ...validatedData,
    };
    
    // Validate the updated company
    const validatedCompany = CompanySchema.parse(companies[companyIndex]);
    
    return NextResponse.json({
      company: validatedCompany,
      message: 'Company updated successfully'
    });
  } catch (error) {
    console.error('Error updating company:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    initializeData();
    const companyIndex = companies.findIndex((c: Company) => c.id === id);
    
    if (companyIndex === -1) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    // Remove the company
    companies.splice(companyIndex, 1);
    
    return NextResponse.json({
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    );
  }
} 