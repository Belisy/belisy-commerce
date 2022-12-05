export async function loadProductsIdList() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/get-productsId`)
    .then((res) => res.json())
    .then(({ data }) => data);

  let paths: any = [];

  for (let product of res) {
    paths.push({ params: { id: String(product.id) } });
  }

  return paths;
}
