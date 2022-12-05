import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getProductsId() {
  try {
    const response = await prisma.products.findMany({});
    console.log("1", response);
    return response;
  } catch (err) {
    console.log("2", err);
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
    console.log("3", productsIdList);
    res.status(200).json({ data: productsIdList, message: "Success" });
  } catch (err) {
    console.log("4", err);
    res.status(400).json({ message: `Failed : ${err}` });
  }
}
