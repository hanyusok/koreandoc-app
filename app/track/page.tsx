"use client";

import { useState } from "react";
import { Search, Package, MapPin, Calendar, CheckCircle2, Clock, Send, Home as HomeIcon } from "lucide-react";

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
      // For MVP, we'll try to find by order number
      // In a real app, we'd have a specific search endpoint
      const res = await fetch("/api/orders");
      const orders: Order[] = await res.json();
      
      const found = orders.find(
        (o) => o.orderNo.toLowerCase() === query.trim().toLowerCase() || 
               o.patientName === query.trim()
      );

      if (found) {
        setOrder(found);
      } else {
        setError("일치하는 주문 정보를 찾을 수 없습니다. 주문번호를 다시 확인해 주세요.");
      }
    } catch (err) {
      setError("조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const currentStatusIndex = order ? STATUS_STEPS.findIndex(s => s.key === order.status) : -1;

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">주문 조회</h1>
        <p className="text-gray-400 text-sm">주문번호 또는 예약자 성함을 입력하세요.</p>
      </header>

      <form onSubmit={handleSearch} className="relative mb-8">
        <input
          type="text"
          className="form-input pl-12 pr-4 py-4 h-14"
          placeholder="주문번호 (예: US-2026...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <button 
          type="submit" 
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 p-2 rounded-lg text-white"
        >
          {loading ? "..." : <Search size={20} />}
        </button>
      </form>

      {error && (
        <div className="glass-card p-4 border-red-900/30 text-red-400 text-sm text-center mb-6">
          {error}
        </div>
      )}

      {order && (
        <div className="animate-fade-in-up">
          {/* Summary Card */}
          <div className="glass-card p-5 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Order Number</p>
                <p className="text-lg font-bold text-blue-400">{order.orderNo}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Item</p>
                <p className="text-sm font-medium">{order.drugName}</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="flex-1 bg-gray-800/50 rounded-xl p-3 border border-white/5">
                <p className="text-[10px] text-gray-500 mb-1">성함</p>
                <p className="text-sm font-semibold">{order.patientName}</p>
              </div>
              <div className="flex-1 bg-gray-800/50 rounded-xl p-3 border border-white/5">
                <p className="text-[10px] text-gray-500 mb-1">접수일</p>
                <p className="text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Timeline UI */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest">Delivery Timeline</h3>
            <div className="relative">
              {/* Vertical line background */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800" />
              
              <div className="space-y-8 relative">
                {STATUS_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  const Icon = step.icon;

                  return (
                    <div key={step.key} className={`flex items-start gap-5 transition-opacity duration-500 ${isCompleted ? 'opacity-100' : 'opacity-30'}`}>
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-gray-800'}`}>
                        <Icon size={16} className={isCompleted ? 'text-white' : 'text-gray-500'} />
                      </div>
                      
                      <div className="flex-1 pt-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className={`font-bold ${isCurrent ? 'text-blue-400' : 'text-white'}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {isCompleted ? (idx === 3 && order.trackingNo ? `송장번호: ${order.trackingNo}` : '완료되었습니다.') : '대기 중입니다.'}
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
              className="btn-primary w-full mt-6 py-4 justify-center"
              target="_blank"
            >
              EMS 실시간 위치 확인
            </a>
          )}
        </div>
      )}
      
      {!order && !loading && (
        <div className="mt-20 text-center opacity-40">
          <Package size={64} className="mx-auto mb-4" />
          <p className="text-sm">신청 정보를 조회하려면 위 검색창을 이용하세요.</p>
        </div>
      )}
    </div>
  );
}
