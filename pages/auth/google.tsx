import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";

export default function Google() {
  const googleId: string = process.env.NEXT_PUBLIC_GOOGLE_ID ?? "";

  return (
    <GoogleOAuthProvider clientId={googleId}>
      <div style={{ display: "flex" }}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log("데이터userDB저장", credentialResponse.credential);
            fetch(
              `/api/auth/sign-up?credential=${credentialResponse.credential}`
            )
              .then((res) => res.json())
              .then((data) => console.log("data", data));
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
}
