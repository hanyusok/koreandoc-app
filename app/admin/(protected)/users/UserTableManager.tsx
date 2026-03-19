"use client";

import { useState, useTransition } from "react";
import { User, ShieldAlert, ShieldCheck, Mail, Calendar, UserPlus, Trash2, Edit } from "lucide-react";
import { createUser, updateUserRole, deleteUser } from "./actions";

type UIUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string | null;
};

export default function UserTableManager({ initialUsers }: { initialUsers: UIUser[] }) {
  const [isPending, startTransition] = useTransition();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      createUser(formData).then(() => {
        setShowAddModal(false);
      }).catch((err) => alert(err.message));
    });
  };

  const handleToggleRole = (id: string, role: string) => {
    if (!confirm(`이 유저의 권한을 ${role === "admin" ? "일반 유저" : "관리자"}로 변경하시겠습니까?`)) return;
    startTransition(() => {
      updateUserRole(id, role).catch((err) => alert(err.message));
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("정말 이 유저를 삭제하시겠습니까? 복구할 수 없습니다.")) return;
    startTransition(() => {
      deleteUser(id).catch((err) => alert(err.message));
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
            <User size={24} color="#4f8ef7" /> 회원 관리
          </h2>
          <p style={{ color: "#a0a0b8", fontSize: 14, margin: 0 }}>
            가입된 {initialUsers.length}명의 고객 및 관리자 계정을 확인하고 관리합니다.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)", color: "white", padding: "10px 16px",
            border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6, opacity: isPending ? 0.7 : 1
          }}
          disabled={isPending}
        >
          <UserPlus size={16} /> 새 회원 추가
        </button>
      </div>

      <div style={{ background: "rgba(22,22,36,0.6)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, overflow: "hidden", opacity: isPending ? 0.6 : 1, transition: "opacity 0.2s" }}>
        {initialUsers.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", color: "#606080" }}>가져올 데이터가 없습니다.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <th style={{ padding: "16px 20px", fontSize: 13, color: "#606080", fontWeight: 600 }}>유저 정보</th>
                <th style={{ padding: "16px 20px", fontSize: 13, color: "#606080", fontWeight: 600 }}>권한 (Role)</th>
                <th style={{ padding: "16px 20px", fontSize: 13, color: "#606080", fontWeight: 600 }}>가입일</th>
                <th style={{ padding: "16px 20px", fontSize: 13, color: "#606080", fontWeight: 600, textAlign: "right" }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {initialUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {user.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.image} alt="" style={{ width: "100%", height: "100%", borderRadius: 12, objectFit: "cover" }} />
                        ) : (
                          <User size={20} color="#a0a0b8" />
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{user.name || "이름 없음"}</p>
                        <p style={{ fontSize: 12, color: "#a0a0b8", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                          <Mail size={12} /> {user.email || "이메일 없음"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    {user.role === "admin" ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(139,92,246,0.15)", color: "#c4b5fd", padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                        <ShieldAlert size={14} /> 관리자
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(34,197,94,0.15)", color: "#86efac", padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                        <ShieldCheck size={14} /> 고객
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <p style={{ fontSize: 13, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
                      <Calendar size={14} color="#606080" /> 정보 없음
                    </p>
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <button onClick={() => handleToggleRole(user.id, user.role || "user")} disabled={isPending} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: 6, color: "var(--text-primary)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                      <Edit size={12} /> {user.role === "admin" ? "일반 강등" : "관리자 승급"}
                    </button>
                    <button onClick={() => handleDelete(user.id)} disabled={isPending} style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.2)", padding: "6px 10px", borderRadius: 6, color: "#f87171", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                      <Trash2 size={12} /> 삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#161624", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 32, width: 400, maxWidth: "90%" }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>새 회원 추가</h3>
            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#a0a0b8", marginBottom: 6 }}>이름</label>
                <input name="name" type="text" required style={{ width: "100%", padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#a0a0b8", marginBottom: 6 }}>이메일</label>
                <input name="email" type="email" required style={{ width: "100%", padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#a0a0b8", marginBottom: 6 }}>권한</label>
                <select name="role" style={{ width: "100%", padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none" }}>
                  <option value="user">일반 고객 (User)</option>
                  <option value="admin">관리자 (Admin)</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "none", color: "white", cursor: "pointer", fontWeight: 600 }}>취소</button>
                <button type="submit" disabled={isPending} style={{ flex: 1, padding: 12, borderRadius: 8, background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)", border: "none", color: "white", cursor: "pointer", fontWeight: 600 }}>추가하기</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
