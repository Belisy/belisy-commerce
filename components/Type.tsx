import { Cart } from "@prisma/client";

export interface CartItem extends Cart {
  name: string;
  price: number;
  image_url: string;
}
