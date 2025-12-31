// Payment Verification API
// Verifies Razorpay payment signature and updates order

import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      medsbharat_order_id,
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Update order payment status
    if (medsbharat_order_id) {
      await db.order.update({
        where: { id: medsbharat_order_id },
        data: {
          paymentStatus: 'SUCCESS',
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
