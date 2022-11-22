import { OrderItem, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

async function addOrder(
  userId: string,
  items: Omit<OrderItem, "id">[],
  orderInfo?: {
    receiver: string;
    address: string;
    phoneNumber: string;
  }
) {
  try {
    // orderItem들 생성
    let orderItemIds = [];
    for (const item of items) {
      const orderItem = await prisma.orderItem.create({
        data: {
          ...item,
        },
      });
      console.log(`Created id: ${orderItem.id}`);
      orderItemIds.push(orderItem.id);
    }
    console.log(JSON.stringify(orderItemIds));

    const response = await prisma.orders.create({
      data: {
        userId,
        orderItemIds: orderItemIds.join(","),
        ...orderInfo,
        status: 0,
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
  const { items, orderInfo } = JSON.parse(req.body);
  if (session === null) {
    res.status(200).json({ data: [], message: "no Session" });
    return;
  }
  try {
    const product = await addOrder(String(session.user?.id), items, orderInfo);
    res.status(200).json({ data: product, message: "Success" });
  } catch (err) {
    res.status(400).json({ message: `Failed ${err}` });
  }
}
