"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Search, HelpCircle } from "lucide-react";

const TABS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/order", label: "신청", icon: ClipboardList },
  { href: "/track", label: "조회", icon: Search },
  { href: "/help", label: "안내", icon: HelpCircle },
];

export default function MobileNav() {
  const pathname = usePathname();

  // Hide nav on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="mobile-nav w-full">
      <div className="mobile-nav-content flex flex-row w-full items-center justify-around">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link key={tab.href} href={tab.href} className={`tab-item flex flex-col items-center justify-center flex-1 ${isActive ? "active" : ""}`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
