import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwtDecode from "jwt-decode";

const prisma = new PrismaClient();

async function signUp(credential: string) {
  const decoded: { name: string; email: string; picture: string } =
    jwtDecode(credential);
  try {
    // upsert: 있으면 업데이트, 없으면 생성
    const response = await prisma.user.upsert({
      where: {
        email: decoded.email,
      },
      update: {
        name: decoded.name,
        image: decoded.picture,
      },
      create: {
        email: decoded.email,
        name: decoded.name,
        image: decoded.picture,
      },
    });

    return response;
  } catch (err) {
    console.error(err);
  }
}

type Data = {
  data?: any;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { credential } = req.query;
    const userInfo = await signUp(String(credential));
    res.status(200).json({ data: userInfo, message: `Success` });
  } catch (err) {
    res.status(400).json({ message: `Failed` });
  }
}
