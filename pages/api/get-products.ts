import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getProducts() {
  try {
    const response = await prisma.products.findMany({});
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
    // const { category, orderBy, contains } = req.query;

    const products = await getProducts();
    res.status(200).json({ data: products, message: "Success" });
  } catch (err) {
    res.status(400).json({ message: `Failed : ${err}` });
  }
}
