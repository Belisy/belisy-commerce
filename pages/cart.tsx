import { OrderItem } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Item from "components/CartPageItem";
import { CartItem } from "components/Type";
import { useMemo } from "react";
import { useRouter } from "next/router";

export default function CartPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useQuery<{ items: CartItem[] }, unknown, CartItem[]>(
    ["/api/get-cart"],
    () =>
      fetch("/api/get-cart")
        .then((res) => res.json())
        .then(({ data }) => data)
  );

  // 배달요금
  const deliveryAmount = data && data.length > 0 ? 3000 : 0;
  // 할인
  const discountAmount = 0;
  // 총 금액
  const amount = useMemo(() => {
    if (data === null) {
      return 0;
    }
    return data
      ?.map((item) => item.amount)
      .reduce((prev, current) => prev + current, 0);
  }, [data]);

  const { mutate: addOrder } = useMutation<
    unknown,
    unknown,
    Omit<OrderItem, "id">[],
    any
  >(
    (items) =>
      fetch(`/api/add-order`, {
        method: "POST",
        body: JSON.stringify({ items }),
      })
        .then((res) => res.json())
        .then(({ data }) => data),
    {
      onMutate: () => {
        queryClient.invalidateQueries(["/api/get-order"]);
      },
      onSuccess: () => {
        router.push("/order");
      },
    }
  );

  const onClickAddOrder = () => {
    if (data === null) {
      return;
    }

    const itemArr = data?.map((cart) => ({
      productId: cart.productId,
      quantity: cart.quantity,
      price: cart.price,
      amount: cart.amount,
    }));

    if (itemArr) {
      addOrder(itemArr);
    }

    alert(`장바구니에 담긴 상품 ${JSON.stringify(data)} 주문`);
  };

  return (
    <div className="w-full 2sm:w-4/5 mx-auto">
      <div className="mb-3 text-xl sm:text-2xl md:text-3xl font-semibold lg:w-5/6 mx-auto">
        Cart ({data?.length})
      </div>
      <div className="">
        {data?.map((item, i) => (
          <div key={item.id}>
            <Item {...item} />
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-3 font-bold text-xl sm:text-2xl md:text-3xl">
        <div className=" text-gray-600 mr-5">
          {amount?.toLocaleString("ko-KR")}원
        </div>
        <div
          className=" text-xl sm:text-2xl md:text-3xl text-pink-500 rounded-md px-1 py-1 bg-gray-50 shadow-sm hover:cursor-pointer border-pink-600 border-2 focus:ring-pink-600 focus:ring-1"
          onClick={onClickAddOrder}
        >
          전체 주문
        </div>
      </div>
    </div>
  );
}
