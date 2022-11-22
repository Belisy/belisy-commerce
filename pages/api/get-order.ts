import { OrderItem, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

async function getOrder(userId: string) {
  try {
    // orders테이블-나의 주문내역
    const orders = await prisma.orders.findMany({
      where: {
        userId: userId,
      },
    });

    let response = [];
    // orders안의 orderItemId로 orderItem을 꺼내고 products테이블에서 이미지 등 정보를 조합
    for (const order of orders) {
      let orderItems: OrderItem[] = [];
      for (const id of order.orderItemIds
        .split(",")
        .map((item) => Number(item))) {
        const res: OrderItem[] =
          await prisma.$queryRaw`SELECT i.id, quantity, amount, i.price, name, image_url, productId FROM OrderItem as i JOIN products as p ON i.productId=p.id WHERE i.id=${id}`;
        orderItems.push.apply(orderItems, res);
      }
      response.push({ ...order, orderItems });
    }

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
    res.status(200).json({ data: [], message: "no Session" });
    return;
  }

  try {
    const cart = await getOrder(String(session.user?.id));
    res.status(200).json({ data: cart, message: "success" });
  } catch (err) {
    res.status(400).json({ message: `Faeiled ${err}` });
  }
}
