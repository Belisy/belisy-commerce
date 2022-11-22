import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { PrismaClient } from "prisma/prisma-client";
import { authOptions } from "./auth/[...nextauth]";

// TODO: api작성 후, 나의 찜리스트 확인하는 페이지 만들기
const prisma = new PrismaClient();

async function getWishlists(userId: string) {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId: userId,
      },
    });

    // const productsId = wishlist?.productIds.split(",");
    // if (productsId && productsId.length > 0) {
    //   const response;
    //   console.log(response);
    //   return response;
    // }

    return [];
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
  //else {
  //   res.status(400).json({ message: `Success` });
  // }

  try {
    const wishlist = await getWishlists(String(session.user?.id));
    res.status(200).json({ data: wishlist, message: "Success" });
  } catch (err) {
    res.status(400).json({ message: `Failed ${err}` });
  }
}
