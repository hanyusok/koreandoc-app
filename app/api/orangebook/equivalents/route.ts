import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tradeName = searchParams.get('tradeName');
    const applNo = searchParams.get('applNo');
    const productNo = searchParams.get('productNo');

    if (!tradeName && (!applNo || !productNo)) {
      return NextResponse.json({ error: 'Please provide either tradeName or applNo and productNo' }, { status: 400 });
    }

    let originalProduct;

    if (applNo && productNo) {
      originalProduct = await prisma.orangeBookProduct.findFirst({
        where: { applNo, productNo }
      });
    } else if (tradeName) {
      originalProduct = await prisma.orangeBookProduct.findFirst({
        where: { tradeName: { equals: tradeName, mode: 'insensitive' } }
      });
    }

    if (!originalProduct) {
      return NextResponse.json({ error: 'Original product not found' }, { status: 404 });
    }

    const { ingredient, strength, applicant } = originalProduct;

    const equivalents = await prisma.orangeBookProduct.findMany({
      where: {
        ingredient: ingredient,
        strength: strength,
        applicant: { not: applicant }
      }
    });

    return NextResponse.json({
      original: originalProduct,
      equivalents: equivalents
    });
  } catch (error: any) {
    console.error('Error fetching equivalents:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
