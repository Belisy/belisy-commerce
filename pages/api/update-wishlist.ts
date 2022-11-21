import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

async function updateWishlist(userId: string, productId: string) {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId: userId,
      },
    });

    const originWishlist =
      wishlist?.productIds !== null && wishlist?.productIds !== ""
        ? wishlist?.productIds.split(",")
        : [];

    const isWished = originWishlist?.includes(productId);

    const newWishlist = isWished
      ? originWishlist?.filter((el) => el !== productId)
      : originWishlist && [...originWishlist, productId];

    const response = await prisma.wishlist.upsert({
      where: {
        userId,
      },
      update: {
        productIds: newWishlist?.join(","),
      },
      create: {
        userId,
        productIds: newWishlist?.join(",") ?? productId,
      },
    });

    console.log("위시리스트", response);
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
  const { productId } = JSON.parse(req.body);

  if (session === null) {
    res.status(200).json({ data: [], message: "no session" });
    return;
  }

  try {
    const updateWish = await updateWishlist(
      String(session.user?.id),
      String(productId)
    );
    res.status(200).json({ data: updateWish, message: "Success" });
  } catch (err) {
    res.status(400).json({ message: `Failed ${err}` });
  }
}
