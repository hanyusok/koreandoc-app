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

const GUIDE_LINKS = [
  { icon: ShieldCheck, title: "FDA 90일 규정 안내", sub: "Read Guide", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  { icon: FileText, title: "필수 동봉 서류 확인", sub: "View Documents", color: "#4f8ef7", bg: "rgba(79,142,247,0.1)" },
  { icon: Mail, title: "이메일 문의", sub: "support@koreandoc.com", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", padding: "56px 20px 96px" }}>

      {/* ── Header ── */}
      <header style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>안내 및 고객지원</h1>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          궁금하신 내용을 확인하거나 상담사에게 문의하세요.
        </p>
      </header>

      {/* ── Guide Links ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
        {GUIDE_LINKS.map((item, idx) => (
          <div key={idx} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "rgba(22,22,36,0.75)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px", padding: "14px 16px",
            cursor: "pointer", transition: "transform 0.15s ease",
          }}
            onTouchStart={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: item.bg, display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <item.icon size={20} color={item.color} />
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 600 }}>{item.title}</p>
                <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>{item.sub}</p>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
          </div>
        ))}
      </div>

      {/* ── FAQ ── */}
      <section style={{ marginBottom: "32px" }}>
        <p style={{
          fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.1em", color: "var(--text-secondary)",
          display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px",
        }}>
          <HelpCircle size={12} /> Frequent Questions
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} style={{
              background: "rgba(22,22,36,0.75)",
              border: openFaq === i ? "1px solid rgba(79,142,247,0.25)" : "1px solid rgba(255,255,255,0.07)",
              borderRadius: "14px", overflow: "hidden",
              transition: "border-color 0.2s ease",
            }}>
              <button
                style={{
                  width: "100%", padding: "16px", textAlign: "left",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "none", border: "none", cursor: "pointer",
                  gap: "12px",
                }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.4 }}>
                  {item.q}
                </span>
                <ChevronRight
                  size={16}
                  style={{
                    color: "#4f8ef7", flexShrink: 0,
                    transform: openFaq === i ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>
              {openFaq === i && (
                <div className="animate-fade-in-up" style={{ padding: "0 16px 16px" }}>
                  <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "14px" }} />
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <div style={{
        background: "rgba(22,22,36,0.75)",
        border: "1px solid rgba(79,142,247,0.2)",
        borderRadius: "20px", padding: "28px 20px",
        textAlign: "center",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
      }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "16px",
          background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
          boxShadow: "0 6px 20px rgba(79,142,247,0.35)",
        }}>
          <MessageCircle size={28} color="white" />
        </div>
        <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px" }}>실시간 상담이 필요하신가요?</h3>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "22px" }}>
          카카오톡 채널을 통해 연중무휴 24시간<br />전문 상담원에게 직접 문의하실 수 있습니다.
        </p>
        <a
          href="https://open.kakao.com"
          target="_blank"
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px",
            background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
            color: "white", textDecoration: "none",
            borderRadius: "12px", padding: "13px 28px",
            fontSize: "15px", fontWeight: 700,
            boxShadow: "0 4px 16px rgba(79,142,247,0.3)",
          }}
        >
          카톡 상담하기 <ExternalLink size={14} />
        </a>
      </div>

      <p style={{ textAlign: "center", fontSize: "10px", color: "rgba(136,136,168,0.4)", marginTop: "28px", lineHeight: 1.8 }}>
        © 2026 KoreanDoc Pharmacy Services.<br />
        Operating under FDA Personal Importation Guidelines.
      </p>
    </div>
  );
}
