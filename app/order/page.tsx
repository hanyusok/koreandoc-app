"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Clipboard, CreditCard, CheckCircle2, ArrowLeft, ArrowRight, Camera, X } from "lucide-react";
import Image from "next/image";

type DrugCheckResult = {
  found: boolean;
  eligible?: boolean;
  drugName?: string;
  category?: string;
  note?: string;
  maxDays?: number;
};

export default function OrderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [drugQuery, setDrugQuery] = useState("");
  const [drugResult, setDrugResult] = useState<DrugCheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    patientName: "",
    kakaoId: "",
    usAddress: "",
    pillDays: "",
    paymentMethod: "bank",
  });
  const [rxFile, setRxFile] = useState<File | null>(null);
  const [rxPreview, setRxPreview] = useState<string | null>(null);

  const handleDrugCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugQuery.trim()) return;
    setChecking(true);
    setDrugResult(null);
    try {
      const res = await fetch(`/api/check-drug?name=${encodeURIComponent(drugQuery)}`);
      const data = await res.json();
      setDrugResult(data);
    } finally {
      setChecking(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRxFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setRxPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!rxFile) {
      setError("처방전 사진을 업로드해 주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("patientName", form.patientName);
      fd.append("kakaoId", form.kakaoId);
      fd.append("usAddress", form.usAddress);
      fd.append("pillDays", form.pillDays);
      fd.append("drugName", drugResult?.drugName ?? drugQuery);
      fd.append("paymentMethod", form.paymentMethod);
      fd.append("prescriptionImg", rxFile);

      const res = await fetch("/api/orders", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "오류가 발생했습니다.");
        return;
      }

      router.push(`/order/complete?orderNo=${data.order.orderNo}`);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-12 pb-24">
      {/* Mini Stepper */}
      <div className="flex justify-between items-center mb-8 px-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= s ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "bg-gray-800 text-gray-600"
            }`}>
              {step > s ? <CheckCircle2 size={16} /> : s}
            </div>
            {s < 3 && <div className={`h-0.5 flex-1 mx-2 ${step > s ? "bg-blue-600" : "bg-gray-800"}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-bold mb-2">무슨 약인가요?</h1>
          <p className="text-gray-400 text-sm mb-8">배송 가능 성분인지 먼저 확인해 드립니다.</p>
          
          <form onSubmit={handleDrugCheck} className="relative mb-8">
            <input
              className="form-input py-4 pr-12"
              placeholder="예: 피나스테리드, 스티바A"
              value={drugQuery}
              onChange={(e) => { setDrugQuery(e.target.value); setDrugResult(null); }}
            />
            <button type="submit" disabled={checking} className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 p-2 rounded-lg text-white">
              <Search size={20} />
            </button>
          </form>

          {drugResult && drugResult.eligible && (
            <div className="glass-card p-6 bg-green-500/5 border-green-500/20 mb-8 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 size={24} className="text-green-500" />
                <p className="font-bold">배송 가능한 약품입니다</p>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">{drugResult.note}</p>
              <button onClick={() => setStep(2)} className="btn-primary w-full py-4 justify-center">
                계속해서 신청하기 <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          )}

          {drugResult && !drugResult.eligible && (
            <div className="glass-card p-6 bg-red-500/5 border-red-500/20 mb-8 animate-fade-in-up">
              <p className="text-sm font-bold text-red-400 mb-2">배송이 불가능한 품목입니다</p>
              <p className="text-xs text-gray-400 leading-relaxed">{drugResult.note}</p>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => setStep(1)} className="text-gray-500"><ArrowLeft size={20} /></button>
            <h1 className="text-2xl font-bold">정보 입력</h1>
          </div>
          <p className="text-gray-400 text-sm mb-8">배송지 정보를 기입하고 처방전을 올려주세요.</p>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-2">환자 성함</label>
              <input 
                className="form-input" 
                placeholder="홍길동 / HONG GILDONG"
                value={form.patientName}
                onChange={(e) => setForm({ ...form, patientName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-2">미국 배송 주소 (영문)</label>
              <textarea 
                className="form-input min-h-[100px]" 
                placeholder="Full address in USA"
                value={form.usAddress}
                onChange={(e) => setForm({ ...form, usAddress: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-2">복용 일수</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="Max 90" 
                  value={form.pillDays}
                  onChange={(e) => setForm({ ...form, pillDays: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-2">카톡 ID</label>
                <input 
                  className="form-input" 
                  placeholder="선택 사항"
                  value={form.kakaoId}
                  onChange={(e) => setForm({ ...form, kakaoId: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-2">처방전 업로드</label>
              {rxPreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-gray-900">
                  <Image src={rxPreview} alt="rx" fill className="object-cover" />
                  <button 
                    onClick={() => { setRxFile(null); setRxPreview(null); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => document.getElementById('cameraInput')?.click()}
                  className="w-full aspect-video rounded-3xl border-2 border-dashed border-gray-800 bg-gray-900/20 flex flex-col items-center justify-center gap-3 text-gray-600 hover:text-blue-500 hover:border-blue-500/50 transition-colors"
                >
                  <Camera size={40} />
                  <span className="text-sm font-medium">사진 촬영 또는 파일 선택</span>
                </button>
              )}
              <input id="cameraInput" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            <button 
              className="btn-primary w-full py-4 justify-center"
              onClick={() => {
                if (form.patientName && form.usAddress && form.pillDays && rxFile) setStep(3);
                else setError("필수 항목을 모두 입력해 주세요.");
              }}
            >
              마지막 단계로 <ArrowRight size={16} className="ml-2" />
            </button>
            {error && <p className="text-red-400 text-center text-xs mt-2">{error}</p>}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => setStep(2)} className="text-gray-500"><ArrowLeft size={20} /></button>
            <h1 className="text-2xl font-bold">결제 방식</h1>
          </div>
          <p className="text-gray-400 text-sm mb-8">배송 및 서류 수수료 결제 방법을 골라주세요.</p>

          <div className="space-y-4 mb-8">
            <button 
              onClick={() => setForm({...form, paymentMethod: 'bank'})}
              className={`w-full p-5 rounded-3xl border-2 text-left flex items-center justify-between ${
                form.paymentMethod === 'bank' ? "border-blue-500 bg-blue-500/5" : "border-white/5 bg-gray-900/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center"><CreditCard size={24} className="text-blue-400" /></div>
                <div>
                  <p className="font-bold">무통장 입금</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Korean Bank Transfer</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${form.paymentMethod === 'bank' ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-800'}`}>
                {form.paymentMethod === 'bank' && <CheckCircle2 size={14} />}
              </div>
            </button>
            
            <button 
              onClick={() => setForm({...form, paymentMethod: 'stripe'})}
              className={`w-full p-5 rounded-3xl border-2 text-left flex items-center justify-between ${
                form.paymentMethod === 'stripe' ? "border-blue-500 bg-blue-500/5" : "border-white/5 bg-gray-900/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center"><Sparkles size={24} className="text-purple-400" /></div>
                <div>
                  <p className="font-bold">해외 카드 결제</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Debit / Credit Card</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${form.paymentMethod === 'stripe' ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-800'}`}>
                {form.paymentMethod === 'stripe' && <CheckCircle2 size={14} />}
              </div>
            </button>
          </div>

          <div className="glass-card mb-8 p-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-500">환자명</span><span className="font-medium">{form.patientName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">약명</span><span className="font-medium">{drugResult?.drugName ?? drugQuery}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">상태</span><span className="text-blue-400 font-bold">견적 대기</span></div>
            </div>
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={submitting}
            className="btn-primary w-full py-4 justify-center shadow-2xl shadow-blue-600/30"
          >
            {submitting ? "접수 처리 중..." : "신청 완료하기"}
          </button>
        </div>
      )}
    </div>
  );
}
