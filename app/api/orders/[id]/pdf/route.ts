import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCommercialInvoice, generatePhysiciansNote } from "@/lib/pdf/generateDocs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "invoice";

  const order = await prisma.uSOrder.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "주문을 찾을 수 없습니다." }, { status: 404 });
  }

  let pdfBytes: Uint8Array;
  let filename: string;

  if (type === "note") {
    pdfBytes = generatePhysiciansNote({
      orderNo: order.orderNo,
      patientName: order.patientName,
      drugName: order.drugName,
      drugCategory: order.drugCategory,
      pillDays: order.pillDays,
      createdAt: order.createdAt,
    });
    filename = `physicians_note_${order.orderNo}.pdf`;
  } else {
    pdfBytes = generateCommercialInvoice({
      orderNo: order.orderNo,
      patientName: order.patientName,
      usAddress: order.usAddress,
      drugName: order.drugName,
      pillDays: order.pillDays,
      createdAt: order.createdAt,
    });
    filename = `invoice_${order.orderNo}.pdf`;
  }

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
