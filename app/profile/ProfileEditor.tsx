"use client";

import { useState, useTransition } from "react";
import { MapPin, FileText, Bell, Edit, Check, X } from "lucide-react";
import { updateAddress, updateMedicalHistory, updatePreferences } from "./actions";

type DBUser = {
  id: string;
  usAddress: string | null;
  allergies: string | null;
  currentMeds: string | null;
  pastConditions: string | null;
  kakaoNotif: boolean;
  emailReport: boolean;
  promoUpdates: boolean;
};

export default function ProfileEditor({ user }: { user: DBUser }) {
  const [isPending, startTransition] = useTransition();

  // Address State
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState(user.usAddress || "");

  // Medical State
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [medicalInput, setMedicalInput] = useState({
    allergies: user.allergies || "",
    currentMeds: user.currentMeds || "",
    pastConditions: user.pastConditions || "",
  });

  // Action Handlers
  const handleSaveAddress = () => {
    startTransition(() => {
      updateAddress(addressInput).then(() => setIsEditingAddress(false));
    });
  };

  const handleSaveMedical = () => {
    startTransition(() => {
      updateMedicalHistory(medicalInput).then(() => setIsEditingMedical(false));
    });
  };

  const handleTogglePref = (key: "kakaoNotif" | "emailReport" | "promoUpdates") => {
    const newPrefs = {
      kakaoNotif: user.kakaoNotif,
      emailReport: user.emailReport,
      promoUpdates: user.promoUpdates,
      [key]: !user[key],
    };
    startTransition(() => {
      updatePreferences(newPrefs);
    });
  };

  return (
    <div style={{ opacity: isPending ? 0.7 : 1, transition: "opacity 0.2s" }}>
      {/* 2. 배송지 (US Address) */}
      <section style={{ padding: "24px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <MapPin size={20} color="#4f8ef7" /> 배송지 (US Address)
          </h3>
          {!isEditingAddress ? (
            <button onClick={() => setIsEditingAddress(true)} style={{ background: "none", border: "none", color: "#a0a0b8", cursor: "pointer" }}>
              <Edit size={16} />
            </button>
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setIsEditingAddress(false)} style={{ background: "none", border: "none", color: "#a0a0b8", cursor: "pointer" }}>
                <X size={20} />
              </button>
              <button onClick={handleSaveAddress} disabled={isPending} style={{ background: "none", border: "none", color: "#4f8ef7", cursor: "pointer" }}>
                <Check size={20} />
              </button>
            </div>
          )}
        </div>
        <div className="glass-card" style={{ padding: 20 }}>
          {isEditingAddress ? (
            <textarea
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="예: 123 Main St, Apt 4B, New York, NY 10001"
              style={{
                width: "100%", minHeight: 80, background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 12,
                color: "white", outline: "none", resize: "none"
              }}
            />
          ) : (
            <div>
              <p style={{ margin: 0, color: user.usAddress ? "white" : "#606080", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                {user.usAddress || "등록된 미국 배송지가 없습니다."}
              </p>
              {!user.usAddress && (
                <p style={{ margin: 0, marginTop: 12, fontSize: 13, color: "#a0a0b8", padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                  약 배송을 위해 반드시 미국 주소를 입력해 주세요.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 3. 개인 의료 기록 (Medical History) */}
      <section style={{ padding: "0 20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={20} color="#8b5cf6" /> 개인 의료 기록
          </h3>
          {!isEditingMedical ? (
            <button onClick={() => setIsEditingMedical(true)} style={{ background: "none", border: "none", color: "#a0a0b8", cursor: "pointer" }}>
              <Edit size={16} />
            </button>
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setIsEditingMedical(false)} style={{ background: "none", border: "none", color: "#a0a0b8", cursor: "pointer" }}>
                <X size={20} />
              </button>
              <button onClick={handleSaveMedical} disabled={isPending} style={{ background: "none", border: "none", color: "#4f8ef7", cursor: "pointer" }}>
                <Check size={20} />
              </button>
            </div>
          )}
        </div>
        <div className="glass-card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {isEditingMedical ? (
            <>
              <div>
                <p style={{ fontSize: 13, color: "#a0a0b8", marginBottom: 6 }}>알레르기 반응</p>
                <input type="text" value={medicalInput.allergies} onChange={(e) => setMedicalInput({ ...medicalInput, allergies: e.target.value })} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 12, color: "white", outline: "none" }} placeholder="예: 페니실린, 아스피린" />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "#a0a0b8", marginBottom: 6 }}>현재 복용 중인 약품</p>
                <input type="text" value={medicalInput.currentMeds} onChange={(e) => setMedicalInput({ ...medicalInput, currentMeds: e.target.value })} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 12, color: "white", outline: "none" }} placeholder="예: 고혈압 약, 타이레놀" />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "#a0a0b8", marginBottom: 6 }}>과거 병력</p>
                <input type="text" value={medicalInput.pastConditions} onChange={(e) => setMedicalInput({ ...medicalInput, pastConditions: e.target.value })} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 12, color: "white", outline: "none" }} placeholder="예: 당뇨, 천식" />
              </div>
            </>
          ) : (
            <>
              <div>
                <p style={{ fontSize: 13, color: "#a0a0b8", marginBottom: 4 }}>알레르기 반응</p>
                <p style={{ margin: 0, fontWeight: 600, color: user.allergies ? "white" : "#606080" }}>{user.allergies || "없음"}</p>
              </div>
              <div>
                <p style={{ fontSize: 13, color: "#a0a0b8", marginBottom: 4 }}>현재 복용 중인 약품</p>
                <p style={{ margin: 0, fontWeight: 600, color: user.currentMeds ? "white" : "#606080" }}>{user.currentMeds || "없음"}</p>
              </div>
              <div>
                <p style={{ fontSize: 13, color: "#a0a0b8", marginBottom: 4 }}>과거 병력</p>
                <p style={{ margin: 0, fontWeight: 600, color: user.pastConditions ? "white" : "#606080" }}>{user.pastConditions || "없음"}</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 4. 환경설정 (Preferences) */}
      <section style={{ padding: "0 20px 24px" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Bell size={20} color="#14b8a6" /> 알림 및 환경설정
        </h3>
        <div className="glass-card" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>카카오톡 알림 수신</p>
              <p style={{ margin: 0, fontSize: 12, color: "#a0a0b8", marginTop: 4 }}>주문 및 처방 진행 상황을 알려드립니다.</p>
            </div>
            <button disabled={isPending} onClick={() => handleTogglePref("kakaoNotif")} style={{ width: 44, height: 24, borderRadius: 12, background: user.kakaoNotif ? "#4f8ef7" : "rgba(255,255,255,0.1)", border: "none", position: "relative", cursor: "pointer", transition: "0.2s" }}>
              <div style={{ position: "absolute", top: 2, left: user.kakaoNotif ? 22 : 2, width: 20, height: 20, background: "white", borderRadius: "50%", transition: "0.2s" }} />
            </button>
          </div>
          <div style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>이메일 처방 리포트</p>
              <p style={{ margin: 0, fontSize: 12, color: "#a0a0b8", marginTop: 4 }}>처방 검토 결과를 이메일로 받아봅니다.</p>
            </div>
            <button disabled={isPending} onClick={() => handleTogglePref("emailReport")} style={{ width: 44, height: 24, borderRadius: 12, background: user.emailReport ? "#4f8ef7" : "rgba(255,255,255,0.1)", border: "none", position: "relative", cursor: "pointer", transition: "0.2s" }}>
              <div style={{ position: "absolute", top: 2, left: user.emailReport ? 22 : 2, width: 20, height: 20, background: "white", borderRadius: "50%", transition: "0.2s" }} />
            </button>
          </div>
          <div style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>마케팅 정보 수신 동의</p>
              <p style={{ margin: 0, fontSize: 12, color: "#a0a0b8", marginTop: 4 }}>할인 쿠폰 및 이벤트 정보를 알려드립니다.</p>
            </div>
            <button disabled={isPending} onClick={() => handleTogglePref("promoUpdates")} style={{ width: 44, height: 24, borderRadius: 12, background: user.promoUpdates ? "#4f8ef7" : "rgba(255,255,255,0.1)", border: "none", position: "relative", cursor: "pointer", transition: "0.2s" }}>
              <div style={{ position: "absolute", top: 2, left: user.promoUpdates ? 22 : 2, width: 20, height: 20, background: "white", borderRadius: "50%", transition: "0.2s" }} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
