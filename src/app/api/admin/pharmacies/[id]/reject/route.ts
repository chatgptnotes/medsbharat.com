// Reject Pharmacy API - Admin
// Rejects pending pharmacy application

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    const pharmacy = await db.pharmacy.update({
      where: { id },
      data: {
        status: 'REJECTED',
      },
    });

    return NextResponse.json({ success: true, pharmacy });
  } catch (error) {
    console.error('Error rejecting pharmacy:', error);
    return NextResponse.json(
      { error: 'Failed to reject pharmacy' },
      { status: 500 }
    );
  }
}
