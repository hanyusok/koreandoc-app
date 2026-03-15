"use client";

import { useState } from "react";
import Link from "next/link";
import { Pill, ShieldCheck, Truck, ArrowRight, Search, Activity, Heart, Sparkles } from "lucide-react";

export default function Home() {
  const [drugQuery, setDrugQuery] = useState("");
  const [checkResult, setCheckResult] = useState<{
    found: boolean;
    eligible?: boolean;
    drugName?: string;
    category?: string;
    note?: string;
  } | null>(null);
  const [checking, setChecking] = useState(false);

  const handleDrugCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugQuery.trim()) return;
    setChecking(true);
    try {
      const res = await fetch(
        `/api/check-drug?name=${encodeURIComponent(drugQuery)}`
      );
      const data = await res.json();
      setCheckResult(data);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen px-6 pt-12 pb-24">
      {/* Header Profile */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">안녕하세요 👋</h1>
          <p className="text-gray-400 text-sm">미국 거주 한인 한국 약 안심 배송</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
          <Heart size={24} fill="white" />
        </div>
      </header>

      {/* Main Hero Card */}
      <div className="glass-card p-6 border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-transparent relative overflow-hidden mb-8">
        <Sparkles className="absolute top-4 right-4 text-blue-400/30" size={40} />
        <h2 className="text-lg font-bold mb-2">오늘도 건강한 하루 보내세요</h2>
        <p className="text-xs text-gray-400 leading-relaxed max-w-[200px] mb-6">
          처방전 접수부터 통관 서류 준비까지 KoreanDoc이 완벽하게 대행해 드립니다.
        </p>
        <Link href="/order" className="btn-primary py-3 px-6 text-sm">
          신청하기 <ArrowRight size={14} className="ml-2" />
        </Link>
      </div>

      {/* Quick Stats/Features */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="glass-card p-4 flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-green-950 flex items-center justify-center text-green-400 mb-2">
            <ShieldCheck size={20} />
          </div>
          <p className="text-[10px] text-gray-500 uppercase font-bold">통관 통과율</p>
          <p className="text-lg font-bold">95.4%</p>
        </div>
        <div className="glass-card p-4 flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center text-blue-400 mb-2">
            <Truck size={20} />
          </div>
          <p className="text-[10px] text-gray-500 uppercase font-bold">평균 배송일</p>
          <p className="text-lg font-bold">8.2일</p>
        </div>
      </div>

      {/* Drug Checker Widget */}
      <section className="mb-10">
        <h3 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
          <Activity size={14} /> Drug Checker
        </h3>
        <div className="glass-card p-5">
          <p className="text-xs text-gray-400 mb-4">내 약이 미국으로 배송 가능한 성분인지 확인하세요.</p>
          <form onSubmit={handleDrugCheck} className="flex gap-2">
            <div className="relative flex-1">
              <input
                className="form-input py-3 pl-10"
                type="text"
                placeholder="약 이름 입력..."
                value={drugQuery}
                onChange={(e) => {
                  setDrugQuery(e.target.value);
                  setCheckResult(null);
                }}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            </div>
            <button
              type="submit"
              className="btn-primary py-3 px-5 transition-all"
              disabled={checking}
            >
              <ArrowRight size={18} />
            </button>
          </form>

          {checkResult && (
            <div
              className={`mt-4 p-4 rounded-xl animate-fade-in-up border ${checkResult.eligible
                  ? "bg-green-500/10 border-green-500/20"
                  : "bg-red-500/10 border-red-500/20"
                }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{checkResult.eligible ? "✅" : "❌"}</span>
                <p className="font-bold text-sm">
                  {checkResult.eligible ? "배송 가능 품목" : "배송 제한 품목"}
                </p>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">{checkResult.note}</p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Drugs Grid */}
      <section>
        <h3 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
          <Pill size={14} /> Top Categories
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: "탈모약 전문", color: "from-blue-600/20" },
            { name: "피부과 연고", color: "from-purple-600/20" },
            { name: "고혈압/당뇨", color: "from-teal-600/20" },
            { name: "만성 비염", color: "from-rose-600/20" },
          ].map((cat, i) => (
            <div
              key={i}
              className={`glass-card p-5 h-28 bg-gradient-to-br ${cat.color} to-transparent flex flex-col justify-end transition-transform active:scale-95`}
            >
              <p className="text-sm font-bold">{cat.name}</p>
              <div className="mt-2 text-[10px] text-gray-500 font-bold flex items-center uppercase tracking-wider">
                Explore <ArrowRight size={10} className="ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
