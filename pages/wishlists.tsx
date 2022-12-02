import { products } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import WishListItem from "components/WishListItem";

export default function WishLists() {
  const { data } = useQuery<{ items: products[] }, unknown, products[]>(
    ["/api/get-wishlists"],
    () =>
      fetch("/api/get-wishlists")
        .then((res) => res.json())
        .then(({ data }) => data)
  );

  return (
    <div className="w-full 2sm:w-4/5 mx-auto">
      <div className="mb-3 text-xl sm:text-2xl md:text-3xl font-semibold  lg:w-5/6 mx-auto">
        WishList ({data?.length})
      </div>
      <div>
        {data?.map((item) => (
          <div key={item.id} className="">
            <WishListItem {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
