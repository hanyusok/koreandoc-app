"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function CompleteContent() {
  const params = useSearchParams();
  const orderNo = params.get("orderNo") ?? "—";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 50% 30%, rgba(34,197,94,0.08) 0%, transparent 60%), #0a0a0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div className="glass-card" style={{ maxWidth: 520, width: "100%", padding: 48, textAlign: "center" }}>
        <div
          style={{
            width: 80, height: 80, borderRadius: "50%", margin: "0 auto 24px",
            background: "rgba(34,197,94,0.12)",
            border: "2px solid rgba(34,197,94,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36,
          }}
          className="animate-float"
        >
          ✅
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
          배송 신청 완료!
        </h1>
        <p style={{ color: "#a0a0b8", marginBottom: 32, lineHeight: 1.7 }}>
          신청서가 성공적으로 접수되었습니다.
          <br />
          운영자 검수 후 카카오톡으로 안내드립니다.
        </p>

        <div
          style={{
            background: "rgba(79,142,247,0.08)",
            border: "1px solid rgba(79,142,247,0.2)",
            borderRadius: 12, padding: "20px 28px", marginBottom: 32,
          }}
        >
          <p style={{ fontSize: 13, color: "#a0a0b8", marginBottom: 6 }}>주문 번호</p>
          <p
            style={{
              fontSize: 22, fontWeight: 700,
              background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              letterSpacing: "0.05em",
            }}
          >
            {orderNo}
          </p>
          <p style={{ fontSize: 12, color: "#606080", marginTop: 8 }}>
            이 번호를 메모해 두시면 문의 시 활용하실 수 있습니다.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "14px 18px", borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              textAlign: "left",
            }}
          >
            <span style={{ flexShrink: 0 }}>📋</span>
            <p style={{ fontSize: 13, color: "#a0a0b8" }}>
              운영자가 처방전을 확인하고 <strong style={{ color: "#f0f0f5" }}>1~2 영업일 내</strong>에 검수 결과를 알려드립니다.
            </p>
          </div>
          <div
            style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "14px 18px", borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              textAlign: "left",
            }}
          >
            <span style={{ flexShrink: 0 }}>💬</span>
            <p style={{ fontSize: 13, color: "#a0a0b8" }}>
              카카오톡 ID를 남기셨다면 실시간 상담을 통해 진행 상황을 안내드립니다.
            </p>
          </div>
          <div
            style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "14px 18px", borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              textAlign: "left",
            }}
          >
            <span style={{ flexShrink: 0 }}>✈️</span>
            <p style={{ fontSize: 13, color: "#a0a0b8" }}>
              조제 완료 후 EMS로 발송되며, 운송장 번호를 카카오톡으로 전달드립니다.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/" className="btn-secondary">
            홈으로
          </Link>
          <Link href="/order" className="btn-primary">
            추가 신청
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={<div style={{ color: "#f0f0f5", textAlign: "center", padding: 48 }}>로딩 중...</div>}>
      <CompleteContent />
    </Suspense>
  );
}
