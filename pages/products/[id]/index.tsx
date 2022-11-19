import { products } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import Carousel from "nuka-carousel";
import { useCallback, useState } from "react";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const product = await fetch(
    `http://localhost:3000/api/get-product?id=${context.params?.id}`
  )
    .then((res) => res.json())
    .then(({ data }) => data);

  return {
    props: {
      product,
    },
  };
}

export default function Product(props: { product: products }) {
  const [index, setIndex] = useState(0);

  //const [product, setProduct] = useState();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { product } = props;

  const { id: productId } = router.query;

  // const { data: product2 } = useQuery(["get-product"], () =>
  //   fetch(`/api/get-product?id=${productId}`)
  //     .then((res) => res.json())
  //     .then(({ data }) => data)
  // );

  const { data: wishlist } = useQuery(["/api/get-wishlist"], () =>
    fetch("/api/get-wishlist")
      .then((res) => res.json())
      .then(({ data }) => data)
  );
  console.log("33위시리스트", typeof wishlist, wishlist);
  const { mutate } = useMutation<unknown, unknown, string, any>(
    (productId: string) =>
      fetch("/api/update-wishlist", {
        method: "POST",
        body: JSON.stringify({ productId }),
      })
        .then((res) => res.json())
        .then(({ data }) => data),
    {
      onMutate: async (productId) => {
        await queryClient.cancelQueries(["/api/get-wishlist"]);
        const previous = queryClient.getQueryData(["/api/get-wishlist"]);

        queryClient.setQueryData<string[]>(["/api/get-wishlist"], (old) =>
          old
            ? old.includes(String(productId))
              ? old.filter((id) => id !== String(productId))
              : [...old, String(productId)] //old.concat(String(productId))
            : []
        );

        return { previous };
      },
      onError: (error, _, context) => {
        queryClient.setQueryData(["/api/get-wishlist"], context.previous);
      },
      onSuccess: () => {
        console.log("성공!");
        queryClient.invalidateQueries(["/api/get-wishlist"]);
        //queryClient.setQueryData(["/api/get-wishlist"]);
      },
    }
  );

  console.log(
    "123위시",
    typeof wishlist,
    wishlist,
    [wishlist],
    wishlist?.includes(String(productId))
  );
  const isWished =
    wishlist !== null && productId !== null
      ? wishlist?.includes(String(productId))
      : false;

  const imageArr = [
    product?.image_url,
    "https://picsum.photos/id/1011/400/300/",
    "https://picsum.photos/id/912/400/300/",
  ];

  const onClickWish = useCallback(() => {
    if (session === null) {
      alert("로그인이 필요해요");
      router.push("/auth/login");
      return;
    }
    mutate(String(productId));
  }, [session, productId, mutate, router]);

  return (
    <main className="my-20 px-20 grid place-items-center">
      <div>
        <div className="flex">
          <Carousel
            animation="fade"
            autoplay
            withoutControls
            wrapAround //무한히 슬라이드 돌아감
            speed={3}
            slideIndex={index}
          >
            {imageArr.map((url, i) => (
              <Image
                key={`${url}-carousel-${i}`}
                className="w-full"
                src={url ?? ""}
                width={400}
                height={350}
                alt="image"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8G7SqHgAGhwJqyab6lgAAAABJRU5ErkJggg=="
              />
            ))}
          </Carousel>

          <div>
            {imageArr.map((img, i) => (
              <div
                key={`${product?.name}-carousel-${i}`}
                onClick={() => setIndex(i)}
              >
                <Image
                  className="hover:cursor-pointer"
                  src={img ?? ""}
                  alt={product?.name}
                  width={1200}
                  height={1200}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8G7SqHgAGhwJqyab6lgAAAABJRU5ErkJggg=="
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10 grid grid-rows-2 w-full">
          <div className="grid grid-cols-2">
            <span className="text-lg text-gray-500 font-semibold">
              {product && product.name}
            </span>
            <div className="flex justify-end">
              {isWished ? (
                <button className="mr-3" onClick={onClickWish}>
                  찜해제
                </button>
              ) : (
                <button className="mr-3" onClick={onClickWish}>
                  찜하기
                </button>
              )}

              <span>장바구니</span>
            </div>
          </div>

          <div className="flex justify-end">
            <span className="text-gray-400 font-semibold">
              {product && product.price?.toLocaleString("ko-KR")}원
            </span>
          </div>
        </div>
      </div>

      <div className="mb-10 text-xl text-gray-500">
        {product && product.contents}
      </div>
    </main>
  );
}
