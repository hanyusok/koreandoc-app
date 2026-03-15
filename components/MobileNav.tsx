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
    <nav className="mobile-nav">
      <div className="mobile-nav-content">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link key={tab.href} href={tab.href} className={`tab-item ${isActive ? "active" : ""}`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
