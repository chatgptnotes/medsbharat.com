// Payment Order Creation API
// Creates Razorpay order for checkout

import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const { amount, orderId, customerName, customerEmail } = await request.json();

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: 'Amount and order ID are required' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amount,
      receipt: orderId,
      notes: {
        customerName: customerName || 'Guest',
        customerEmail: customerEmail || '',
        medsBharatOrderId: orderId,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
