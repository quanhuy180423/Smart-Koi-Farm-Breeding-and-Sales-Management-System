import {
  RegisterRequest,
  RegisterResponse,
} from "@/lib/api/services/fetchAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import fetchAuth, {
  LoginRequest,
  LoginResponse,
} from "@/lib/api/services/fetchAuth";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/apiClient";
import { setCookie } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore, UserRole } from "@/store/auth-store";

// Register hook
export function useRegister() {
  // const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [keyVariable, setKeyVariable] = useState<string | null>(null);

  const {
    mutate: register,
    isPending: isLoading,
    error: registerError,
  } = useMutation({
    mutationFn: (data: RegisterRequest) => {
      // Lưu request data để sử dụng trong error handler
      return fetchAuth.register(data);
    },
    onSuccess: (response: RegisterResponse, variables: RegisterRequest) => {
      if (response.isSuccess) {
        setSuccess(true);
        setKeyVariable(variables.email);
        toast.success(response.message);
      } else {
        setError(response.message);
        toast.error(response.message);
      }
    },
    onError: (error: ApiError) => {
      if (error.error?.message) {
        toast.error(error.error.message);
      } else {
        const errorMessage = error.message || "Đăng kí thất bại";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
  });

  return {
    register,
    isLoading,
    error: error || registerError?.message || null,
    clearError: () => setError(null),
    registerSuccess: success,
    keyVariable,
    resetRegisterState: () => {
      setSuccess(false);
      setKeyVariable(null);
      setError(null);
    },
  };
}

// Login hook
export function useLogin() {
  const queryClient = useQueryClient();
  // auth-store currently manages user/role state; token persistence is handled here
  const [error, setError] = useState<string | null>(null);
  const [needsOtpVerification, setNeedsOtpVerification] = useState(false);
  const [verifyKey, setVerifyKey] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Small helper to build cookie options
  const getAuthCookieConfig = (rememberMe?: boolean) => {
    // If rememberMe set, keep cookie for 30 days, otherwise session cookie
    return rememberMe
      ? { path: "/", maxAge: 60 * 60 * 24 * 30 }
      : { path: "/" };
  };

  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: async (credentials?: LoginRequest) => {
      // Call the backend login endpoint
      // guard against undefined credentials when mutate() is called without vars
      const vars = credentials ?? ({} as LoginRequest);
      const response = await fetchAuth.login(vars);
      return response as LoginResponse;
    },
    onSuccess: (response: LoginResponse, variables?: LoginRequest) => {
      // Backend uses { isSuccess, message, result: { token, refreshToken }}
      if (response?.isSuccess) {
        const token = response.result?.token;
        const refreshToken = response.result?.refreshToken;

        if (token) {
          // Let the auth store decode the token, set user/role, and wire ApiService
          try {
            useAuthStore.getState().setToken(token);
            // Also persist raw token cookie for other uses (optional)
            setCookie("auth-token", token, getAuthCookieConfig(variables?.rememberMe));
          } catch (e) {
            console.warn("Failed to persist auth token via store", e);
          }

          if (refreshToken) {
            try {
              setCookie("refresh-token", refreshToken, getAuthCookieConfig(variables?.rememberMe));
            } catch (e) {
              console.warn("Failed to persist refresh token", e);
            }
          }

          // Invalidate queries
          queryClient.invalidateQueries({ queryKey: ["auth", "login"] });
          queryClient.invalidateQueries({ queryKey: ["users", "profile"] });
          setError(null);
          setNeedsOtpVerification(false);
          setVerifyKey(null);
          toast.success(response.message || "Đăng nhập thành công");

          const redirectTo = searchParams?.get("redirect");
          if (redirectTo) {
            (router as unknown as { push: (to: string) => void }).push(redirectTo);
            return;
          } else {
            // No redirect param, route user based on role decoded from token in the auth store
            const role = useAuthStore.getState().getUserRole();
            let destination = "/";
            switch (role) {
              case UserRole.MANAGER:
                destination = "/manager";
                break;
              case UserRole.SALE_STAFF:
                destination = "/sale";
                break;
              case UserRole.CUSTOMER:
                // Customers should land on the public homepage
                destination = "/";
                break;
              default:
                destination = "/";
            }
            (router as unknown as { push: (to: string) => void }).push(destination);
          }
          return;
        }
      }

      // Handle OTP scenarios if API signals it via message
      if (response?.message && /OTP|Mã OTP|đã được gửi|chưa được xác thực/i.test(response.message)) {
        setNeedsOtpVerification(true);
        setVerifyKey(variables?.userNameOrEmail || null);
        setError(null);
        return;
      }

      setError(response?.message || "Đăng nhập thất bại");
      toast.error(response?.message || "Đăng nhập thất bại");
    },
  onError: (error: ApiError, variables?: LoginRequest) => {
      // If ApiError contains validation errors, show them
      if (error?.error?.message) {
        toast.error(error.error.message);
      } else if (error?.message && /OTP|Mã OTP|đã được gửi|chưa được xác thực/i.test(error.message)) {
        setNeedsOtpVerification(true);
        setVerifyKey(variables?.userNameOrEmail || null);
        setError(null);
      } else {
        setError(error?.message || "Đăng nhập thất bại");
        toast.error(error?.message || "Đăng nhập thất bại");
      }
    },
  });

  return {
    login,
    isLoading,
    error,
    needsOtpVerification,
    verifyKey,
    clearError: () => setError(null),
    clearOtpState: () => {
      setNeedsOtpVerification(false);
      setVerifyKey(null);
    },
  };
}

