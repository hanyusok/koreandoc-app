import type { Metadata } from "next";
import "./globals.css";
import MobileNav from "@/components/MobileNav";

export const metadata: Metadata = {
  title: "KoreanDoc — 미국 거주 한인을 위한 한국 약 안심 배송",
  description:
    "FDA 개인 수입 규정 준수 및 영문 증빙 서류 완벽 준비. 탈모약, 피부과 연고, 만성질환약을 안전하게 미국으로 배송합니다.",
  keywords: "한국 약, 미국 배송, 탈모약, 피나스테리드, 스티바A, 한인",
  openGraph: {
    title: "KoreanDoc — 미국 한인 한국 약 배송",
    description: "탈모약, 피부과 연고, 만성질환약 안심 배송",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <main>{children}</main>
        <MobileNav />
      </body>
    </html>
  );
}
