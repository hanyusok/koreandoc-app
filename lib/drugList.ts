export interface DrugInfo {
  name: string;
  aliases: string[];
  category: string;
  eligible: boolean;
  note: string;
  maxDays: number;
}

export const DRUG_LIST: DrugInfo[] = [
  // ✅ 탈모약
  {
    name: "피나스테리드",
    aliases: ["finasteride", "프로페시아", "propecia", "피나리드"],
    category: "탈모약",
    eligible: true,
    note: "90일치 이내 개인 사용 배송 가능합니다.",
    maxDays: 90,
  },
  {
    name: "두타스테리드",
    aliases: ["dutasteride", "아보다트", "avodart"],
    category: "탈모약",
    eligible: true,
    note: "90일치 이내 개인 사용 배송 가능합니다.",
    maxDays: 90,
  },
  {
    name: "미녹시딜",
    aliases: ["minoxidil", "마이녹실", "로게인", "rogaine"],
    category: "탈모약",
    eligible: true,
    note: "90일치 이내 개인 사용 배송 가능합니다.",
    maxDays: 90,
  },

  // ✅ 피부과 연고
  {
    name: "스티바A",
    aliases: ["stiva-a", "tretinoin", "트레티노인", "레틴A", "retin-a"],
    category: "피부과 연고",
    eligible: true,
    note: "90일치 이내 개인 사용 배송 가능합니다.",
    maxDays: 90,
  },
  {
    name: "디페린",
    aliases: ["differin", "아다팔렌", "adapalene"],
    category: "피부과 연고",
    eligible: true,
    note: "90일치 이내 개인 사용 배송 가능합니다.",
    maxDays: 90,
  },

  // ✅ 만성질환 약
  {
    name: "메트포르민",
    aliases: ["metformin", "글루코파지", "glucophage"],
    category: "만성질환약",
    eligible: true,
    note: "90일치 이내 개인 사용 배송 가능합니다.",
    maxDays: 90,
  },
  {
    name: "아토르바스타틴",
    aliases: ["atorvastatin", "리피토", "lipitor"],
    category: "만성질환약",
    eligible: true,
    note: "90일치 이내 개인 사용 배송 가능합니다.",
    maxDays: 90,
  },
  {
    name: "암로디핀",
    aliases: ["amlodipine", "노바스크", "norvasc"],
    category: "만성질환약",
    eligible: true,
    note: "90일치 이내 개인 사용 배송 가능합니다.",
    maxDays: 90,
  },
  {
    name: "로사르탄",
    aliases: ["losartan", "코자", "cozaar"],
    category: "만성질환약",
    eligible: true,
    note: "90일치 이내 개인 사용 배송 가능합니다.",
    maxDays: 90,
  },
  {
    name: "레보티록신",
    aliases: ["levothyroxine", "씬지로이드", "synthroid"],
    category: "만성질환약",
    eligible: true,
    note: "90일치 이내 개인 사용 배송 가능합니다.",
    maxDays: 90,
  },
  {
    name: "오메프라졸",
    aliases: ["omeprazole", "프릴로섹", "prilosec"],
    category: "만성질환약",
    eligible: true,
    note: "90일치 이내 개인 사용 배송 가능합니다.",
    maxDays: 90,
  },

  // ❌ 배송 불가
  {
    name: "마약성 진통제",
    aliases: ["opioid", "오피오이드", "옥시코돈", "oxycodone", "모르핀", "morphine", "펜타닐", "fentanyl"],
    category: "마약류",
    eligible: false,
    note: "마약류 의약품은 미국 세관 통관이 불가능합니다.",
    maxDays: 0,
  },
  {
    name: "항생제",
    aliases: ["antibiotic", "아목시실린", "amoxicillin", "페니실린", "penicillin", "시프로플록사신", "ciprofloxacin"],
    category: "항생제",
    eligible: false,
    note: "항생제류는 미국 내 직접 처방을 권장합니다.",
    maxDays: 0,
  },
  {
    name: "수면제",
    aliases: ["sleeping pill", "졸피뎀", "zolpidem", "ambien", "벤조디아제핀", "benzodiazepine"],
    category: "향정신성 의약품",
    eligible: false,
    note: "향정신성 의약품은 미국 세관 반입이 엄격히 제한됩니다.",
    maxDays: 0,
  },
];

export function checkDrugEligibility(query: string): {
  found: boolean;
  drug?: DrugInfo;
} {
  const normalized = query.trim().toLowerCase();
  for (const drug of DRUG_LIST) {
    if (
      drug.name.toLowerCase().includes(normalized) ||
      normalized.includes(drug.name.toLowerCase()) ||
      drug.aliases.some(
        (a) =>
          a.toLowerCase().includes(normalized) ||
          normalized.includes(a.toLowerCase())
      )
    ) {
      return { found: true, drug };
    }
  }
  return { found: false };
}

export const ELIGIBLE_DRUGS = DRUG_LIST.filter((d) => d.eligible);
