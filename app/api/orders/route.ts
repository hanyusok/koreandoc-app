import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNo } from "@/lib/orderNo";
import { checkDrugEligibility } from "@/lib/drugList";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const orders = await prisma.uSOrder.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const patientName = formData.get("patientName") as string;
    const usAddress = formData.get("usAddress") as string;
    const kakaoId = formData.get("kakaoId") as string;
    const drugName = formData.get("drugName") as string;
    const pillDays = parseInt(formData.get("pillDays") as string, 10);
    const paymentMethod = formData.get("paymentMethod") as string;
    const file = formData.get("prescriptionImg") as File;

    // Validate 90-day rule
    if (pillDays > 90) {
      return NextResponse.json(
        { error: "90일치(3개월분)를 초과하는 주문은 접수할 수 없습니다." },
        { status: 400 }
      );
    }

    // Save prescription image
    let prescriptionImgPath = "";
    if (file && file.size > 0) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split(".").pop();
      const filename = `rx_${Date.now()}.${ext}`;
      await writeFile(path.join(uploadsDir, filename), buffer);
      prescriptionImgPath = `/uploads/${filename}`;
    }

    // Get drug category
    const drugCheck = checkDrugEligibility(drugName);
    const drugCategory = drugCheck.drug?.category ?? null;

    // Generate order number
    const orderNo = await generateOrderNo();

    const order = await prisma.uSOrder.create({
      data: {
        orderNo,
        patientName,
        usAddress,
        kakaoId: kakaoId || null,
        prescriptionImg: prescriptionImgPath,
        pillDays,
        drugName,
        drugCategory,
        paymentMethod: paymentMethod || null,
      },
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "주문 접수 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
