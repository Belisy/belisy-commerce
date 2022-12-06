import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function GoogleLogin() {
  const router = useRouter();
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="grid grid-rows-2">
        <div className="mb-5">
          {session.user?.email} 으로 로그인이 되어있습니다.
          <br />
          <button
            className="font-semibold text-gray-400"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
        <button className="font-semibold" onClick={() => router.push("/")}>
          홈으로
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-2">
      <div className="mb-5">
        로그인을 해보세요.
        <br />
        <button
          className="font-semibold text-lg text-pink-500"
          onClick={() => signIn()}
        >
          Sign in
        </button>
      </div>
      <button
        className="font-semibold text-gray-400"
        onClick={() => router.push("/")}
      >
        홈으로
      </button>
    </div>
  );
}
