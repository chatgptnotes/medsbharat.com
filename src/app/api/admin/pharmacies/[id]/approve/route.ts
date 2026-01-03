// Approve Pharmacy API - Admin
// Approves pending pharmacy application

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pharmacy = await db.pharmacy.update({
      where: { id },
      data: {
        status: 'APPROVED',
      },
    });

    return NextResponse.json({ success: true, pharmacy });
  } catch (error) {
    console.error('Error approving pharmacy:', error);
    return NextResponse.json(
      { error: 'Failed to approve pharmacy' },
      { status: 500 }
    );
  }
}
