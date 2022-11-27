import { useEffect, useState, useCallback } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { products } from "@prisma/client";
import Image from "next/image";

const WishListItem = (props: products) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: deleteWish } = useMutation<unknown, unknown, string, any>(
    (productId) =>
      fetch(`/api/delete-wishlist`, {
        method: "POST",
        body: JSON.stringify({ productId }),
      })
        .then((res) => res.json())
        .then(({ data }) => data),
    {
      onMutate: async (productId) => {
        await queryClient.cancelQueries(["/api/get-wishlists"]);
        const previous = queryClient.getQueryData(["/api/get-wishlists"]);

        queryClient.setQueryData<products[]>(["/api/get-wishlists"], (old) =>
          old?.filter((p) => p.id !== Number(productId))
        );

        return { previous };
      },
      onError: async (error, _, context) => {
        queryClient.setQueryData(["/api/get-wishlists"], context.previous);
      },
      onSuccess: async () => {
        queryClient.invalidateQueries(["/api/get-wishlists"]);
      },
    }
  );

  const onClickDelete = useCallback(() => {
    deleteWish(String(props.id));
    console.log("프롭아이디", props.id);
    alert(`위시리스트에서 ${props.name}삭제`);
  }, [deleteWish, props.id, props.name]);

  return (
    <>
      <div className="flex relative">
        <Image
          className="hover:cursor-pointer"
          src={props.image_url ?? ""}
          alt={props.name}
          width={200}
          height={200}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8G7SqHgAGhwJqyab6lgAAAABJRU5ErkJggg=="
          onClick={() => {
            router.push(`/products/${props.id}`);
          }}
        />

        <div className="text-2xl font-bold text-pink-500  ml-3">
          {props.name}
        </div>

        <div className="">
          <Image
            className="flex absolute right-0 top-0 hover:cursor-pointer"
            src="/delete.svg"
            alt="delete"
            width={25}
            height={25}
            onClick={onClickDelete}
          />

          <div className="text-2xl font-bold text-pink-500 absolute right-0 bottom-0">
            {props.price.toLocaleString("ko-KR")}원
          </div>
        </div>
      </div>

      <div className="my-4 border border-gray-100 bg-gray-100"></div>
    </>
  );
};

export default WishListItem;
