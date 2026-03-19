import NextAuth from "next-auth";
import NodemailerProvider from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
    NodemailerProvider({
      server: process.env.EMAIL_SERVER as string,
      from: process.env.EMAIL_FROM as string,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        if (
          !provider.server ||
          typeof provider.server !== "string" ||
          provider.server.includes("smtp.example.com")
        ) {
          console.log(`\n======================================================`);
          console.log(`🚀 [LOCAL DEV] 매직 로그인 링크 발송 로그`);
          console.log(`받는 사람 (Email): ${identifier}`);
          console.log(`로그인 주소 (URL): ${url}`);
          console.log(`(주의: .env에 실제 SMTP가 설정되지 않아 터미널에 출력합니다)`);
          console.log(`======================================================\n`);
          return;
        }

        const { createTransport } = await import("nodemailer");
        const transport = createTransport(provider.server);
        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `KoreanDoc 로그인 매직 링크`,
          text: `아래 링크를 클릭하여 로그인하세요: ${url}`,
          html: `<div style="font-family: sans-serif; padding: 20px;">
                  <h2>KoreanDoc 로그인</h2>
                  <p>이메일 로그인을 요청하셨습니다. 아래 버튼을 클릭하여 안전하게 로그인하세요.</p>
                  <a href="${url}" style="display:inline-block; padding: 12px 24px; background: #4f8ef7; color: white; text-decoration: none; border-radius: 8px;">안전하게 로그인하기</a>
                </div>`,
        });
      },
    }),
  ],
});
