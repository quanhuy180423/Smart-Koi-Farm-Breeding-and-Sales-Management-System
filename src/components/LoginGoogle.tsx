import { useGoogleLogin } from "@/hooks/useAuth";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

export default function LoginGoogle() {
  const { mutate: googleLogin } = useGoogleLogin();

  const handleGoogleLogin = (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      toast.error("Không lấy được token từ Google");
      return;
    }

    googleLogin({ idToken, rememberMe: false });
  };
  return (
    <div className="mt-4 flex justify-center w-full">
      <div className="w-full">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            toast.error("Đăng nhập Google thất bại");
          }}
          useOneTap={false}
          width={"100%"}
        />
      </div>
    </div>
  );
}
