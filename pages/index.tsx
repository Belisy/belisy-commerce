import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { categories, products } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import useDebounce from "hooks/useDebounce";
import { GetStaticPropsContext } from "next";

export async function getStaticProps() {
  const categories = await fetch(
    `${process.env.NEXTAUTH_URL}/api/get-categories`
  )
    .then((res) => res.json())
    .then(({ data }) => data);

  return { props: { categories } };
}

// TODO: 코드 리팩토링 및 컴포넌트화 필요

export default function Home(props: { categories: categories[] }) {
  const router = useRouter();
  const filterRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState("");
  const [skip, setSkip] = useState(0);
  const [productsArr, setProductsArr] = useState<products[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [totalCount, setTotalCount] = useState();

  const debouncedKeyword = useDebounce<string>(keyword);
  const take = 8;
  const filters = useMemo(
    () => [
      { label: "최신순", value: "lagest" },
      { label: "가격 높은순", value: "expensive" },
      { label: "가격 낮은순", value: "cheap" },
    ],
    []
  );
  const currentFilter = filters.filter((el) => el.value === selectedFilter)[0];
  const currentFilterLabel = currentFilter?.label;
  // 필터별
  useEffect(() => {
    setSelectedFilter(filters[0].value);
  }, [filters]);

  // 전체상품
  useEffect(() => {
    setSkip(0);
    setProductsArr([]);
    fetch(
      `/api/get-products?skip=0&take=${take}&orderBy=${selectedFilter}&category=${selectedCategory}&contains=${debouncedKeyword}`
    )
      .then((res) => res.json())
      .then(({ data }) => setProductsArr(data));
  }, [selectedFilter, selectedCategory, debouncedKeyword]);

  // 카테고리/검색어 별 상품수
  useEffect(() => {
    fetch(
      `/api/get-products-count?category=${selectedCategory}&contains=${debouncedKeyword}`
    )
      .then((res) => res.json())
      .then(({ data }) => setTotalCount(data));
  }, [selectedCategory, debouncedKeyword]);

  // 카테고리api불러오기
  const { categories } = props;

  // 검색
  const onChangeSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
    },
    []
  );
  const onClickReset = useCallback(() => {
    setKeyword("");
  }, []);
  // 필터
  const onChangeFilter = useCallback((e: any) => {
    const classlist = filterRef?.current?.classList;
    setSelectedFilter(e.target.id);
    classlist?.remove("block");
    classlist?.add("hidden");
  }, []);
  const onClickFilter = useCallback(() => {
    const classlist = filterRef?.current?.classList;
    if (classlist?.contains("hidden")) {
      classlist?.remove("hidden");
      classlist?.add("block");
    } else {
      classlist?.remove("block");
      classlist?.add("hidden");
    }
  }, []);
  // 카테고리
  const categoryList = categories.map((el) => el.name);

  const onClickCategory = useCallback((e: any) => {
    setSelectedCategory(Number(e.target.value));
  }, []);

  // 더보기-상품 더 불러오기
  const onClickMore = useCallback(() => {
    const next = skip + take;
    fetch(
      `/api/get-products?skip=${next}&take=${take}&orderBy=${selectedFilter}&category=${selectedCategory}&contains=${debouncedKeyword}`
    )
      .then((res) => res.json())
      .then(({ data }) => {
        const list = productsArr.concat(data);
        setProductsArr(list);
        // setProducts((prev) => [...prev, ...data]);
      });
    setSkip(next);
  }, [skip, productsArr, selectedFilter, selectedCategory, debouncedKeyword]);

  const categoryStyle =
    "btn-hover-pink hover:text-white hover:bg-pink-500 mx-2 px-1 hover:cursor-pointer border";

  return (
    <main className="">
      {/* 검색 */}
      <div className="flex mb-5 relative w-4/5 md:max-w-screen-md mx-auto">
        <input
          className="placeholder:italic w-full placeholder:text-pink-400 text-xs sm:text-base block bg-gray-50 border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-pink-500 focus:ring-pink-500 focus:ring-1 "
          ref={inputRef}
          value={keyword}
          onChange={onChangeSearch}
          placeholder="상품명을 검색해보세요"
        />
        {keyword.length > 0 && (
          <div className="flex justify-center absolute top-0 bottom-0 right-5">
            <Image
              className="hover:cursor-pointer sm:w-6"
              src="/resetBtn.svg"
              alt="검색창 초기화"
              width={20}
              height={20}
              onClick={onClickReset}
            />
          </div>
        )}
      </div>

      {/* filter */}
      <div className="flex justify-center align-middle mb-10">
        <div className="min-w-fit relative">
          <div
            className="flex mr-6 px-1 hover:cursor-pointer bg-gray-50 border rounded-md shadow-sm font-semibold text-gray-500"
            onClick={onClickFilter}
          >
            {currentFilterLabel}
            <Image
              src="/drop-down.svg"
              alt="filter"
              width={20}
              height={20}
              className="ml-1"
              priority
            />
          </div>

          <ul
            ref={filterRef}
            className="hidden absolute left-0 bg-gray-50 border rounded-md shadow-sm focus:outline-none focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
          >
            {filters.map((filter) => (
              <li
                key={filter.value}
                id={filter.value}
                onClick={onChangeFilter}
                className="w-full h-full rounded-md px-1 font-semibold text-gray-500 hover:cursor-pointer hover:text-pink-500"
              >
                {filter.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-auto">
          <ul className="flex min-w-max">
            <li
              className={`${categoryStyle} ${
                selectedCategory === 0 ? `selected-pink` : ``
              }`}
              value={0}
              onClick={onClickCategory}
            >
              전체
            </li>
            {categoryList &&
              categoryList.map((el, i) => (
                <li
                  key={`${i}-${el}`}
                  value={i + 1}
                  className={`${categoryStyle} ${
                    selectedCategory === i + 1 ? `selected-pink` : ``
                  }`}
                  onClick={onClickCategory}
                >
                  {el}
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div className="grid overflow-x-hidden gap-y-10 gap-x-5 sm:grid-cols-2 2sm:grid-cols-3 md:grid-cols-4">
        {productsArr &&
          productsArr.map((product, i) => (
            <div
              key={product.id}
              className="hover:cursor-pointer "
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <Image
                className="w-full"
                src={product.image_url ?? "/no-image.jpg"}
                alt={`${product.name}`}
                width={100}
                height={100}
                priority
                sizes="100vw"
              />
              <div className="flex justify-between align-middle">
                <div className="text-gray-500 font-semibold sm:text-md lg:text-lg">
                  {product.name}
                </div>
                <div className="my-auto sm:text-sm lg:text-md text-gray-500 font-medium flex justify-end">
                  {product.price?.toLocaleString("ko-KR")} 원
                </div>
              </div>
            </div>
          ))}
      </div>

      <button
        className={
          totalCount && totalCount > skip + take
            ? `btn-hover-pink w-full mx-auto mt-10 p-1 border-2`
            : "hidden"
        }
        onClick={onClickMore}
      >
        더보기
      </button>
    </main>
  );
}
