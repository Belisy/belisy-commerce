import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getProductsId() {
  try {
    const products = await prisma.products.findMany({});
    const response = products.map((el) => el.id);
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
    const productsIdList = await getProductsId();
    res.status(200).json({ data: productsIdList, message: "Success" });
  } catch (err) {
    res.status(400).json({ message: `Failed : ${err}` });
  }
}
