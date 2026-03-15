"use client";

import { useState } from "react";
import { Search, Package, Send, Home as HomeIcon, Clock, CheckCircle2 } from "lucide-react";

type Order = {
  id: string;
  orderNo: string;
  patientName: string;
  drugName: string;
  status: string;
  trackingNo: string | null;
  createdAt: string;
};

const STATUS_STEPS = [
  { key: "RECEIVED", label: "접수됨", icon: Clock },
  { key: "VERIFIED", label: "검수완료", icon: CheckCircle2 },
  { key: "PREPARED", label: "조제완료", icon: Package },
  { key: "SHIPPED", label: "배송중", icon: Send },
  { key: "DELIVERED", label: "수령완료", icon: HomeIcon },
];

const card = {
  background: "rgba(22,22,36,0.75)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "18px 16px",
} as const;

export default function TrackPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch("/api/orders");
      const orders: Order[] = await res.json();
      const found = orders.find(
        (o) => o.orderNo.toLowerCase() === query.trim().toLowerCase() ||
          o.patientName === query.trim()
      );
      if (found) setOrder(found);
      else setError("일치하는 주문 정보를 찾을 수 없습니다. 주문번호를 다시 확인해 주세요.");
    } catch {
      setError("조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const currentIdx = order ? STATUS_STEPS.findIndex((s) => s.key === order.status) : -1;

  return (
    <div style={{ minHeight: "100vh", padding: "56px 20px 96px" }}>

      {/* ── Header ── */}
      <header style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>주문 조회</h1>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          주문번호 또는 예약자 성함을 입력하세요.
        </p>
      </header>

      {/* ── Search ── */}
      <form onSubmit={handleSearch} style={{ position: "relative", marginBottom: "24px" }}>
        <input
          type="text"
          style={{
            width: "100%", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px",
            padding: "14px 52px 14px 44px", color: "var(--text-primary)",
            fontSize: "14px", outline: "none",
          }}
          placeholder="주문번호 (예: US-2026...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search size={17} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
        <button type="submit" disabled={loading} style={{
          position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
          background: "#3b6fd4", border: "none", borderRadius: "8px",
          padding: "8px 10px", cursor: "pointer", display: "flex",
        }}>
          {loading ? <span style={{ color: "white", fontSize: "12px" }}>...</span> : <Search size={16} color="white" />}
        </button>
      </form>

      {/* ── Error ── */}
      {error && (
        <div style={{ ...card, background: "rgba(244,63,94,0.07)", border: "1px solid rgba(244,63,94,0.2)", marginBottom: "20px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "#f87171" }}>{error}</p>
        </div>
      )}

      {/* ── Order Result ── */}
      {order && (
        <div className="animate-fade-in-up">
          {/* Summary Card */}
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "4px" }}>Order No.</p>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#4f8ef7" }}>{order.orderNo}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "4px" }}>약품</p>
                <p style={{ fontSize: "13px", fontWeight: 600 }}>{order.drugName}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {[
                { label: "성함", value: order.patientName },
                { label: "접수일", value: new Date(order.createdAt).toLocaleDateString("ko-KR") },
              ].map((item) => (
                <div key={item.label} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "10px", padding: "10px 12px",
                }}>
                  <p style={{ fontSize: "10px", color: "var(--text-secondary)", marginBottom: "4px" }}>{item.label}</p>
                  <p style={{ fontSize: "13px", fontWeight: 600 }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Card */}
          <div style={{ ...card, marginBottom: "20px" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", marginBottom: "20px" }}>
              Delivery Timeline
            </p>

            <div style={{ position: "relative" }}>
              {/* Vertical line */}
              <div style={{ position: "absolute", left: "15px", top: "8px", bottom: "8px", width: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {STATUS_STEPS.map((s, idx) => {
                  const done = idx <= currentIdx;
                  const active = idx === currentIdx;
                  const Icon = s.icon;
                  return (
                    <div key={s.key} style={{ display: "flex", alignItems: "flex-start", gap: "16px", opacity: done ? 1 : 0.3, transition: "opacity 0.4s" }}>
                      <div style={{
                        position: "relative", zIndex: 1,
                        width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: done ? "#3b6fd4" : "rgba(255,255,255,0.06)",
                        boxShadow: done ? "0 0 14px rgba(59,111,212,0.4)" : "none",
                        transition: "all 0.3s",
                      }}>
                        <Icon size={15} color={done ? "white" : "var(--text-secondary)"} />
                      </div>
                      <div style={{ paddingTop: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: active ? "#4f8ef7" : "var(--text-primary)" }}>{s.label}</p>
                          {active && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4f8ef7", animation: "pulse 1.5s infinite" }} />}
                        </div>
                        <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          {done ? (idx === 3 && order.trackingNo ? `송장번호: ${order.trackingNo}` : "완료되었습니다.") : "대기 중입니다."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {order.trackingNo && order.status === "SHIPPED" && (
            <a
              href={`https://service.epost.go.kr/trace.RetrieveEmsRigiTraceList.comm?POST_CODE=${order.trackingNo}`}
              target="_blank"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
                color: "white", textDecoration: "none",
                borderRadius: "12px", padding: "14px 20px",
                fontSize: "15px", fontWeight: 700,
                boxShadow: "0 4px 16px rgba(79,142,247,0.3)",
              }}
            >
              EMS 실시간 위치 확인
            </a>
          )}
        </div>
      )}

      {/* ── Empty state ── */}
      {!order && !loading && !error && (
        <div style={{ marginTop: "64px", textAlign: "center", opacity: 0.35 }}>
          <Package size={56} style={{ margin: "0 auto 14px" }} />
          <p style={{ fontSize: "13px" }}>신청 정보를 조회하려면 위 검색창을 이용하세요.</p>
        </div>
      )}
    </div>
  );
}
