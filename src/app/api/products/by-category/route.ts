// Products by Category API Route
// Fetches medicines filtered by category

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'medication';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Map category IDs to database categories
    const categoryMap: Record<string, string> = {
      'medication': 'medicine',
      'healthcare': 'healthcare',
      'personal-care': 'personal-care',
      'baby-care': 'baby-care',
      'diabetes': 'diabetes',
      'ayurveda': 'ayurveda',
    };

    const dbCategory = categoryMap[category] || category;

    // Fetch products from database
    const products = await db.medicine.findMany({
      where: {
        category: {
          contains: dbCategory,
          mode: 'insensitive',
        },
        available: true,
      },
      include: {
        pharmacy: {
          select: {
            id: true,
            businessName: true,
          },
        },
      },
      take: limit,
      orderBy: {
        orderCount: 'desc', // Popular first
      },
    });

    return NextResponse.json({
      success: true,
      category,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        products: [],
      },
      { status: 500 }
    );
  }
}
