// Razorpay Payment Integration
// Handles payment creation and verification

import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'demo_secret',
});

export interface CreateOrderParams {
  amount: number; // in rupees
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: string | number;
  amount_paid: string | number;
  amount_due: string | number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, any>;
  created_at: number;
}

// Create Razorpay order
export async function createRazorpayOrder(
  params: CreateOrderParams
): Promise<RazorpayOrderResponse> {
  try {
    const order = await razorpay.orders.create({
      amount: params.amount * 100, // Convert to paise
      currency: params.currency || 'INR',
      receipt: params.receipt,
      notes: params.notes || {},
    });

    return order as RazorpayOrderResponse;
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw new Error('Failed to create payment order');
  }
}

// Verify Razorpay payment signature
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const text = `${orderId}|${paymentId}`;
    const secret = process.env.RAZORPAY_KEY_SECRET || 'demo_secret';

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

// Fetch payment details
export async function fetchPaymentDetails(paymentId: string) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Fetch payment error:', error);
    throw new Error('Failed to fetch payment details');
  }
}

// Refund payment
export async function refundPayment(
  paymentId: string,
  amount?: number
): Promise<any> {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? amount * 100 : undefined, // Convert to paise if provided
    });
    return refund;
  } catch (error) {
    console.error('Refund error:', error);
    throw new Error('Failed to process refund');
  }
}
