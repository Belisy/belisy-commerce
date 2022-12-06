import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getProducts(
  skip: number,
  take: number,
  orderBy: string,
  category: number,
  contains: string
) {
  const getOrderBy = (orderBy?: string) => {
    return orderBy
      ? orderBy === "latest"
        ? { orderBy: { createdAt: "desc" } }
        : orderBy === "expensive"
        ? { orderBy: { price: "desc" } }
        : { orderBy: { price: "asc" } }
      : undefined;
  };
  const orderByCondition = getOrderBy(orderBy);

  const containCondition =
    contains !== "" ? { name: { contains: contains } } : undefined;

  const where =
    category !== 0
      ? { category_id: category, ...containCondition }
      : containCondition
      ? containCondition
      : undefined;

  try {
    const response = await prisma.products.findMany({
      skip: skip,
      take: take,
      where: where,
      ...orderByCondition,
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
  const { skip, take, orderBy, category, contains } = req.query;
  if (skip === null || take === null) {
    res.status(400).json({ message: "no skip or take" });
  }
  try {
    const products = await getProducts(
      Number(skip),
      Number(take),
      String(orderBy),
      Number(category),
      contains ? String(contains) : ""
    );
    res.status(200).json({ data: products, message: "Success" });
  } catch (err) {
    res.status(400).json({ message: `Failed : ${err}` });
  }
}
