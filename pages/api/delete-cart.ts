import { Cart, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

async function deleteCart(id: number) {
  try {
    const response = await prisma.cart.delete({
      where: {
        id: id,
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
  const { id } = JSON.parse(req.body);
  if (session === null) {
    res.status(200).json({ data: [], message: "no Session" });
    return;
  }
  try {
    const product = await deleteCart(id);
    res.status(200).json({ data: product, message: "Success" });
  } catch (err) {
    res.status(400).json({ message: `Failed ${err}` });
  }
}
