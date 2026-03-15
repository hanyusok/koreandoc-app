import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await prisma.uSOrder.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "주문을 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const updated = await prisma.uSOrder.update({
    where: { id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.trackingNo !== undefined && { trackingNo: body.trackingNo }),
      ...(body.isApproved !== undefined && { isApproved: body.isApproved }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.paymentStatus && { paymentStatus: body.paymentStatus }),
    },
  });

  return NextResponse.json(updated);
}
