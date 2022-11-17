import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";

export default function Google() {
  const googleId: string = process.env.NEXT_PUBLIC_GOOGLE_ID ?? "";

  return (
    <GoogleOAuthProvider clientId={googleId}>
      <div style={{ display: "flex" }}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
}
