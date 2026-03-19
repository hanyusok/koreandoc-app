import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import React from "react";
import { signOut } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // If not logged in, redirect to login
  if (!session) {
    redirect("/admin/login");
  }

  // To prevent unauthorized normal users from accessing the admin panel
  // NextAuth token.role was set to "user" or "admin".
  if ((session.user as any)?.role !== "admin") {
    // Optionally redirect to home or an unauthorized page
    redirect("/profile");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      {/* Top Admin Navigation */}
      <header style={{
        background: "rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 24px",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between", height: "70px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>🏥</span>
              <div>
                <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>KoreanDoc</h1>
                <p style={{ fontSize: 11, color: "#606080", margin: 0 }}>어드민 시스템</p>
              </div>
            </div>
            
            {/* Nav Tabs */}
            <nav style={{ display: "flex", gap: 16 }}>
              <Link href="/admin" className="nav-tab" style={{
                color: "var(--text-primary)", textDecoration: "none", fontSize: 14, fontWeight: 600,
                padding: "8px 16px", borderRadius: 8, transition: "background 0.2s"
              }}>
                주문 내역
              </Link>
              <Link href="/admin/users" className="nav-tab" style={{
                color: "var(--text-primary)", textDecoration: "none", fontSize: 14, fontWeight: 600,
                padding: "8px 16px", borderRadius: 8, transition: "background 0.2s"
              }}>
                회원 관리
              </Link>
            </nav>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Link href="/" target="_blank" style={{ fontSize: 13, color: "#4f8ef7", textDecoration: "none", fontWeight: 600 }}>
              고객 사이트 보기 →
            </Link>
            <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.1)" }} />
            <form action={async () => { "use server"; await signOut({ redirectTo: "/admin/login" }); }}>
              <button type="submit" className="nav-logout" style={{
                background: "transparent", border: "none", color: "#a0a0b8", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6, fontSize: 13, transition: "color 0.2s"
              }}>
                <LogOut size={16} /> 로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {children}
      </main>
    </div>
  );
}
