import { useEffect, useState, useCallback } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { CartItem } from "./Type";
import { Cart } from "@prisma/client";

const Item = (props: CartItem) => {
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
    console.log("수량", quantity);
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

  const onClickDelete = useCallback(async () => {
    await deleteCart(props.id);
    alert(`장바구니에서 ${props.name} 삭제`);
  }, [deleteCart, props.id, props.name]);

  const onChangeNum = useCallback((e: any) => {
    if (e.target.value < 0) {
      return;
    }
    setQuantity(Number(e.target.value));
  }, []);
  return (
    <div>
      {/* <Image /> */}
      <div>{props.name}</div>
      <div className="">
        수량
        <input
          className="w-9"
          type="number"
          value={quantity}
          onChange={onChangeNum}
        />
      </div>
      <div>{quantity}</div>
      <div>{amount.toLocaleString("ko-KR")}원</div>
      <span onClick={onClickUpdate}>새로고침</span> /{" "}
      <span onClick={onClickDelete}>삭제</span>
      <div>{props.productId}</div>
      <br />
    </div>
  );
};

export default Item;
