export async function loadProductsIdList() {
  // const data = await fetch(
  //   `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/get-productsId`
  // ).then((res) => res.json());
  // .then(({ data }) => data);

  // console.log("5테스트", data);
  //const res = data.data;

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/get-productsId`
  ).then((res) => res.text()); // convert to plain text
  // .then((text) => console.log("제발요", text));

  console.log("옹", JSON.parse(data));

  const products = JSON.parse(data).data;
  console.log("asjdkljslf", products);
  const idArr = products.map((product: { id: any }) => String(product.id));
  console.log("리스트", idArr);

  idArr.map((id: any) => ({ params: id }));

  console.log("오잉", idArr);

  return idArr;
}
