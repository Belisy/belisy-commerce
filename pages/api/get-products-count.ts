import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getProductsCount(category: number, contains: string) {
  const containCondition =
    contains !== "" ? { name: { contains: contains } } : undefined;

  const where =
    category !== 0
      ? { category_id: category, ...containCondition }
      : containCondition
      ? containCondition
      : undefined;

  try {
    const response = await prisma.products.count({ where: where });
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
  try {
    const { category, contains } = req.query;
    const productsCount = await getProductsCount(
      Number(category),
      String(contains)
    );
    res.status(200).json({ data: productsCount, message: `Success` });
  } catch (err) {
    res.status(400).json({ message: `Failed ${err}` });
  }
}
