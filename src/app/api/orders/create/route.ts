// Order Creation API Route
// Creates new order in database

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      pharmacyId,
      deliveryAddress,
      deliveryLatitude,
      deliveryLongitude,
      contactPhone,
      prescriptionUrl,
      items,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod,
      specialInstructions,
    } = data;

    // Validate required fields
    if (
      !pharmacyId ||
      !deliveryAddress ||
      !contactPhone ||
      !prescriptionUrl ||
      !items ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique order number
    const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create order (for now, without user authentication)
    // In production, you would get patientId from session
    const patientId = 'temp-patient-id'; // TODO: Get from session

    const order = await db.order.create({
      data: {
        orderNumber,
        patientId,
        pharmacyId,
        deliveryAddress,
        deliveryLatitude: deliveryLatitude || 0,
        deliveryLongitude: deliveryLongitude || 0,
        contactPhone,
        prescriptionUrl,
        specialInstructions,
        subtotal,
        deliveryFee,
        totalAmount,
        paymentMethod,
        paymentStatus: 'PENDING',
        status: 'PLACED',
        items: {
          create: items.map((item: any) => ({
            medicineId: item.medicineId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            medicine: true,
          },
        },
        pharmacy: true,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
