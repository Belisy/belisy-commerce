import { Orders, OrderItem } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Item from "components/CartPageItem";
import { CartItem, OrderDetail } from "components/Type";
import { useMemo, useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import OrderPageItem from "components/OrderPageItem";

const ORDER_STATUS = [
  "주문취소",
  "주문대기",
  "결제대기",
  "결제완료",
  "배송대기",
  "배송중",
  "배송완료",
  "환불대기",
  "환불완료",
  "반품대기",
  "반품완료",
];

export default function OrderPage() {
  const { data } = useQuery<{ items: OrderDetail[] }, unknown, OrderDetail[]>(
    ["/api/get-order"],
    () =>
      fetch("/api/get-order")
        .then((res) => res.json())
        .then(({ data }) => data)
  );

  return (
    <>
      <h1>주문내역</h1>
      <div>Cart ({data?.length})</div>
      <div></div>
      <div>
        {data?.map((item, i) => (
          <div key={item.id}>
            <DetailItem key={i} {...item} />
          </div>
        ))}
      </div>
    </>
  );
}

const DetailItem = (props: OrderDetail) => {
  return (
    <div>
      <span>dd{ORDER_STATUS[props.status + 1]}</span>
      <div>삭제</div>
      <div>
        받는사람:{props.receiver ?? "입력필요"}
        <br />
        주소:
        <br />
        연락처:
      </div>
      <div>
        합계 금액:{" "}
        {props.orderItems
          .map((item, i) => item.amount)
          .reduce((prev, curr) => prev + curr, 0)
          .toLocaleString("ko-kr")}{" "}
      </div>
      <div>
        주문일자: {format(new Date(props.createdAt), "yyyy년 M월 d일 HH:mm:ss")}
      </div>
      {props.orderItems.map((orderItem, i) => (
        <OrderPageItem key={i} {...orderItem} />
      ))}

      <button>결제 처리</button>
    </div>
  );
};
