import { useEffect, useState } from "react";
import Carousel from "nuka-carousel";
import Image from "next/image";
import CustomEditor from "components/Editor";
import { useRouter } from "next/router";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { useQuery } from "@tanstack/react-query";

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const product = await fetch(
//     `http://localhost:3000/api/get-product?id=${context.params?.id}`
//   )
//     .then((res) => res.json())
//     .then(({ data }) => data);

//   return {
//     props: {
//       product,
//     },
//   };
// }

export default function Edit() {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const { id: productId } = router.query;
  const [editorState, setEditorState] = useState<EditorState | undefined>(
    EditorState.createEmpty()
  );

  const { data: product } = useQuery(["get-product"], () =>
    fetch(`/api/get-product?id=${productId}`)
      .then((res) => res.json())
      .then(({ data }) => data)
  );

  console.log("gg", product);

  useEffect(() => {
    if (productId !== null) {
      fetch(`/api/get-product?id=${productId}`)
        .then((res) => res.json())
        .then(({ data }) => {
          if (data?.contents) {
            setEditorState(
              EditorState.createWithContent(
                convertFromRaw(JSON.parse(data.contents))
              )
            );
          } else {
            setEditorState(EditorState.createEmpty());
          }
        });
    }
  }, [productId]);

  const handleSave = () => {
    if (editorState) {
      fetch(`/api/update-product`, {
        method: "POST",
        body: JSON.stringify({
          id: productId,
          contents: JSON.stringify(
            convertToRaw(editorState.getCurrentContent())
          ),
        }),
      })
        .then((res) => res.json())
        .then(() => {
          alert("update success");
        });
    }
  };

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
            wrapAround
            speed={3}
            slideIndex={index}
          >
            {imageArr.map((url, i) => (
              <Image
                key={`carousel-${i}`}
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
          </div>

          <div className="flex justify-end">
            <span className="text-gray-400 font-semibold">
              {product && product.price?.toLocaleString("ko-KR")}원
            </span>
          </div>
        </div>
      </div>

      {editorState !== null && (
        <CustomEditor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          onSave={handleSave}
        />
      )}
    </main>
  );
}
