import { User, LogOut, CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import { auth, signIn, signOut } from "@/lib/auth";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProfileEditor from "./ProfileEditor";

export default async function ProfilePage() {
  const session = await auth();

  let dbUser: any = null;
  if (session?.user?.id) {
    dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
  }

  return (
    <div style={{ padding: "56px 20px 96px", minHeight: "100vh" }}>
      {/* ── Header ── */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.3px" }}>내 프로필</h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
            계정 관리 및 나의 건강 기록
          </p>
        </div>
        {session && (
          <form action={async () => { "use server"; await signOut({ redirectTo: "/profile" }); }}>
            <button type="submit" style={{
              width: "40px", height: "40px", borderRadius: "12px",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              color: "var(--text-secondary)", transition: "0.2s"
            }}>
              <LogOut size={18} />
            </button>
          </form>
        )}
      </header>

      {!session || !dbUser ? (
        <div style={{
          background: "rgba(22,22,36,0.7)", border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "20px", padding: "32px 20px", textAlign: "center", margin: "40px 0"
        }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <User size={30} color="#a0a0b8" />
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>로그인이 필요합니다</h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "32px", lineHeight: 1.6 }}>
            안전한 진료 기록 관리와 원활한 배송 조회를 위해<br/>소셜 계정 또는 이메일로 로그인해 주세요.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "320px", margin: "0 auto" }}>
            <form action={async () => { "use server"; await signIn("google", { redirectTo: "/profile" }); }}>
              <button type="submit" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", background: "white", color: "#333", border: "none", borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>
                <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google로 계속하기
              </button>
            </form>

            <form action={async () => { "use server"; await signIn("kakao", { redirectTo: "/profile" }); }}>
              <button type="submit" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", background: "#FEE500", color: "#191919", border: "none", borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>
                <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#191919" d="M12 3c-5.52 0-10 3.58-10 8 0 2.86 1.83 5.37 4.6 6.78l-1 3.82c-.08.29.23.51.49.37l4.37-2.92c.5.05 1.01.08 1.54.08 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/></svg>
                카카오로 계속하기
              </button>
            </form>

            <form action={async (formData: FormData) => { "use server"; await signIn("nodemailer", formData, { redirectTo: "/profile" }); }} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
              <div style={{ position: "relative" }}>
                <input name="email" type="email" placeholder="이메일 주소 입력" required style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "14px 14px 14px 44px", color: "var(--text-primary)", fontSize: "15px", outline: "none" }} />
                <Mail size={18} color="var(--text-secondary)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
              </div>
              <button type="submit" style={{ width: "100%", background: "rgba(255,255,255,0.1)", color: "white", border: "none", borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>
                이메일로 매직 링크 받기
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* ── 1. User Information ── */}
          <div style={{
            background: "rgba(22,22,36,0.7)", border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "20px", padding: "20px", marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
          }}>
            <div style={{
              width: "60px", height: "60px", borderRadius: "16px",
              background: dbUser.image ? "transparent" : "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
              overflow: "hidden"
            }}>
              {dbUser.image ? (
                <Image src={dbUser.image} alt="Profile" width={60} height={60} style={{ objectFit: "cover" }} />
              ) : (
                <User size={28} color="white" />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "2px" }}>{dbUser.name || "고객님"}</h2>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px" }}>{dbUser.email}</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "4px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em" }}>
                <CheckCircle2 size={10} /> 본인 인증 완료
              </div>
            </div>
          </div>

          {/* Render Profile Editor for Interactive DB Sections */}
          <ProfileEditor user={dbUser} />
        </>
      )}
    </div>
  );
}
