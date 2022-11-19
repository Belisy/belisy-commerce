import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { PrismaClient } from "prisma/prisma-client";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

async function getWishlist(userId: string) {
  try {
    const response = await prisma.wishlist.findUnique({
      where: {
        userId: userId,
      },
    });
    console.log("wishlist", response);
    return response?.productIds.split(",");
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
    res.status(200).json({ data: [], message: "no session" });
    return;
  } else {
    res.status(400).json({ message: `Success` });
  }

  try {
    console.log("세션!!", session);
    const wishlist = await getWishlist(String(session.user?.id));
    res.status(200).json({ data: wishlist, message: "Success" });
  } catch (err) {
    res.status(400).json({ message: `Failed ${err}` });
  }
}
