import { NextRequest, NextResponse } from "next/server";
import { checkDrugEligibility } from "@/lib/drugList";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name || name.trim().length < 1) {
    return NextResponse.json(
      { error: "약 이름을 입력해주세요." },
      { status: 400 }
    );
  }

  const result = checkDrugEligibility(name);

  if (!result.found) {
    return NextResponse.json({
      found: false,
      eligible: false,
      note: "해당 약품은 현재 서비스 목록에 없습니다. 카카오톡으로 문의해 주세요.",
    });
  }

  return NextResponse.json({
    found: true,
    eligible: result.drug!.eligible,
    drugName: result.drug!.name,
    category: result.drug!.category,
    note: result.drug!.note,
    maxDays: result.drug!.maxDays,
  });
}
