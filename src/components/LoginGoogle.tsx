import { useGoogleLogin } from "@/hooks/useAuth";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";

export default function LoginGoogle() {
  const { mutate: googleLogin } = useGoogleLogin();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleGoogleLogin = (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      toast.error("Không lấy được token từ Google");
      return;
    }

    googleLogin({ idToken, rememberMe: false });
  };

  // Fix for GoogleLogin width issue when accounts are available
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      div[data-client_id] {
        width: 100% !important;
      }
      div[data-client_id] iframe {
        width: 100% !important;
      }
      div[data-client_id] > div {
        width: 100% !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="mt-4 flex justify-center w-full">
      <div ref={containerRef} className="w-full max-w-full overflow-x-auto">
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              toast.error("Đăng nhập Google thất bại");
            }}
            useOneTap={false}
            width={1000}
          />
        </div>
      </div>
    </div>
  );
}
