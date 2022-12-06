import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderDetail } from "components/Type";
import { format } from "date-fns";
import OrderPageItem from "components/OrderPageItem";
import Image from "next/image";
import { useCallback } from "react";
import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const cookie = context.req ? context.req.headers.cookie : "";
  const isUSer = cookie?.includes("session-token");

  if (!isUSer) {
    return {
      redirect: { destination: `${process.env.NEXTAUTH_URL}/auth/login` },
    };
  }

  return {
    props: { login: true },
  };
}

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
    <div className="w-full 2sm:w-4/5 mx-auto">
      <h1 className="mb-3 text-xl sm:text-2xl md:text-3xl lg:w-5/6 mx-auto font-semibold">
        주문내역 ({data?.length})
      </h1>

      <div>
        {data?.map((item, i) => (
          <div key={item.id}>
            <DetailItem key={i} {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}

const DetailItem = (props: OrderDetail) => {
  const queryClient = useQueryClient();

  const { mutate: deleteOrder } = useMutation<unknown, unknown, number, any>(
    (id) =>
      fetch(`/api/delete-order`, {
        method: "POST",
        body: JSON.stringify({ id }),
      })
        .then((res) => res.json())
        .then(({ data }) => data),
    {
      onMutate: async (id) => {
        await queryClient.cancelQueries(["/api/get-order"]);
        const previous = queryClient.getQueryData(["/api/get-order"]);

        queryClient.setQueryData<OrderDetail[]>(["/api/get-order"], (old) =>
          old?.filter((c) => c.id !== id)
        );

        return { previous };
      },
      onError: async (error, _, context) => {
        queryClient.setQueryData(["/api/get-order"], context.previous);
      },
      onSuccess: async () => {
        queryClient.invalidateQueries(["/api/get-order"]);
      },
    }
  );

  const onClickDelete = useCallback(() => {
    deleteOrder(props.id);
    alert(`구매내역에서 No.${props.id} 삭제`);
  }, [props.id, deleteOrder]);

  return (
    <div className="relative w-full lg:w-5/6 mx-auto border mb-5 p-4">
      <span className="min-w-fit max-h-fit mr-3 text-base lg:text-xl border rounded-md px-1 border-pink-500 bg-pink-500 text-white font-semibold">
        {ORDER_STATUS[props.status]}
      </span>
      <div className="flex flex-wrap mb-2">
        <div className="text-base sm:text-lg lg:text-xl mr-1">
          No.{props.id}
        </div>

        <div className="flex flex-wrap justify-between text-base sm:text-lg lg:text-xl">
          <div>주문 일자</div>
          <div className="pr-5">
            : {format(new Date(props.createdAt), "yyyy년 M월 d일 HH:mm:ss")}
          </div>
          <Image
            className="absolute right-4 hover:cursor-pointer w-5 h-5 sm:w-6 sm:h-6 my-auto"
            src="/delete.svg"
            alt="delete"
            width={25}
            height={25}
            onClick={onClickDelete}
          />
        </div>
      </div>

      <div>
        {props.orderItems.map((orderItem, i) => (
          <OrderPageItem key={i} {...orderItem} />
        ))}
      </div>

      <div className="text-base sm:text-lg lg:text-xl">
        <div>받는 사람 :{props.receiver ?? " 입력 필요"}</div>
        <div>주소 :{props.receiver ?? " 입력 필요"}</div>
        <div>연락처 :{props.receiver ?? " 입력 필요"}</div>
      </div>

      <div className="my-4 border border-gray-100 bg-gray-100"></div>

      <div className="flex relative text-base 2sm:text-lg md:text-xl font-semibold">
        <div className="">
          합계 금액 :{" "}
          {props.orderItems
            .map((item, i) => item.amount)
            .reduce((prev, curr) => prev + curr, 0)
            .toLocaleString("ko-kr")}{" "}
        </div>

        <button className="absolute right-0 bottom-0 border rounded-md min-w-fit max-h-fit px-3 py-1 border-pink-500 bg-pink-500 text-white font-semibold">
          {ORDER_STATUS[props.status] === "결제대기" || "주문대기"
            ? "결제하기"
            : "결제완료"}
        </button>
      </div>
    </div>
  );
};