// Google login hook (mirrors useLogin behavior but for Google idToken)
export function useGoogleLogin() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const getAuthCookieConfig = (rememberMe?: boolean) =>
    rememberMe ? { path: "/", maxAge: 60 * 60 * 24 * 30 } : { path: "/" };

  const { mutate: loginWithGoogleMutation, isPending: isLoading } = useMutation({
    mutationFn: async (data?: { idToken: string; rememberMe?: boolean }) => {
      const idToken = data?.idToken ?? "";
      const resp = await fetchAuth.authenGoogle({ idToken });
      return resp as LoginResponse;
    },
    onSuccess: (response: LoginResponse, variables?: { idToken: string; rememberMe?: boolean }) => {
      if (response?.isSuccess) {
        const token = response.result?.token;
        const refreshToken = response.result?.refreshToken;

        if (token) {
          try {
            useAuthStore.getState().setToken(token);
            setCookie("auth-token", token, getAuthCookieConfig(variables?.rememberMe));
          } catch (e) {
            console.warn("Failed to persist auth token via store", e);
          }

          if (refreshToken) {
            try {
              setCookie("refresh-token", refreshToken, getAuthCookieConfig(variables?.rememberMe));
            } catch (e) {
              console.warn("Failed to persist refresh token", e);
            }
          }

          queryClient.invalidateQueries({ queryKey: ["auth", "login"] });
          queryClient.invalidateQueries({ queryKey: ["users", "profile"] });
          toast.success(response.message || "Đăng nhập thành công");

          const redirectTo = searchParams?.get("redirect");
          if (redirectTo) {
            (router as unknown as { push: (to: string) => void }).push(redirectTo);
            return;
          }

          const role = useAuthStore.getState().getUserRole();
          let destination = "/";
          switch (role) {
            case UserRole.MANAGER:
              destination = "/manager";
              break;
            case UserRole.SALE_STAFF:
              destination = "/sale";
              break;
            case UserRole.CUSTOMER:
              destination = "/";
              break;
            default:
              destination = "/";
          }
          (router as unknown as { push: (to: string) => void }).push(destination);
        }
      } else {
        setError(response?.message || "Đăng nhập thất bại");
        toast.error(response?.message || "Đăng nhập thất bại");
      }
    },
    onError: (error: ApiError) => {
      if (error?.error?.message) {
        setError(error?.error?.message || "Đăng nhập thất bại");
        toast.error(error?.error?.message || "Đăng nhập thất bại");
      }
    },
  });

  return {
    loginWithGoogle: loginWithGoogleMutation,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

// Programmatic Google login helper (use outside of React hooks if you need)
export async function loginWithGoogle(idToken: string, rememberMe?: boolean) {
  try {
    const response = await fetchAuth.authenGoogle({ idToken });
    if (response?.isSuccess) {
      const token = response.result?.token;
      const refreshToken = response.result?.refreshToken;

      if (token) {
        // set store token
        useAuthStore.getState().setToken(token);
        // persist cookies
        const opts = rememberMe ? { path: '/', maxAge: 60 * 60 * 24 * 30 } : { path: '/' };
        try {
          setCookie('auth-token', token, opts);
        } catch {}
        if (refreshToken) {
          try {
            setCookie('refresh-token', refreshToken, opts);
          } catch {}
        }
      }
    }

    return response;
  } catch (e) {
    throw e;
  }
}

// Forgot password hook
export function useForgotPassword() {
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async (data: { email: string }) => {
      return await fetchAuth.forgotPassword(data);
    },
    onSuccess: (response: { statusCode: string; isSuccess: boolean; message: string; result?: { isSuccess?: boolean; message?: string } } ) => {
      if (response?.isSuccess) {
        const message = response?.result?.message || response?.message || "Yêu cầu khôi phục đã được gửi.";
        toast.success(message);
      } else {
        setError(response?.message || "Gửi email thất bại");
        toast.error(response?.message || "Gửi email thất bại");
      }
    },
    onError: (err: ApiError) => {
      if (err?.error?.message) {
        setError(err?.error?.message || "Gửi email thất bại");
        toast.error(err?.error?.message || "Gửi email thất bại");
      }
    },
  });

  return {
    forgotPassword: mutate,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
