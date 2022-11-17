import { products } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import Carousel from "nuka-carousel";
import { useState } from "react";

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
  const { id: productId } = router.query;

  // const { data: product2 } = useQuery(["get-product"], () =>
  //   fetch(`/api/get-product?id=${productId}`)
  //     .then((res) => res.json())
  //     .then(({ data }) => data)
  // );

  const { product } = props;
  const imageArr = [
    product?.image_url,
    "https://picsum.photos/id/1011/400/300/",
    "https://picsum.photos/id/912/400/300/",
  ];

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
              <span className="mr-3">찜하기</span>
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
