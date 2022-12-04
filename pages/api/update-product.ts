import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateProduct(id: number, payload: any) {
  try {
    const { contents, name, image_url, price } = payload;
    console.log("유알엘!", image_url);
    const response = await prisma.products.update({
      where: {
        id: id,
      },
      data: {
        contents: contents,
        name: name,
        image_url: image_url,
        price: price,
      },
    });
    console.log("리스폰스1", response);
    return response;
  } catch (err) {
    console.log("에러", err);

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
    const { id, payload } = JSON.parse(req.body);
    if (id === null || payload === null) {
      res.status(400).json({ message: "no id or contents" });
    }
    const product = await updateProduct(Number(id), payload);
    console.log("리스폰스2", product);

    res.status(200).json({ data: product, message: "Success" });
  } catch (err) {
    console.log("리스폰스3", err);

    res.status(400).json({ message: `Failed ${err}` });
  }
}
