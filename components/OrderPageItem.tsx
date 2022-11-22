import { useEffect, useState, useCallback } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { OrderItemDetail } from "./Type";
import { Cart } from "@prisma/client";
import Image from "next/image";

const OrderPageItem = (props: OrderItemDetail) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState<number | undefined>(props.quantity);
  const [amount, setAmount] = useState<number>(props.amount);

  useEffect(() => {
    if (quantity !== null && quantity !== undefined) {
      setAmount(quantity * props.price);
    }
  }, [quantity, props.price]);

  return (
    <div className="grid grid-cols-[200px_minmax(200px,_1fr)_100px]">
      {/* <Image /> */}
      <Image
        className="hover:cursor-pointer"
        src={props.image_url ?? ""}
        alt={props.name}
        width={200}
        height={200}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8G7SqHgAGhwJqyab6lgAAAABJRU5ErkJggg=="
        onClick={() => {
          router.push(`/products/${props.productId}`);
        }}
      />
      <div className="ml-3 mr-40 relative">
        <div className="text-2xl font-semibold text-pink-500">{props.name}</div>
      </div>

      <div className="relative">
        <div className="absolute bottom-0 text-2xl font-bold text-pink-500">
          {amount.toLocaleString("ko-KR")}원
        </div>
      </div>
    </div>
  );
};

export default OrderPageItem;
