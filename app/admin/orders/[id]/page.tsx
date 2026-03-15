"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Order = {
  id: string;
  orderNo: string;
  patientName: string;
  kakaoId: string | null;
  usAddress: string;
  drugName: string;
  drugCategory: string | null;
  pillDays: number;
  isApproved: boolean;
  trackingNo: string | null;
  paymentMethod: string | null;
  paymentStatus: string;
  prescriptionImg: string;
  status: string;
  notes: string | null;
  createdAt: string;
};

const STATUS_OPTIONS = [
  { value: "RECEIVED", label: "접수됨" },
  { value: "VERIFIED", label: "검수완료" },
  { value: "PREPARED", label: "조제완료" },
  { value: "SHIPPED", label: "배송중" },
  { value: "DELIVERED", label: "수령완료" },
];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [trackingNo, setTrackingNo] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [saved, setSaved] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        setTrackingNo(data.trackingNo ?? "");
        setNotes(data.notes ?? "");
        setStatus(data.status);
        setIsApproved(data.isApproved);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, trackingNo, notes, isApproved }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  };

  const downloadPdf = (type: "invoice" | "note") => {
    if (!id) return;
    window.open(`/api/orders/${id}/pdf?type=${type}`, "_blank");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", color: "#a0a0b8" }}>
        불러오는 중...
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", color: "#a0a0b8" }}>
        주문을 찾을 수 없습니다.
      </div>
    );
  }

  const is90DayWarn = order.pillDays > 85;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", padding: 24 }}>
      {/* Nav */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 32, paddingBottom: 20,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Link href="/admin" style={{ color: "#a0a0b8", textDecoration: "none", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
          ← 목록으로
        </Link>
        <h1 style={{ fontSize: 16, fontWeight: 600 }}>주문 상세: {order.orderNo}</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn-primary"
            style={{ padding: "10px 20px", fontSize: 14 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "저장 중..." : saved ? "✓ 저장됨" : "변경사항 저장"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* 90-day warning */}
          {is90DayWarn && (
            <div
              style={{
                padding: "14px 20px", borderRadius: 12,
                background: "rgba(251,191,36,0.08)",
                border: "1px solid rgba(251,191,36,0.3)",
                display: "flex", alignItems: "center", gap: 12,
              }}
            >
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div>
                <p style={{ fontWeight: 600, color: "#fbbf24", fontSize: 14 }}>90-Day Rule 주의</p>
                <p style={{ fontSize: 13, color: "#a0a0b8" }}>
                  복용일수가 {order.pillDays}일로 90일 한도에 근접합니다. 조제 전 재확인하세요.
                </p>
              </div>
            </div>
          )}

          {/* Patient Info */}
          <div className="glass-card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: "#a0a0b8", letterSpacing: "0.06em" }}>
              👤 환자 정보
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 14 }}>
              {[
                { label: "성함", value: order.patientName },
                { label: "카카오톡 ID", value: order.kakaoId ?? "미입력" },
                { label: "약품명", value: order.drugName },
                { label: "약품 분류", value: order.drugCategory ?? "—" },
                { label: "복용 일수", value: `${order.pillDays}일` },
                { label: "결제 방식", value: order.paymentMethod === "stripe" ? "카드 결제" : "무통장 입금" },
                { label: "결제 상태", value: order.paymentStatus },
                { label: "접수일", value: new Date(order.createdAt).toLocaleString("ko-KR") },
              ].map((row) => (
                <div key={row.label}>
                  <p style={{ color: "#606080", fontSize: 12, marginBottom: 4 }}>{row.label}</p>
                  <p style={{ fontWeight: 500 }}>{row.value}</p>
                </div>
              ))}
              <div style={{ gridColumn: "1 / -1" }}>
                <p style={{ color: "#606080", fontSize: 12, marginBottom: 4 }}>미국 배송 주소</p>
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 8, padding: "10px 14px",
                  }}
                >
                  <p style={{ flex: 1, fontSize: 13 }}>{order.usAddress}</p>
                  <button
                    style={{
                      background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 6, padding: "4px 10px", color: "#a0a0b8",
                      cursor: "pointer", fontSize: 12, flexShrink: 0,
                    }}
                    onClick={() => navigator.clipboard.writeText(order.usAddress)}
                  >
                    복사
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status Control */}
          <div className="glass-card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: "#a0a0b8", letterSpacing: "0.06em" }}>
              🔄 상태 관리
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="form-label">배송 상태</label>
                <select
                  className="form-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ cursor: "pointer" }}
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} style={{ background: "#1a1a28" }}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">EMS/DHL 운송장 번호</label>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="EK000000000KR"
                    value={trackingNo}
                    onChange={(e) => setTrackingNo(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  {trackingNo && (
                    <a
                      href={`https://service.epost.go.kr/trace.RetrieveEmsRigiTraceList.comm?POST_CODE=${trackingNo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ fontSize: 13, padding: "10px 14px", whiteSpace: "nowrap" }}
                    >
                      추적 →
                    </a>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={isApproved}
                    onChange={(e) => setIsApproved(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: "#4f8ef7", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: 14 }}>운영자 검수 완료 (약국 전달 승인)</span>
                </label>
              </div>
              <div>
                <label className="form-label">운영자 메모</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="내부 메모 (고객에게 노출되지 않음)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>
          </div>

          {/* PDF Documents */}
          <div className="glass-card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: "#a0a0b8", letterSpacing: "0.06em" }}>
              📄 서류 출력
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  type: "invoice" as const,
                  icon: "🧾",
                  title: "Commercial Invoice",
                  desc: '"Personal Use Only, Not for Resale" 명시 송장',
                },
                {
                  type: "note" as const,
                  icon: "📋",
                  title: "English Physician\'s Note",
                  desc: "영문 소견서 / 처방 필요성 설명서",
                },
              ].map((doc) => (
                <button
                  key={doc.type}
                  onClick={() => downloadPdf(doc.type)}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10, padding: "14px 18px",
                    display: "flex", alignItems: "center", gap: 14,
                    cursor: "pointer", transition: "all 0.2s", textAlign: "left",
                    color: "#f0f0f5",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(79,142,247,0.3)";
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(79,142,247,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{doc.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, marginBottom: 2, fontSize: 14 }}>{doc.title}</p>
                    <p style={{ fontSize: 12, color: "#a0a0b8" }}>{doc.desc}</p>
                  </div>
                  <span style={{ color: "#4f8ef7", fontSize: 13 }}>↓ PDF</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Prescription Image */}
        <div style={{ position: "sticky", top: 24, height: "fit-content" }}>
          <div className="glass-card" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: "#a0a0b8", letterSpacing: "0.06em" }}>
              📷 처방전 사진
            </h2>
            {order.prescriptionImg ? (
              <div>
                <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: 12, position: "relative", minHeight: 300 }}>
                  <Image
                    src={order.prescriptionImg}
                    alt="처방전"
                    width={400}
                    height={500}
                    style={{ width: "100%", height: "auto", display: "block", borderRadius: 10 }}
                    unoptimized
                  />
                </div>
                <a
                  href={order.prescriptionImg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ width: "100%", justifyContent: "center", fontSize: 13 }}
                >
                  원본 크게 보기 →
                </a>
              </div>
            ) : (
              <div
                style={{
                  padding: 40, textAlign: "center",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 10, color: "#606080",
                }}
              >
                <p style={{ fontSize: 32 }}>📄</p>
                <p style={{ marginTop: 12, fontSize: 14 }}>처방전 이미지 없음</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
