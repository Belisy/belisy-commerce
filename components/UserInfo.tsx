import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback } from "react";

export default function UserInfo() {
  const { data: session } = useSession();
  const router = useRouter();

  const onClickCart = useCallback(() => {
    if (!session) {
      const noSession = confirm("로그인이 필요합니다");
      noSession && router.push("/auth/login");
      return;
    }
    router.push("/cart");
  }, [session, router]);
  const onClickWish = useCallback(() => {
    if (!session) {
      const noSession = confirm("로그인이 필요합니다");
      noSession && router.push("/auth/login");
      return;
    }
    router.push("/wishlists");
  }, [session, router]);
  const onClickOrder = useCallback(() => {
    if (!session) {
      const noSession = confirm("로그인이 필요합니다");
      noSession && router.push("/auth/login");
      return;
    }
    router.push("/order");
  }, [session, router]);

  return (
    <div className="text-right">
      <div className="flex justify-end">
        <Image
          className="mr-1 cursor-pointer"
          src="/home.svg"
          alt="home"
          width={25}
          height={25}
          priority
          onClick={() => router.push("/")}
        />
        <Image
          className="mr-1 cursor-pointer"
          src="/cart.svg"
          alt="cart"
          width={25}
          height={25}
          priority
          onClick={onClickCart}
        />
        <Image
          className="cursor-pointer"
          src="/wishlist.svg"
          alt="wish"
          width={25}
          height={25}
          priority
          onClick={onClickWish}
        />
        <Image
          className="mr-1 cursor-pointer"
          src="/order-page.svg"
          alt="order"
          width={25}
          height={25}
          priority
          onClick={onClickOrder}
        />
      </div>
      {session ? (
        <>
          <p>안녕하세요. {session.user?.name}님</p>
          <p>즐거운 쇼핑 되세요</p>
          <button
            className="border rounded-md bg-gray-50 shadow-sm border-gray-500 px-1"
            onClick={() => router.push("/auth/login")}
          >
            로그아웃
          </button>
        </>
      ) : (
        <>
          <p>로그인을 해보세요</p>
          <button
            className="border rounded-md bg-gray-50 shadow-sm border-pink-500 px-1"
            onClick={() => router.push("/auth/login")}
          >
            로그인
          </button>
        </>
      )}
    </div>
  );
}
