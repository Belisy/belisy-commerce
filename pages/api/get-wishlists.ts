import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { PrismaClient, products } from "prisma/prisma-client";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

async function getWishlists(userId: string) {
  try {
    const wishlists = await prisma.wishlist.findUnique({
      where: {
        userId: userId,
      },
    });

    const productsIdArr = wishlists?.productIds.split(",");

    const response: products[] = [];
    if (productsIdArr && productsIdArr.length > 0) {
      for (let productId of productsIdArr) {
        const product = await prisma.products.findUnique({
          where: {
            id: Number(productId),
          },
        });
        if (product) {
          response.push(product);
        }
      }
    }

    console.log(response);
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
  if (session === null) {
    res.status(200).json({ data: [], message: "no session" });
    return;
  }

  try {
    const wishlist = await getWishlists(String(session.user?.id));
    res.status(200).json({ data: wishlist, message: "Success" });
  } catch (err) {
    res.status(400).json({ message: `Failed ${err}` });
  }
}
