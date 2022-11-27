import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();
async function deleteWish(userId: string, productId: string) {
  try {
    const userWishList = await prisma.wishlist.findUnique({
      where: {
        userId: userId,
      },
    });
    const wishlistItemArr = userWishList?.productIds.split(",");
    let newArr: string[] = [];
    if (wishlistItemArr && wishlistItemArr?.length > 0) {
      newArr = wishlistItemArr.filter((item) => item !== productId);
    }

    const response = await prisma.wishlist.update({
      where: {
        userId: userId,
      },
      data: {
        productIds: newArr.join(","),
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
  const { productId } = JSON.parse(req.body);
  if (session === null) {
    res.status(200).json({ data: [], message: "no Session" });
    return;
  }
  try {
    const product = await deleteWish(
      String(session.user?.id),
      String(productId)
    );
    res.status(200).json({ data: product, message: "Success" });
  } catch (err) {
    res.status(400).json({ message: `Failed ${err}` });
  }
}
