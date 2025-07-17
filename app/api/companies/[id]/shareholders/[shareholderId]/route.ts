import { NextRequest, NextResponse } from 'next/server';
import { UpdateShareholderSchema, ShareholderSchema, Company, Shareholder } from '@/lib/validations';
import { companies, initializeData } from '@/lib/data';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; shareholderId: string }> }) {
  try {
    const { id: companyId, shareholderId } = await params;
    const body = await request.json();
    
    // Validate the request body
    const validatedData = UpdateShareholderSchema.parse(body);
    
    initializeData();
    const companyIndex = companies.findIndex((c: Company) => c.id === companyId);
    
    if (companyIndex === -1) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    const shareholderIndex = companies[companyIndex].shareholders.findIndex(
      (s: Shareholder) => s.id === shareholderId
    );
    
    if (shareholderIndex === -1) {
      return NextResponse.json(
        { error: 'Shareholder not found' },
        { status: 404 }
      );
    }
    
    // Update the shareholder
    companies[companyIndex].shareholders[shareholderIndex] = {
      ...companies[companyIndex].shareholders[shareholderIndex],
      ...validatedData,
    };
    
    // Validate the updated shareholder
    const validatedShareholder = ShareholderSchema.parse(
      companies[companyIndex].shareholders[shareholderIndex]
    );
    
    return NextResponse.json({
      shareholder: validatedShareholder,
      message: 'Shareholder updated successfully'
    });
  } catch (error) {
    console.error('Error updating shareholder:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update shareholder' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; shareholderId: string }> }) {
  try {
    const { id: companyId, shareholderId } = await params;
    
    initializeData();
    const companyIndex = companies.findIndex((c: Company) => c.id === companyId);
    
    if (companyIndex === -1) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    const shareholderIndex = companies[companyIndex].shareholders.findIndex(
      (s: Shareholder) => s.id === shareholderId
    );
    
    if (shareholderIndex === -1) {
      return NextResponse.json(
        { error: 'Shareholder not found' },
        { status: 404 }
      );
    }
    
    // Remove the shareholder
    companies[companyIndex].shareholders.splice(shareholderIndex, 1);
    
    return NextResponse.json({
      message: 'Shareholder deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting shareholder:', error);
    return NextResponse.json(
      { error: 'Failed to delete shareholder' },
      { status: 500 }
    );
  }
} 