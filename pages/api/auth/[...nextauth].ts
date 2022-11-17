import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const prisma = new PrismaClient();

// .env안의 키들을 바로 사용하면 에러가 나기 때문에 새 변수에 담아 사용
const googleId: string = process.env.NEXT_PUBLIC_GOOGLE_ID ?? "";
const googleSecret: string = process.env.GOOGLE_SECRET ?? "";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: googleId,
      clientSecret: googleSecret,
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 토큰만료-30일 기한
  },
  // callbacks: {
  //   session: async ({ session, user }) => {
  //     session.id = user.id;
  //     return Promise.resolve(session);
  //   },
  // },
};

export default NextAuth(authOptions);
