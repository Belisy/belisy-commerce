export async function loadProductsIdList() {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/get-productsId`
  ).then((res) => res.text());

  console.log(JSON.parse(data));

  const products = JSON.parse(data).data;
  const productsIdList = products.map((product: { id: any }) =>
    String(product.id)
  );

  productsIdList.map((id: any) => ({ params: id }));

  return productsIdList;
}
