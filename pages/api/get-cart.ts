import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

async function getCart(userId: string) {
  try {
    const cart =
      await prisma.$queryRaw`SELECT c.id, userId, quantity, amount, price, name, image_url, productId FROM Cart as c JOIN products as p WHERE c.productId=p.id AND c.userId=${userId}`;

    return cart;
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
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session === null) {
    res.status(200).json({ data: [], message: "no Session" });
    return;
  }

  try {
    const cart = await getCart(String(session.user?.id));
    res.status(200).json({ data: cart, message: "success" });
  } catch (err) {
    res.status(400).json({ message: `Faeiled ${err}` });
  }
}
