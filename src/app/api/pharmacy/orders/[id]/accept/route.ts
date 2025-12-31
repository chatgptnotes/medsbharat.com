// Accept Order API - Pharmacy
// Updates order status to ACCEPTED

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await db.order.update({
      where: { id },
      data: {
        status: 'ACCEPTED',
        acceptedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error accepting order:', error);
    return NextResponse.json(
      { error: 'Failed to accept order' },
      { status: 500 }
    );
  }
}
