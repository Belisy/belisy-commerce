import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { categories, products, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import useDebounce from "hooks/useDebounce";

// TODO: 코드 리팩토링 및 컴포넌트화 필요

export default function Home() {
  const router = useRouter();
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
  const { data: categories } = useQuery<
    { data: categories[] },
    unknown,
    categories[]
  >(
    ["get-categories"],
    () => fetch("/api/get-categories").then((res) => res.json()),
    { select: ({ data }) => data }
  );

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
    setSelectedFilter(e.target.value);
  }, []);
  // 카테고리
  const onClickCategory = useCallback((e: any) => {
    setSelectedCategory(Number(e.target.value));
    console.log("dd", e.target);
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
    "mx-2 px-1 hover:cursor-pointer border rounded-md bg-gray-50 shadow-sm font-semibold text-gray-500 hover:text-pink-500 hover:border-pink-500 hover:ring-pink-500 focus:ring-1";

  return (
    <main className="grid place-items-center">
      {/* 검색 */}
      <div className="flex mb-5 relative">
        <input
          className="placeholder:italic placeholder:text-pink-400 block bg-gray-50 w-80 border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-pink-500 focus:ring-pink-500 focus:ring-1 sm:text-sm"
          ref={inputRef}
          value={keyword}
          onChange={onChangeSearch}
          placeholder="상품명을 검색해보세요"
        />
        {keyword.length > 0 && (
          <SearchStyle>
            <Image
              className="hover:cursor-pointer"
              src="/resetBtn.svg"
              alt="검색창 초기화"
              width={20}
              height={20}
              onClick={onClickReset}
            />
          </SearchStyle>
        )}
      </div>

      {/* filter */}
      <select
        className="bg-gray-50 border rounded-md mb-5 shadow-sm focus:outline-none focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
        onChange={onChangeFilter}
        value={selectedFilter}
      >
        {filters.map((filter) => (
          <option key={filter.value} value={filter.value}>
            {filter.label}
          </option>
        ))}
      </select>

      <ul className="flex mb-10">
        <li className={categoryStyle} value={0} onClick={onClickCategory}>
          전체
        </li>
        {categories &&
          categories.map((el, i) => (
            <li
              key={`${i}-${el}`}
              value={el.id}
              className={categoryStyle}
              onClick={onClickCategory}
            >
              {el.name}
            </li>
          ))}
      </ul>

      <div className="grid overflow-x-hidden gap-y-10 gap-x-5 sm:grid-cols-2 md:grid-cols-4">
        {productsArr &&
          productsArr.map((product, i) => (
            <div
              key={product.id}
              className="hover:cursor-pointer"
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <Image
                className="w-full"
                src={product.image_url ?? ""}
                alt={`${product.name}`}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8G7SqHgAGhwJqyab6lgAAAABJRU5ErkJggg=="
                width={130}
                height={100}
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

      {totalCount && totalCount > skip + take ? (
        <button
          className="container mx-auto mt-10 p-1 bg-gray-50 shadow-sm text-gray-500 font-semibold border-2 rounded hover:border-pink-500 hover:text-pink-500"
          onClick={onClickMore}
        >
          더보기
        </button>
      ) : (
        ""
      )}
    </main>
  );
}

const SearchStyle = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  right: 5px;
  top: 0;
  bottom: 0;
`;
