import { Cart, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

async function addCart(userId: string, item: Omit<Cart, "id" | "userId">) {
  try {
    const response = prisma.cart.create({
      data: {
        userId,
        ...item,
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
  const session = await unstable_getServerSession(req, res, authOptions);
  const { item } = JSON.parse(req.body);
  if (session === null) {
    res.status(200).json({ data: [], message: "no Session" });
    return;
  }
  try {
    const product = await addCart(String(session.user?.id), item);
    res.status(200).json({ data: product, message: "Success" });
  } catch (err) {
    res.status(400).json({ message: `Failed ${err}` });
  }
}
