import { useState, useEffect, useRef, useCallback } from "react";
import styled from "@emotion/styled";
import { categories, products } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import useDebounce from "hooks/useDebounce";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState("");
  const [skip, setSkip] = useState(0);
  const [productsArr, setProductsArr] = useState<products[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [totalCount, setTotalCount] = useState();

  const debouncedKeyword = useDebounce<string>(keyword);
  const take = 8;
  const filters = [
    { label: "최신순", value: "lagest" },
    { label: "가격 높은순", value: "expensive" },
    { label: "가격 낮은순", value: "cheap" },
  ];
  // 필터별
  useEffect(() => {
    setSelectedFilter(filters[0].value);
  }, []);

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

    console.log("22data데이타", productsArr);
    console.log("11토탈개수", totalCount);
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
  console.log("로컬categories", categories);

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
    console.log("33더보기데이타", productsArr);
  }, [skip, productsArr, selectedFilter, selectedCategory]);

  const categoryStyle =
    "mx-2 px-1 hover:cursor-pointer border rounded-md bg-gray-50 shadow-sm font-semibold text-gray-500 hover:text-pink-500 hover:border-pink-500 hover:ring-pink-500 focus:ring-1";

  return (
    <main className="my-20 px-20 grid place-items-center">
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
            <div key={product.id} className="hover:cursor-pointer">
              <Image
                className="w-full"
                src={product.image_url ?? ""}
                // src={
                //   product.image_url !== undefined
                //     ? product.image_url
                //     : "/image_icon_50366.png"
                // }
                alt={`${product.name}`}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8G7SqHgAGhwJqyab6lgAAAABJRU5ErkJggg=="
                width={100}
                height={100}
              />
              <div className="text-gray-500 font-semibold">{product.name}</div>
              <div className="text-ellipsis overflow-x-hidden text-sm">
                {product.contents}
              </div>
              <div className="sm:text-xs lg:text-md text-gray-500 font-medium flex justify-end">
                {product.price?.toLocaleString("ko-KR")} 원
              </div>
            </div>
          ))}
      </div>

      {console.log("테스트skip + take", skip, take)}
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
