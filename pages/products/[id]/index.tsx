import { products, Cart, OrderItem } from "@prisma/client";
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

  const [quantity, setQuantity] = useState(0);

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

  const { mutate: updateWish } = useMutation<unknown, unknown, string, any>(
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

        queryClient.setQueryData<string[]>(
          ["/api/get-wishlist"],
          (old: string[]) =>
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
        queryClient.invalidateQueries(["/api/get-wishlist"]);
      },
    }
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
    updateWish(String(productId));
  }, [session, productId, updateWish, router]);

  const { mutate: addCart } = useMutation<
    unknown,
    unknown,
    Omit<Cart, "id" | "userId">,
    any
  >(
    (item) =>
      fetch(`/api/add-cart`, {
        method: "POST",
        body: JSON.stringify({ item }),
      })
        .then((res) => res.json())
        .then(({ data }) => data),
    {
      onMutate: () => {
        queryClient.invalidateQueries(["/api/get-cart"]);
      },
      onSuccess: () => {
        const confirmCart = confirm("장바구니로 이동");
        confirmCart && router.push("/cart");
      },
    }
  );

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

  const validate = useCallback(
    (type: "cart" | "order") => {
      if (quantity === null || quantity === 0) {
        alert("최소 수량을 선택하세요.");
        return;
      }

      if (type === "cart") {
        addCart({
          productId: product.id,
          quantity: quantity,
          amount: product.price * quantity,
        });
      }

      if (type === "order") {
        addOrder([
          {
            productId: product.id,
            quantity: quantity,
            price: product.price,
            amount: product.price * quantity,
          },
        ]);
      }
    },
    [product, quantity, addCart, addOrder]
  );

  const onClickCart = useCallback(() => {
    if (session === null) {
      alert("로그인이 필요해요");
      router.push("/auth/login");
      return;
    }
    validate("cart");
  }, [session, router, validate]);

  const onChangeNum = useCallback((e: any) => {
    if (e.target.value < 0) {
      return;
    }
    setQuantity(Number(e.target.value));
  }, []);

  const onClickOrder = useCallback(() => {
    if (session === null) {
      alert("로그인이 필요해요");
      router.push("/auth/login");
      return;
    }
    validate("order");
  }, [session, router, validate]);

  return (
    <main className="mt-5 grid place-items-center">
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

        <div className="mt-1 mb-10 grid grid-rows-1 grid-cols-2 w-full text-xl">
          <span className="text-3xl text-pink-500 font-semibold">
            {product && product.name}
          </span>
          <div className="flex justify-end mb-2">
            <div
              className="flex hover:cursor-pointer border rounded-md mr-5 p-1 bg-gray-50 shadow-sm"
              onClick={onClickWish}
            >
              {isWished ? (
                <Image
                  className="mr-1"
                  src="/wishlist.svg"
                  alt="wish"
                  width={30}
                  height={30}
                />
              ) : (
                <Image
                  className="mr-1"
                  src="/no-wish.svg"
                  alt="no-wish"
                  width={30}
                  height={30}
                />
              )}
              <div>찜하기</div>
            </div>

            <div
              className="flex hover:cursor-pointer border rounded-md p-1 bg-gray-50 shadow-sm"
              onClick={onClickCart}
            >
              <Image
                className="mr-1"
                src="/cart.svg"
                alt="cart"
                width={25}
                height={25}
              />
              <div>장바구니</div>
            </div>
          </div>

          <div></div>

          <div
            className="mb-2 flex justify-end align-middle"
            onClick={onClickOrder}
          >
            <span className="border rounded-md py-1 px-20 bg-gray-50 shadow-sm hover:cursor-pointer">
              구매하기
            </span>
          </div>

          <div></div>

          <div className="flex justify-end">
            <div className="flex">
              <div className="mr-1">수량</div>
              <input
                className="w-9"
                type="number"
                value={quantity}
                onChange={onChangeNum}
              />
            </div>

            <span className="text-2xl text-gray-400 font-semibold">
              {product && product.price?.toLocaleString("ko-KR")}원
            </span>
          </div>
        </div>
      </div>

      <div className="mb-5 text-2xl">{product && product.contents}</div>
    </main>
  );
}
