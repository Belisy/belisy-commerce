import { useState, useEffect, useRef, useCallback } from "react";
import styles from "../styles/Home.module.css";
import { categories, products } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function Home() {
  const selectRef = useRef(null);
  const categoryRef = useRef(null);
  const [skip, setSkip] = useState(0);
  const [productsArr, setProductsArr] = useState<products[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const take = 9;
  const filters = [
    { label: "최신순", value: "lagest" },
    { label: "가격 높은순", value: "expensive" },
    { label: "가격 낮은순", value: "cheap" },
  ];
  useEffect(() => {
    setSelectedFilter(filters[0].value);
  }, []);

  // 전체상품 api불러오기
  useEffect(() => {
    fetch(
      `/api/get-products?skip=0&take=${take}&orderBy=${selectedFilter}&category=${selectedCategory}`
    )
      .then((res) => res.json())
      .then(({ data }) => setProductsArr(data));
    console.log("data데이타", productsArr);
  }, [selectedFilter, selectedCategory]);

  // 카테고리api불러오기
  const { data: categories } = useQuery<
    { data: categories[] },
    unknown,
    categories[]
  >(
    ["get-categories"],
    () => fetch("/api/get-categories").then((res) => res.json()),
    { select: ({ data }) => data }
  );
  console.log("로컬categories", categories);

  const onChangeFilter = useCallback((e: any) => {
    setSelectedFilter(e.target.value);
  }, []);

  const onClickCategory = useCallback((e: any) => {
    setSelectedCategory(Number(e.target.value));
  }, []);

  const onClickMore = useCallback(() => {
    const next = skip + take;
    fetch(
      `/api/get-products?skip=${next}&take=${take}&orderBy=${selectedFilter}&category=${selectedCategory}`
    )
      .then((res) => res.json())
      .then(({ data }) => {
        const list = productsArr.concat(data);
        setProductsArr(list);
        // setProducts((prev) => [...prev, ...data]);
      });
    setSkip(next);
  }, [skip, productsArr, selectedFilter, selectedCategory]);

  return (
    <div className="px-20 grid place-items-center">
      <main className={styles.main}>
        <input
          className="placeholder:italic placeholder:text-pink-400 block bg-gray-50 w-80 border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-pink-500 focus:ring-pink-500 focus:ring-1 sm:text-sm"
          placeholder="Search"
        />

        {/* filter */}
        <select
          className="bg-gray-50 border rounded-md my-3 shadow-sm focus:outline-none focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
          onChange={onChangeFilter}
          value={selectedFilter}
        >
          {filters.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>

        <div className="flex">
          <ul className="flex">
            <li
              className="mx-2 hover:cursor-pointer border rounded-md px-1 bg-gray-50 shadow-sm sm:text-sm font-semibold text-gray-500 hover:text-pink-500 hover:border-pink-500 hover:ring-pink-500 focus:ring-1"
              value={0}
              onClick={onClickCategory}
            >
              전체
            </li>
            {categories &&
              categories.map((el, i) => (
                <li
                  key={`${i}-${el}`}
                  value={el.id}
                  className="mx-2 hover:cursor-pointer border rounded-md px-1 bg-gray-50 shadow-sm sm:text-sm font-semibold text-gray-500 hover:text-pink-500 hover:border-pink-500 hover:ring-pink-500 focus:ring-1"
                  onClick={onClickCategory}
                >
                  {el.name}
                </li>
              ))}
          </ul>
        </div>

        <br />
        <br />

        <div className="grid overflow-x-hidden gap-y-10 gap-x-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
          {productsArr &&
            productsArr.map((product, i) => (
              <div key={product.id} className="hover:cursor-pointer">
                <Image
                  className="w-full"
                  src={product.image_url ?? ""}
                  alt={`${product.name}`}
                  width={100}
                  height={100}
                />
                <div className="text-gray-500 font-semibold">
                  {product.name}
                </div>
                <div className="text-ellipsis overflow-x-hidden text-sm">
                  {product.contents}
                </div>
                <div className="text-xs text-gray-500 font-medium flex justify-end">
                  {product.price?.toLocaleString("ko-KR")} 원
                </div>
              </div>
            ))}
        </div>

        <button
          className="container mx-auto px-4 bg-gray-50 shadow-sm text-gray-500 font-semibold border-2 rounded hover:border-pink-500 hover:text-pink-500"
          onClick={onClickMore}
        >
          더보기
        </button>
      </main>
    </div>
  );
}
