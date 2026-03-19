"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

type Order = {
  id: string;
  orderNo: string;
  patientName: string;
  drugName: string;
  drugCategory: string | null;
  pillDays: number;
  isConsultation: boolean;
  status: string;
  isApproved: boolean;
  trackingNo: string | null;
  paymentMethod: string | null;
  paymentStatus: string;
  usAddress: string;
  kakaoId: string | null;
  riskLevel: number;
  createdAt: string;
};

const STATUS_TABS = [
  { key: "", label: "전체" },
  { key: "RECEIVED", label: "접수" },
  { key: "VERIFIED", label: "검수완료" },
  { key: "PREPARED", label: "조제완료" },
  { key: "SHIPPED", label: "배송중" },
  { key: "DELIVERED", label: "수령완료" },
];

const STATUS_LABEL: Record<string, string> = {
  RECEIVED: "접수됨",
  VERIFIED: "검수완료",
  PREPARED: "조제완료",
  SHIPPED: "배송중",
  DELIVERED: "수령완료",
};

const STATUS_BADGE: Record<string, string> = {
  RECEIVED: "badge-received",
  VERIFIED: "badge-verified",
  PREPARED: "badge-prepared",
  SHIPPED: "badge-shipped",
  DELIVERED: "badge-delivered",
};

const RISK_LEVEL_COLORS: Record<number, string> = {
  1: "#22c55e", // Green
  2: "#84cc16", // Lime
  3: "#eab308", // Yellow
  4: "#f97316", // Orange
  5: "#ef4444", // Red
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch(`/api/orders${activeTab ? `?status=${activeTab}` : ""}`);
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div style={{ padding: "0" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
          📦 주문 관리
        </h2>
        <p style={{ color: "#a0a0b8", fontSize: 14 }}>
          접수된 약 배송 및 비대면 진료 신청 주문을 관리합니다.
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 16, marginBottom: 32,
        }}
      >
        {STATUS_TABS.slice(1).map((tab) => {
          const count = orders.filter((o) => o.status === tab.key).length;
          return (
            <div
              key={tab.key}
              className="glass-card"
              style={{ padding: "16px 20px", textAlign: "center" }}
            >
              <p style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{count}</p>
              <p style={{ fontSize: 13, color: "#a0a0b8" }}>{tab.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex", gap: 4, marginBottom: 24, flexWrap: "wrap",
          background: "rgba(255,255,255,0.03)",
          borderRadius: 10, padding: 4, border: "1px solid rgba(255,255,255,0.06)",
          width: "fit-content",
        }}
      >
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "8px 16px", borderRadius: 8,
              border: "none", cursor: "pointer",
              background: activeTab === tab.key
                ? "linear-gradient(135deg, #4f8ef7, #8b5cf6)"
                : "transparent",
              color: activeTab === tab.key ? "white" : "#a0a0b8",
              fontSize: 13, fontWeight: activeTab === tab.key ? 600 : 400,
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#a0a0b8" }}>불러오는 중...</div>
      ) : orders.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: 60, textAlign: "center", color: "#606080" }}
        >
          <p style={{ fontSize: 32 }}>📭</p>
          <p style={{ marginTop: 12 }}>접수된 주문이 없습니다.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className="glass-card"
                style={{
                  padding: "20px 24px",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto auto auto",
                  gap: 20, alignItems: "center",
                  transition: "border-color 0.2s, transform 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(79,142,247,0.3)";
                  el.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(255,255,255,0.07)";
                  el.style.transform = "translateX(0)";
                }}
              >
                {/* Status Indicator */}
                <div
                  style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: order.status === "DELIVERED" ? "#22c55e"
                      : order.status === "SHIPPED" ? "#fbbf24"
                      : order.status === "PREPARED" ? "#14b8a6"
                      : order.status === "VERIFIED" ? "#a78bfa"
                      : "#4f8ef7",
                  }}
                />

                {/* Info */}
                <div>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>
                    {order.orderNo}
                    <span
                      style={{
                        marginLeft: 12, fontSize: 11, padding: "2px 8px",
                        borderRadius: 4, background: `${RISK_LEVEL_COLORS[order.riskLevel]}20`,
                        color: RISK_LEVEL_COLORS[order.riskLevel],
                        border: `1px solid ${RISK_LEVEL_COLORS[order.riskLevel]}40`,
                        fontWeight: 700,
                      }}
                    >
                      RISK LEVEL {order.riskLevel}
                    </span>
                    {order.pillDays > 85 && (
                      <span
                        style={{
                          marginLeft: 8, fontSize: 11, padding: "2px 6px",
                          borderRadius: 4, background: "rgba(251,191,36,0.15)",
                          color: "#fbbf24",
                        }}
                      >
                        ⚠️ {order.pillDays}일
                      </span>
                    )}
                  </p>
                  <p style={{ fontSize: 13, color: "#a0a0b8" }}>
                    {order.patientName} · {order.drugName}{" "}
                    {order.drugCategory && (
                      <span style={{ color: "#606080" }}>({order.drugCategory})</span>
                    )}
                    {order.isConsultation && (
                      <span style={{ marginLeft: 8, color: "#c4b5fd", fontSize: 11, background: "rgba(139,92,246,0.15)", padding: "2px 6px", borderRadius: 4 }}>
                        💬 비대면 진료 신청
                      </span>
                    )}
                  </p>
                </div>

                {/* Address */}
                <p style={{ fontSize: 12, color: "#606080", maxWidth: 200, textAlign: "right" }}>
                  {order.usAddress.length > 40
                    ? order.usAddress.slice(0, 40) + "..."
                    : order.usAddress}
                </p>

                {/* Date */}
                <p style={{ fontSize: 12, color: "#606080", whiteSpace: "nowrap" }}>
                  {new Date(order.createdAt).toLocaleDateString("ko-KR")}
                </p>

                {/* Status Badge */}
                <span className={`badge ${STATUS_BADGE[order.status] || ""}`}>
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
