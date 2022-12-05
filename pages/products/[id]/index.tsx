import { products, Cart, OrderItem } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loadProductsIdList } from "lib/productsIdList";
import { GetStaticPropsContext } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import Carousel from "nuka-carousel";
import { useCallback, useState } from "react";

export async function getStaticPaths() {
  const productsIdList = await loadProductsIdList();
  const paths = [];
  if (productsIdList) {
    for (let productId of productsIdList) {
      paths.push({ params: { id: productId } });
    }
  }

  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const product = await fetch(
    `${process.env.NEXTAUTH_URL}/api/get-product?id=${params?.id}`
  )
    .then((res) => res.json())
    .then(({ data }) => data);

  return { props: { product } };
}

export default function Product(props: { product: products }) {
  const [index, setIndex] = useState(0);

  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { product } = props;

  const { id: productId } = router.query;

  const [quantity, setQuantity] = useState(0);

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

        queryClient.setQueryData<string[]>(["/api/get-wishlist"], (old: any) =>
          old
            ? old.includes(String(productId))
              ? old.filter((id: any) => id !== String(productId))
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
    "https://picsum.photos/id/918/400/300/",
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
    <div className="mt-5 w-full 2sm:w-4/5 mx-auto">
      <div className="flex relative">
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
              className="w-4/5"
              src={url ?? ""}
              width={400}
              height={350}
              // sizes="(max-width: 768px) 64vw"
              alt="image"
              priority
            />
          ))}
        </Carousel>

        <div className="absolute right-0 w-1/5 h-full">
          {imageArr.map((img, i) => (
            <div
              className=""
              key={`${product?.name}-carousel-${i}`}
              onClick={() => setIndex(i)}
            >
              <Image
                className="hover:cursor-pointer w-full h-full"
                src={img ?? ""}
                alt={product?.name}
                width={500}
                height={400}
                priority
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-1 mb-10 ">
        <span className="text-xl sm:text-3xl text-pink-500 font-semibold">
          {product && product.name}
        </span>

        <div className="flex justify-end mb-2">
          <div className="btn-img mr-5" onClick={onClickWish}>
            <Image
              className="mr-1 w-5 sm:w-7 h-5 sm:h-7"
              src={isWished ? "/wishlist.svg" : "/no-wish.svg"}
              alt="wish"
              width={30}
              height={30}
            />
            <div className="detail-btn-text">찜하기</div>
          </div>

          <div className="btn-img" onClick={onClickCart}>
            <Image
              className="mr-1 w-5 sm:w-7 h-5 sm:h-7"
              src="/cart.svg"
              alt="cart"
              width={25}
              height={25}
            />
            <div className="detail-btn-text">장바구니</div>
          </div>
        </div>

        <div
          className="mb-2 flex justify-end align-middle"
          onClick={onClickOrder}
        >
          <span className="detail-btn-text w-3/5 md:max-w-screen-sm text-center border rounded-md py-1  bg-gray-50 shadow-sm hover:cursor-pointer">
            구매하기
          </span>
        </div>

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

          <span className="text-lg sm:text-xl md:text-2xl text-gray-400 font-semibold">
            {product && product.price?.toLocaleString("ko-KR")}원
          </span>
        </div>
      </div>

      <div className="detail-btn-text md:text-2xl mb-5 text-center">
        {product && product.contents}
      </div>
    </div>
  );
}
