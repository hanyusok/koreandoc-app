"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Clipboard, CreditCard, CheckCircle2, ArrowLeft, ArrowRight, Camera, X, Sparkles } from "lucide-react";
import Image from "next/image";

type DrugCheckResult = {
  found: boolean;
  eligible?: boolean;
  drugName?: string;
  category?: string;
  note?: string;
  maxDays?: number;
};

/* ── Shared style tokens ── */
const card = {
  background: "rgba(22,22,36,0.75)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "18px 16px",
} as const;

const labelStyle = {
  fontSize: "10px", fontWeight: 700, textTransform: "uppercase" as const,
  letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "8px", display: "block",
};

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  padding: "13px 14px",
  color: "var(--text-primary)",
  fontSize: "15px",
  outline: "none",
};

const btnPrimary = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px",
  background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
  color: "white", textDecoration: "none", border: "none",
  borderRadius: "12px", padding: "14px 20px",
  fontSize: "15px", fontWeight: 700, cursor: "pointer",
  width: "100%", boxShadow: "0 4px 16px rgba(79,142,247,0.3)",
};

export default function OrderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [drugQuery, setDrugQuery] = useState("");
  const [drugResult, setDrugResult] = useState<DrugCheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    patientName: "",
    kakaoId: "",
    usAddress: "",
    pillDays: "",
    paymentMethod: "bank",
  });
  const [rxFile, setRxFile] = useState<File | null>(null);
  const [rxPreview, setRxPreview] = useState<string | null>(null);

  const handleDrugCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugQuery.trim()) return;
    setChecking(true);
    setDrugResult(null);
    try {
      const res = await fetch(`/api/check-drug?name=${encodeURIComponent(drugQuery)}`);
      const data = await res.json();
      setDrugResult(data);
    } finally {
      setChecking(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRxFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setRxPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!rxFile) { setError("처방전 사진을 업로드해 주세요."); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("patientName", form.patientName);
      fd.append("kakaoId", form.kakaoId);
      fd.append("usAddress", form.usAddress);
      fd.append("pillDays", form.pillDays);
      fd.append("drugName", drugResult?.drugName ?? drugQuery);
      fd.append("paymentMethod", form.paymentMethod);
      fd.append("prescriptionImg", rxFile);
      const res = await fetch("/api/orders", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "오류가 발생했습니다."); return; }
      router.push(`/order/complete?orderNo=${data.order.orderNo}`);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "56px 20px 96px" }}>

      {/* ── Stepper ── */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "32px" }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: s < 3 ? 1 : "none" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 700, flexShrink: 0,
              background: step >= s ? "#3b6fd4" : "rgba(255,255,255,0.06)",
              color: step >= s ? "white" : "var(--text-secondary)",
              boxShadow: step >= s ? "0 2px 10px rgba(59,111,212,0.35)" : "none",
              transition: "all 0.3s ease",
            }}>
              {step > s ? <CheckCircle2 size={16} /> : s}
            </div>
            {s < 3 && (
              <div style={{
                flex: 1, height: "2px", margin: "0 8px",
                background: step > s ? "#3b6fd4" : "rgba(255,255,255,0.07)",
                borderRadius: "2px", transition: "background 0.3s ease",
              }} />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 1: Drug Check ── */}
      {step === 1 && (
        <div className="animate-fade-in-up">
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>무슨 약인가요?</h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "28px" }}>
            배송 가능 성분인지 먼저 확인해 드립니다.
          </p>

          <form onSubmit={handleDrugCheck} style={{ position: "relative", marginBottom: "24px" }}>
            <input
              style={{ ...inputStyle, paddingRight: "52px", paddingTop: "14px", paddingBottom: "14px" }}
              placeholder="예: 피나스테리드, 스티바A"
              value={drugQuery}
              onChange={(e) => { setDrugQuery(e.target.value); setDrugResult(null); }}
            />
            <button type="submit" disabled={checking} style={{
              position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
              background: "#3b6fd4", border: "none", borderRadius: "8px",
              padding: "8px 10px", cursor: "pointer", display: "flex",
            }}>
              <Search size={18} color="white" />
            </button>
          </form>

          {drugResult?.eligible && (
            <div className="animate-fade-in-up" style={{
              ...card, background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", marginBottom: "0",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <CheckCircle2 size={20} color="#22c55e" />
                <p style={{ fontWeight: 700, fontSize: "14px" }}>배송 가능한 약품입니다</p>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "18px" }}>
                {drugResult.note}
              </p>
              <button onClick={() => setStep(2)} style={btnPrimary}>
                계속해서 신청하기 <ArrowRight size={15} />
              </button>
            </div>
          )}

          {drugResult && !drugResult.eligible && (
            <div className="animate-fade-in-up" style={{
              ...card, background: "rgba(244,63,94,0.07)", border: "1px solid rgba(244,63,94,0.2)",
            }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#f87171", marginBottom: "6px" }}>배송이 불가능한 품목입니다</p>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.65 }}>{drugResult.note}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Step 2: Patient Info ── */}
      {step === 2 && (
        <div className="animate-fade-in-up">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <button onClick={() => setStep(1)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex" }}>
              <ArrowLeft size={20} />
            </button>
            <h1 style={{ fontSize: "22px", fontWeight: 700 }}>정보 입력</h1>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "28px" }}>
            배송지 정보를 기입하고 처방전을 올려주세요.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={labelStyle}>환자 성함</label>
              <input style={inputStyle} placeholder="홍길동 / HONG GILDONG"
                value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} />
            </div>

            <div>
              <label style={labelStyle}>미국 배송 주소 (영문)</label>
              <textarea style={{ ...inputStyle, minHeight: "90px", resize: "none" as const, fontFamily: "inherit" }}
                placeholder="Full address in USA"
                value={form.usAddress} onChange={(e) => setForm({ ...form, usAddress: e.target.value })} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>복용 일수</label>
                <input type="number" style={inputStyle} placeholder="Max 90"
                  value={form.pillDays} onChange={(e) => setForm({ ...form, pillDays: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>카톡 ID</label>
                <input style={inputStyle} placeholder="선택 사항"
                  value={form.kakaoId} onChange={(e) => setForm({ ...form, kakaoId: e.target.value })} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>처방전 업로드</label>
              {rxPreview ? (
                <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", aspectRatio: "16/9", background: "#111" }}>
                  <Image src={rxPreview} alt="rx" fill style={{ objectFit: "cover" }} />
                  <button onClick={() => { setRxFile(null); setRxPreview(null); }} style={{
                    position: "absolute", top: "8px", right: "8px",
                    width: "30px", height: "30px", borderRadius: "50%",
                    background: "rgba(0,0,0,0.65)", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  }}>
                    <X size={14} color="white" />
                  </button>
                </div>
              ) : (
                <button onClick={() => document.getElementById("cameraInput")?.click()} style={{
                  width: "100%", aspectRatio: "16/9", borderRadius: "14px",
                  border: "2px dashed rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: "10px", cursor: "pointer", color: "var(--text-secondary)",
                }}>
                  <Camera size={36} />
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>사진 촬영 또는 파일 선택</span>
                </button>
              )}
              <input id="cameraInput" type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
            </div>

            <button style={btnPrimary} onClick={() => {
              if (form.patientName && form.usAddress && form.pillDays && rxFile) setStep(3);
              else setError("필수 항목을 모두 입력해 주세요.");
            }}>
              마지막 단계로 <ArrowRight size={15} />
            </button>
            {error && <p style={{ textAlign: "center", fontSize: "12px", color: "#f87171" }}>{error}</p>}
          </div>
        </div>
      )}

      {/* ── Step 3: Payment ── */}
      {step === 3 && (
        <div className="animate-fade-in-up">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <button onClick={() => setStep(2)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex" }}>
              <ArrowLeft size={20} />
            </button>
            <h1 style={{ fontSize: "22px", fontWeight: 700 }}>결제 방식</h1>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "28px" }}>
            배송 및 서류 수수료 결제 방법을 골라주세요.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
            {[
              { key: "bank", icon: <CreditCard size={22} color="#4f8ef7" />, title: "무통장 입금", sub: "Korean Bank Transfer" },
              { key: "stripe", icon: <Sparkles size={22} color="#8b5cf6" />, title: "해외 카드 결제", sub: "Debit / Credit Card" },
            ].map((opt) => (
              <button key={opt.key} onClick={() => setForm({ ...form, paymentMethod: opt.key })} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px", borderRadius: "14px", textAlign: "left", cursor: "pointer",
                background: form.paymentMethod === opt.key ? "rgba(79,142,247,0.08)" : "rgba(255,255,255,0.03)",
                border: form.paymentMethod === opt.key ? "2px solid rgba(79,142,247,0.45)" : "2px solid rgba(255,255,255,0.06)",
                transition: "all 0.2s ease",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px",
                    background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {opt.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 700 }}>{opt.title}</p>
                    <p style={{ fontSize: "10px", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{opt.sub}</p>
                  </div>
                </div>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  border: form.paymentMethod === opt.key ? "2px solid #4f8ef7" : "2px solid rgba(255,255,255,0.12)",
                  background: form.paymentMethod === opt.key ? "#4f8ef7" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {form.paymentMethod === opt.key && <CheckCircle2 size={13} color="white" />}
                </div>
              </button>
            ))}
          </div>

          {/* Summary */}
          <div style={{ ...card, marginBottom: "20px" }}>
            <p style={{ ...labelStyle, marginBottom: "14px" }}>Summary</p>
            {[
              { label: "환자명", value: form.patientName },
              { label: "약명", value: drugResult?.drugName ?? drugQuery },
              { label: "상태", value: "견적 대기", highlight: true },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{row.label}</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: row.highlight ? "#4f8ef7" : "var(--text-primary)" }}>{row.value}</span>
              </div>
            ))}
          </div>

          <button onClick={handleSubmit} disabled={submitting} style={btnPrimary}>
            {submitting ? "접수 처리 중..." : "신청 완료하기"}
          </button>
        </div>
      )}
    </div>
  );
}
