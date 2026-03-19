"use client";

import { useState } from "react";
import Link from "next/link";
import { Pill, ShieldCheck, Truck, ArrowRight, Search, Activity, Heart, Sparkles, Stethoscope, ClipboardList } from "lucide-react";

export default function Home() {
  const [drugQuery, setDrugQuery] = useState("");
  const [checkResult, setCheckResult] = useState<{
    found: boolean;
    eligible?: boolean;
    drugName?: string;
    category?: string;
    note?: string;
  } | null>(null);
  const [checking, setChecking] = useState(false);

  const handleDrugCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugQuery.trim()) return;
    setChecking(true);
    try {
      const res = await fetch(`/api/check-drug?name=${encodeURIComponent(drugQuery)}`);
      const data = await res.json();
      setCheckResult(data);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div style={{ padding: "56px 20px 96px", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.3px", lineHeight: 1.3 }}>
            한국의사 👋
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "3px" }}>
            미국 거주 한인 비대면 처방 및 안심 배송
          </p>
        </div>
        <div style={{
          width: "44px", height: "44px", borderRadius: "14px",
          background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 14px rgba(79,142,247,0.35)",
          flexShrink: 0,
        }}>
          <Heart size={20} fill="white" color="white" />
        </div>
      </header>

      {/* ── Hero Card ── */}
      <div style={{
        background: "rgba(22,22,38,0.8)",
        border: "1px solid rgba(79,142,247,0.2)",
        borderRadius: "20px",
        padding: "22px 20px",
        marginBottom: "16px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}>
        <div style={{
          position: "absolute", top: "-24px", right: "-24px",
          width: "120px", height: "120px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,142,247,0.3), transparent 70%)",
          pointerEvents: "none",
        }} />
        <Sparkles size={28} style={{ position: "absolute", top: "16px", right: "16px", color: "#4f8ef7", opacity: 0.2 }} />

        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent-blue)", marginBottom: "8px", textTransform: "uppercase" }}>
          KoreanDoc
        </p>
        <h2 style={{ fontSize: "18px", fontWeight: 700, lineHeight: 1.35, marginBottom: "8px" }}>
          오늘도 건강한 하루 보내세요
        </h2>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "20px" }}>
          비대면 진료 및 처방전 검토부터 통관 서류 준비까지<br />완벽하게 원스탑으로 대행해 드립니다.
        </p>
        <Link href="/order" style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
          color: "white", textDecoration: "none",
          borderRadius: "10px", padding: "11px 22px",
          fontSize: "14px", fontWeight: 700,
          boxShadow: "0 4px 14px rgba(79,142,247,0.3)",
        }}>
          신청하기 <ArrowRight size={14} />
        </Link>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px" }}>
        {[
          { icon: <ShieldCheck size={18} />, bg: "rgba(34,197,94,0.1)", color: "#22c55e", border: "rgba(34,197,94,0.18)", label: "통관 통과율", value: "95.4%" },
          { icon: <Truck size={18} />, bg: "rgba(79,142,247,0.1)", color: "#4f8ef7", border: "rgba(79,142,247,0.18)", label: "평균 배송일", value: "8.2일" },
        ].map((s, i) => (
          <div key={i} style={{
            background: "rgba(22,22,36,0.7)", border: `1px solid ${s.border}`,
            borderRadius: "14px", padding: "14px 14px",
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: s.bg, color: s.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)" }}>
                {s.label}
              </p>
              <p style={{ fontSize: "18px", fontWeight: 700, lineHeight: 1.2 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Service Flow ── */}
      <section style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
          <Activity size={12} /> How It Works
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { step: "01", title: "상담 신청", desc: "원하시는 약품이나 증상을 입력하고 진료를 신청합니다.", icon: <ClipboardList size={20} />, bg: "rgba(255,255,255,0.05)", color: "var(--text-primary)" },
            { step: "02", title: "비대면 진료", desc: "한국 의사 선생님과 Google Meet을 통해 꼼꼼한 화상 진료를 진행합니다.", icon: <Stethoscope size={20} />, bg: "rgba(79,142,247,0.1)", color: "#4f8ef7" },
            { step: "03", title: "비대면 복약지도", desc: "한국 약사 선생님이 안전하고 올바른 약 복용법을 상세히 안내해 드립니다.", icon: <Pill size={20} />, bg: "rgba(139,92,246,0.1)", color: "#8b5cf6" },
            { step: "04", title: "미국 자택 배송", desc: "필요한 통관 서류를 완비하여 미국 자택까지 빠르고 안전하게 배송됩니다.", icon: <Truck size={20} />, bg: "rgba(34,197,94,0.1)", color: "#22c55e" },
          ].map((item, idx) => (
            <div key={idx} style={{
              display: "flex", alignItems: "flex-start", gap: "16px",
              padding: "16px", background: "rgba(22,22,36,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px",
              position: "relative", overflow: "hidden"
            }}>
              <div style={{
                position: "absolute", right: "-10px", top: "-10px",
                fontSize: "60px", fontWeight: 800, color: "rgba(255,255,255,0.03)", pointerEvents: "none"
              }}>
                {item.step}
              </div>
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: item.bg, color: item.color,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>{item.title}</p>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Drug Checker ── */}
      <section style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
          <Activity size={12} /> Drug Checker
        </p>
        <div style={{
          background: "rgba(22,22,36,0.7)", border: "1px solid var(--border)",
          borderRadius: "16px", padding: "18px 16px",
        }}>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "14px" }}>
            내 약이 미국으로 배송 가능한 성분인지 확인하세요.
          </p>
          <form onSubmit={handleDrugCheck} style={{ display: "flex", gap: "10px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                className="form-input"
                style={{ paddingLeft: "38px", paddingTop: "12px", paddingBottom: "12px", fontSize: "14px" }}
                type="text"
                placeholder="약 이름 입력..."
                value={drugQuery}
                onChange={(e) => { setDrugQuery(e.target.value); setCheckResult(null); }}
              />
              <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
            </div>
            <button type="submit" disabled={checking} style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
              border: "none", borderRadius: "10px", padding: "12px 16px",
              cursor: "pointer", flexShrink: 0,
              boxShadow: "0 4px 12px rgba(79,142,247,0.3)",
            }}>
              <ArrowRight size={16} color="white" />
            </button>
          </form>

          {checkResult && (
            <div className="animate-fade-in-up" style={{
              marginTop: "14px", padding: "14px", borderRadius: "12px",
              background: checkResult.eligible ? "rgba(34,197,94,0.08)" : "rgba(244,63,94,0.08)",
              border: `1px solid ${checkResult.eligible ? "rgba(34,197,94,0.2)" : "rgba(244,63,94,0.2)"}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <span style={{ fontSize: "18px" }}>{checkResult.eligible ? "✅" : "❌"}</span>
                <p style={{ fontSize: "13px", fontWeight: 700 }}>
                  {checkResult.eligible ? "배송 가능 품목" : "배송 제한 품목"}
                </p>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{checkResult.note}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Top Categories ── */}
      <section>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
          <Pill size={12} /> Top Categories
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            { name: "탈모약 전문", sub: "Finasteride 등", accent: "#4f8ef7", bg: "rgba(79,142,247,0.1)", border: "rgba(79,142,247,0.18)" },
            { name: "피부과 연고", sub: "Retin-A, 스티바A", accent: "#8b5cf6", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.18)" },
            { name: "고혈압/당뇨", sub: "만성질환약", accent: "#14b8a6", bg: "rgba(20,184,166,0.1)", border: "rgba(20,184,166,0.18)" },
            { name: "만성 비염", sub: "코세척, 스프레이", accent: "#f43f5e", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.18)" },
          ].map((cat, i) => (
            <div key={i} style={{
              background: cat.bg, border: `1px solid ${cat.border}`,
              borderRadius: "16px", padding: "16px",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              height: "108px",
            }}>
              <div style={{ width: "24px", height: "3px", borderRadius: "2px", background: cat.accent }} />
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, marginBottom: "2px" }}>{cat.name}</p>
                <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "6px" }}>{cat.sub}</p>
                <p style={{ fontSize: "10px", fontWeight: 700, color: cat.accent, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center" }}>
                  Explore <ArrowRight size={9} style={{ marginLeft: "3px" }} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
