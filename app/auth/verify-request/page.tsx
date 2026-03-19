import { Mail, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function VerifyRequest() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0a0a0f",
      padding: "20px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Accents (Glassmorphism blobs) */}
      <div style={{ position: "absolute", top: "10%", left: "20%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(79,142,247,0.15) 0%, rgba(10,10,15,0) 70%)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "20%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(10,10,15,0) 70%)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />

      <div style={{
        maxWidth: "440px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        {/* Main Card */}
        <div style={{
          width: "100%",
          background: "rgba(30, 30, 46, 0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "24px",
          padding: "48px 32px",
          textAlign: "center",
          boxShadow: "0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)"
        }}>
          {/* Animated/Glowing Icon */}
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, rgba(79,142,247,0.2), rgba(139,92,246,0.2))",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
            boxShadow: "0 0 40px rgba(79,142,247,0.2)"
          }}>
            <Mail size={36} color="#ffffff" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }} />
          </div>

          <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "16px", color: "white", letterSpacing: "-0.5px" }}>
            이메일을 확인해주세요
          </h1>
          
          <p style={{ fontSize: "15px", color: "#a0a0b8", lineHeight: 1.6, marginBottom: "32px", fontWeight: 400 }}>
            입력하신 주소로 안전한 <strong>매직 로그인 링크</strong>를 발송했습니다.<br/>
            이메일의 링크를 클릭하시면 비밀번호 없이 <br/>즉시 로그인됩니다.
          </p>

          <div style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: "16px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
            border: "1px solid rgba(255,255,255,0.03)"
          }}>
            <ShieldCheck size={20} color="#22c55e" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: "13px", color: "#a0a0b8", textAlign: "left", lineHeight: 1.5 }}>
              보안을 위해 해당 링크는 일정 시간 후에 만료됩니다. 가급적 빨리 확인해주세요.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
            <Link href="/" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              width: "100%", padding: "16px", background: "white", color: "#0a0a0f",
              borderRadius: "14px", fontSize: "15px", fontWeight: 700, textDecoration: "none",
              boxShadow: "0 4px 14px rgba(255,255,255,0.1)", transition: "0.2s"
            }}>
              메인 화면으로 돌아가기 <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        
        <p style={{ marginTop: "24px", fontSize: "13px", color: "#606080" }}>
          메일이 오지 않았나요? 스팸함을 확인해 보거나 다시 시도해 주세요.
        </p>
      </div>
    </div>
  );
}
