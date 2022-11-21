import { Cart } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Item from "components/Item";
import { CartItem } from "components/Type";
import { useMemo, useEffect, useState, useCallback } from "react";

export default function CartPage() {
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

  return (
    <>
      <div>Cart ({data?.length})</div>
      <div>
        {data?.map((item, i) => (
          <div key={item.id}>
            <Item {...item} />
          </div>
        ))}
      </div>
      <div>{amount}원</div>
    </>
  );
}
