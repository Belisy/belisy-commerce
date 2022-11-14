import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getCategories() {
  try {
    const response = await prisma.categories.findMany({});
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
    const categories = await getCategories();
    res.status(200).json({ data: categories, message: "Success" });
  } catch (err) {
    res.status(400).json({ message: `Failed: ${err}` });
  }
}
