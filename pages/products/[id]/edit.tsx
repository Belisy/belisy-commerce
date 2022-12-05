import { products, Cart, OrderItem } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const product = await fetch(
    // `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/get-product?id=${context.params?.id}`
    `https://belisy-commerce.vercel.app/api/get-product?id=${context.params?.id}`
  )
    .then((res) => res.json())
    .then(({ data }) => data);
  const id = context.params?.id;
  return {
    props: {
      // id,
      product,
    },
  };
}

export default function Product(props: { product: products }) {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { product } = props;

  const [content, setContent] = useState(product.contents);
  const [price, setPrice] = useState(product.price);
  const [productName, setProductName] = useState(product.name);
  const [productImg, setProductImg] = useState(product.image_url);
  const [newImg, setNewImg] = useState();

  const { id: productId } = router.query;

  const { mutate: updateImg } = useMutation<unknown, unknown, any, any>(
    (newImg: string) =>
      fetch("/api/update-product", {
        method: "POST",
        body: JSON.stringify({
          id: productId,
          payload: {
            contents: content,
            name: productName,
            image_url: newImg,
            price: price,
          },
        }),
      })
        .then((res) => res.json())
        .then(({ data }) => data)
  );

  const handleSave = () => {
    // JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    const payload = {
      contents: content,
      name: productName,
      image_url: newImg,
      price: price,
    };

    fetch(`/api/update-product`, {
      method: "POST",
      body: JSON.stringify({
        id: productId,
        payload: payload,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("update success");
      });
  };

  const imageArr = useMemo(
    () => [
      newImg && URL.createObjectURL(newImg),
      productImg,
      "https://picsum.photos/id/1011/400/300/",
      "https://picsum.photos/id/912/400/300/",
      "https://picsum.photos/id/918/400/300/",
    ],
    [newImg, productImg]
  );

  console.log(imageArr);

  const onChangeImg = useCallback(
    (e: any) => {
      const imageLists = e.target.files[0];
      setNewImg(imageLists);
      updateImg(imageLists);
    },
    [updateImg]
  );

  const onClickDeleteImg = useCallback(
    (image: any, i: number) => {
      // 클라
      const deleteImg = imageArr.filter((el) => el !== image)[0];
      deleteImg && URL.revokeObjectURL(deleteImg);

      const newList = imageArr.filter((el) => el !== image);
      console.log("뉴", newList);
      // 서버
      // updateImg(newImg);
    },
    [imageArr]
  );

  const onChangeName = useCallback((e: any) => {
    setProductName(e.target.value);
  }, []);

  const onChangePrice = useCallback((e: any) => {
    setPrice(e.target.value);
  }, []);

  const onChangeContent = useCallback((e: any) => {
    setContent(e.target.value);
  }, []);

  return (
    <div className="mt-5 w-full 2sm:w-4/5 mx-auto">
      <div className="text-5xl mb-10">기능 추가중...</div>

      <div className="flex h-full">
        {/* 이미지 미리보기 */}
        {imageArr.map((img, i) => (
          <div
            className="relative"
            key={`${product?.name}-${i}`}
            onClick={() => setIndex(i)}
          >
            <Image
              src="/img-delete.svg"
              width={20}
              height={20}
              alt="이미지 삭제"
              className="absolute right-0"
              onClick={() => onClickDeleteImg(img, i)}
            />
            <Image
              className="hover:cursor-pointer w-full h-full"
              src={img ?? ""}
              alt={product?.name}
              width={500}
              height={400}
            />
          </div>
        ))}
      </div>

      <input
        type="file"
        accept="image/*"
        formEncType="multipart/form-data"
        onChange={onChangeImg}
        className="hover:cursor-pointer"
      />

      <div className="mt-1 mb-10 ">
        <span className="text-xl sm:text-3xl text-pink-500 font-semibold">
          <input
            type="text"
            value={productName}
            onChange={onChangeName}
            className="border"
          />
        </span>

        <div className="flex justify-end">
          <span className="text-lg sm:text-xl md:text-2xl text-gray-400 font-semibold">
            <input
              type="number"
              value={price}
              onChange={onChangePrice}
              className="border"
            />
            원
          </span>
        </div>
      </div>

      <div className="detail-btn-text md:text-2xl mb-5 text-center">
        <textarea
          autoFocus
          value={content ?? ""}
          onChange={onChangeContent}
          className="w-full focus border"
        />
      </div>
    </div>
  );
}
