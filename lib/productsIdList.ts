export async function loadProductsIdList() {
  const pathsList = await fetch(
    // `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/get-product?id=${context.params?.id}`
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/get-productsId`
  )
    .then((res) => res.json())
    .then(({ data }) => data);
  console.log("보기!", pathsList);

  const paths = pathsList.map((product: { id: string }) => ({
    params: {
      id: product.toString(),
    },
  }));
  console.log("알언", paths);
  return paths;
}
