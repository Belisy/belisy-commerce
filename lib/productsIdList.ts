import axios from "axios";

export async function loadProductsIdList() {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/get-productsId`
  );
  // .then((res) => res.json())
  // .then(({ data }) => data);

  console.log("5테스트", data);

  // const aa = data.map((product: { id: any }) => product.id);
  // console.log("에이", aa);

  let paths: any = [];

  // for (let product of res) {
  //   paths.push({ params: { id: product } });
  // }

  return data;
}
