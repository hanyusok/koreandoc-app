"use client";

import { useState } from "react";
import { HelpCircle, ChevronRight, MessageCircle, FileText, ShieldCheck, Mail, ExternalLink } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "미국 배송은 정말 안전한가요?",
    a: "네, KoreanDoc은 FDA의 개인 수입 규정(90일 분량)을 엄격히 준수하며, 모든 배송물에 영문 소견서와 처방전을 동봉하여 통관 통과율 95% 이상을 유지하고 있습니다.",
  },
  {
    q: "처방전이 없으면 어떻게 하나요?",
    a: "한국 내 제휴 클리닉을 통해 비대면 상담 후 미국 배송용 처방전 발급을 도와드리고 있습니다. 카카오톡으로 문의해 주시면 상세 절차를 안내드립니다.",
  },
  {
    q: "배송비와 수수료는 얼마인가요?",
    a: "우체국 EMS 프리미엄(UPS 연계)을 사용하며, 배송비는 무게에 따라 약 2.5~4만원 선입니다. 여기에 시스템 이용 수수료 1.5만원이 추가됩니다.",
  },
  {
    q: "배송 추적은 어디서 하나요?",
    a: "하단 [조회] 탭에서 주문번호를 입력하시면 실시간 진행 상태를 확인하실 수 있습니다. 비행기 출발 후에는 EMS 송장번호로도 추적 가능합니다.",
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen pb-24">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">안내 및 고객지원</h1>
        <p className="text-gray-400 text-sm">궁금하신 내용을 확인하거나 상담사에게 문의하세요.</p>
      </header>

      {/* Guide Links */}
      <div className="space-y-3 mb-10">
        {[
          { icon: ShieldCheck, title: "FDA 90일 규정 안내", label: "Read Guide" },
          { icon: FileText, title: "필수 동봉 서류 확인", label: "View Documents" },
          { icon: Mail, title: "이메일 문의", label: "support@koreandoc.com" },
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-4 flex items-center justify-between cursor-pointer active:scale-95 transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-[10px] text-gray-500">{item.label}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-600" />
          </div>
        ))}
      </div>

      {/* FAQ Accordion */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
          <HelpCircle size={14} /> Frequent Questions
        </h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <button
                className="w-full p-4 text-left flex justify-between items-center bg-transparent border-none"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="text-sm font-medium pr-4">{item.q}</span>
                <ChevronRight 
                  size={16} 
                  className={`text-blue-500 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} 
                />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-gray-400 leading-relaxed animate-fade-in-up">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <div className="glass-card p-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/20 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-600/20">
          <MessageCircle size={32} className="text-white" />
        </div>
        <h3 className="text-lg font-bold mb-2">실시간 상담이 필요하신가요?</h3>
        <p className="text-xs text-gray-400 mb-6 px-4">
          카카오톡 채널을 통해 연중무휴 24시간 전문 상담원에게 직접 문의하실 수 있습니다.
        </p>
        <a 
          href="https://open.kakao.com" 
          target="_blank"
          className="btn-primary w-full py-4 justify-center"
        >
          카톡 상담하기 <ExternalLink size={14} className="ml-1" />
        </a>
      </div>

      <p className="text-center text-[10px] text-gray-600 mt-12 pb-6">
        © 2026 KoreanDoc Pharmacy Services. <br />
        Operating under FDA Personal Importation Guidelines.
      </p>
    </div>
  );
}
