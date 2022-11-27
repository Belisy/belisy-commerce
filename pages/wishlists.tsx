import { products } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import WishListItem from "components/WishListItem";

export default function WishLists() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useQuery<{ items: products[] }, unknown, products[]>(
    ["/api/get-wishlists"],
    () =>
      fetch("/api/get-wishlists")
        .then((res) => res.json())
        .then(({ data }) => data)
  );
  console.log("위시리스트데이터들", data);

  return (
    <div className="mx-36">
      <div className="mb-1 text-2xl font-semibold">
        WishList ({data?.length})
      </div>
      <div className="">
        {data?.map((item) => (
          <div key={item.id} className="">
            <WishListItem {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
