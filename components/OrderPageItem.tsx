import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { OrderItemDetail } from "./Type";
import Image from "next/image";

const OrderPageItem = (props: OrderItemDetail) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number | undefined>(props.quantity);
  const [amount, setAmount] = useState<number>(props.amount);

  useEffect(() => {
    if (quantity !== null && quantity !== undefined) {
      setAmount(quantity * props.price);
    }
  }, [quantity, props.price]);

  return (
    <>
      <div className="flex relative">
        <Image
          className="hover:cursor-pointer w-20 sm:w-24 2sm:w-28 md:w-32 lg:w-40"
          src={props.image_url ?? ""}
          alt={props.name}
          width={200}
          height={200}
          sizes="20rem"
          priority
          onClick={() => {
            router.push(`/products/${props.productId}`);
          }}
        />
        <div className="relative ml-1">
          <div className="text-lg sm:text-xl md:text-2xl font-semibold text-pink-500">
            {props.name}
          </div>
          <div className="flex absolute bottom-0 w-auto min-w-max text-base 2sm:text-lg font-semibold">
            수량 {props.quantity}
          </div>
        </div>

        <div className="absolute bottom-0 right-0 w-auto text-base sm:text-lg 2sm:text-xl md:text2xl font-bold text-pink-500">
          {amount.toLocaleString("ko-KR")}원
        </div>
      </div>
      <div className="my-4 border border-gray-100 bg-gray-100"></div>
    </>
  );
};

export default OrderPageItem;
