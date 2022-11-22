import { Cart, OrderItem, Orders } from "@prisma/client";

export interface CartItem extends Cart {
  name: string;
  price: number;
  image_url: string;
}

export interface OrderItemDetail extends OrderItem {
  name: string;
  image_url: string;
}

export interface OrderDetail extends Orders {
  orderItems: OrderItemDetail[];
}
