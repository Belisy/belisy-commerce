import { useEffect, useState, useCallback } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { CartItem } from "./Type";
import { Cart } from "@prisma/client";
import Image from "next/image";

const CartPageItem = (props: CartItem) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState<number | undefined>(props.quantity);
  const [amount, setAmount] = useState<number>(props.amount);
  useEffect(() => {
    if (quantity !== null && quantity !== undefined) {
      setAmount(quantity * props.price);
    }
  }, [quantity, props.price]);

  const { mutate: updateCart } = useMutation<unknown, unknown, Cart, any>(
    (item) =>
      fetch("/api/update-cart", {
        method: "POST",
        body: JSON.stringify({ item }),
      })
        .then((res) => res.json())
        .then(({ data }) => data),
    {
      onMutate: async (item) => {
        await queryClient.cancelQueries(["/api/get-cart"]);
        const previous = queryClient.getQueryData(["/api/get-cart"]);

        queryClient.setQueryData<Cart[]>(["/api/get-cart"], (old) =>
          old?.filter((c) => c.id !== item.id).concat(item)
        );

        return { previous };
      },
      onError: async (error, _, context) => {
        queryClient.setQueryData(["/api/get-cart"], context.previous);
      },
      onSuccess: async () => {
        queryClient.invalidateQueries(["/api/get-cart"]);
      },
    }
  );

  const { mutate: deleteCart } = useMutation<unknown, unknown, number, any>(
    (id) =>
      fetch(`/api/delete-cart`, {
        method: "POST",
        body: JSON.stringify({ id }),
      })
        .then((res) => res.json())
        .then(({ data }) => data),
    {
      onMutate: async (id) => {
        await queryClient.cancelQueries(["/api/get-cart"]);
        const previous = queryClient.getQueryData(["/api/get-cart"]);

        queryClient.setQueryData<Cart[]>(["/api/get-cart"], (old) =>
          old?.filter((c) => c.id !== id)
        );

        return { previous };
      },
      onError: async (error, _, context) => {
        queryClient.setQueryData(["/api/get-cart"], context.previous);
      },
      onSuccess: async () => {
        queryClient.invalidateQueries(["/api/get-cart"]);
      },
    }
  );

  const onClickUpdate = useCallback(() => {
    if (quantity === null || quantity === undefined || quantity === 0) {
      alert("최소 수량을 선택하세요.");
      return;
    }
    updateCart({
      ...props,
      quantity: quantity,
      amount: props.price * quantity,
    });
  }, [quantity, updateCart, props]);

  const onClickDelete = useCallback(() => {
    deleteCart(props.id);
    alert(`장바구니에서 ${props.name} 삭제`);
  }, [deleteCart, props.id, props.name]);

  const onChangeNum = useCallback((e: any) => {
    if (e.target.value < 0) {
      return;
    }
    setQuantity(Number(e.target.value));
  }, []);
  return (
    <>
      <div className="flex w-full lg:w-5/6 relative mx-auto">
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

        <div className="ml-3 relative">
          <div className="text-lg sm:text-xl 2sm:text-2xl lg:text-3xl font-semibold text-pink-500">
            {props.name}
          </div>
          <div className="flex absolute bottom-0 w-auto min-w-max text-base sm:text-lg lg:text-xl">
            수량
            <input
              className="w-7"
              type="number"
              value={quantity}
              onChange={onChangeNum}
            />
            <Image
              className="hover:cursor-pointer w-5 h-5 sm:w-6 sm:h-6 my-auto"
              src="/refresh.svg"
              alt="refresh"
              width={25}
              height={25}
              onClick={onClickUpdate}
            />
          </div>
        </div>

        <div className="w-auto">
          <Image
            className="hover:cursor-pointer w-5 h-5 sm:w-6 sm:h-6 my-auto absolute right-0 top-0"
            src="/delete.svg"
            alt="delete"
            width={25}
            height={25}
            onClick={onClickDelete}
          />

          <div className="absolute right-0 bottom-0 w-auto text-lg sm:text-xl 2sm:text-2xl font-bold text-pink-500">
            {amount?.toLocaleString("ko-KR")}원
          </div>
        </div>
      </div>

      <div className="my-4 border border-gray-100 bg-gray-100"></div>
    </>
  );
};

export default CartPageItem;
