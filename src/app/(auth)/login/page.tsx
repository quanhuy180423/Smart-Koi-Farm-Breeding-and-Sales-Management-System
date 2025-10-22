"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
// search params are handled by the login hook; not needed here
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { useGoogleLogin, useLogin } from "@/hooks/useAuth";
import Logo from "@/assets/images/Logo_ZenKoi.png";
import {
  CredentialResponse,
  GoogleLogin,
} from "@react-oauth/google";

const loginSchema = z.object({
  userNameOrEmail: z.string().min(1, "Vui lòng nhập email hoặc username"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useLogin();

  const { loginWithGoogle: googleLogin } = useGoogleLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    // Call the login hook; it handles toasts, token persistence and redirect
    login({
      userNameOrEmail: data.userNameOrEmail,
      password: data.password,
      rememberMe: data.rememberMe,
    });
  };

  const handleGoogleLogin = (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      toast.error("Không lấy được token từ Google");
      return;
    }

    googleLogin({ idToken, rememberMe: false });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Login Form */}
        <div className="flex items-center justify-center p-4 lg:p-8 relative overflow-hidden bg-background">
          {/* Background effects for left side */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10"></div>

          {/* Floating koi fish animations for left side */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/4 left-1/6 w-8 h-4 bg-primary/10 rounded-full animate-pulse"
              style={{
                clipPath: "ellipse(70% 50% at 30% 50%)",
                animation: "float-koi-1 15s ease-in-out infinite",
              }}
            />
            <div
              className="absolute bottom-1/3 right-1/4 w-6 h-3 bg-accent/10 rounded-full animate-pulse"
              style={{
                clipPath: "ellipse(70% 50% at 30% 50%)",
                animation: "float-koi-3 18s ease-in-out infinite",
              }}
            />
          </div>

          <Card className="w-full max-w-md mx-auto bg-card/95 backdrop-blur-md border-border/60 shadow-2xl relative z-10 transition-all duration-500 hover:shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 rounded-2xl overflow-hidden">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <CardHeader className="text-center space-y-4 relative z-10">
              <Link href="/" className="flex justify-center mb-1 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-300"></div>
                  <Image
                    src={Logo}
                    alt="ZenKoi Logo"
                    width={80}
                    height={80}
                    className="w-20 h-20 object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Chào mừng trở lại
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Khám phá thế giới cá Koi tuyệt vời cùng ZenKoi
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pt-1 relative z-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="userNameOrEmail"
                    className="text-foreground font-medium text-sm"
                  >
                    Email hoặc Username
                  </Label>
                  <Input
                    id="userNameOrEmail"
                    type="text"
                    placeholder="Nhập email hoặc username..."
                    {...register("userNameOrEmail")}
                    className="bg-input/50 border-border/60 focus:ring-primary/30 focus:border-primary transition-all duration-200 h-10 px-3 hover:border-primary/50"
                  />
                  {errors.userNameOrEmail && (
                    <p className="text-xs text-destructive font-medium flex items-center gap-1">
                      {errors.userNameOrEmail?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-foreground font-medium text-sm"
                  >
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu..."
                      {...register("password")}
                      className="bg-input/50 border-border/60 focus:ring-primary/30 focus:border-primary pr-11 transition-all duration-200 h-10 px-3 hover:border-primary/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0.5 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-primary/10 rounded-md transition-all duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive font-medium flex items-center gap-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center space-x-1.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      {...register("rememberMe")}
                      className="w-3.5 h-3.5 rounded border-border/60 text-primary focus:ring-primary/30 transition-all duration-200"
                    />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                      Ghi nhớ đăng nhập
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-primary hover:text-accent font-medium transition-all duration-200 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-2.5 h-10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:scale-100 disabled:shadow-none relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        Đang đăng nhập...
                      </div>
                    ) : (
                      "Đăng nhập"
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Button>
              </form>

              {/* Google Login */}
              <div className="mt-4 flex justify-center w-full">
                <div className="w-full [&_button]:w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      toast.error("Đăng nhập Google thất bại");
                    }}
                    useOneTap={false}
                  />
                </div>
              </div>

              {/* Decorative divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/40"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground/70 font-medium">
                    hoặc đăng ký
                  </span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  Chưa có tài khoản?{" "}
                  <Link
                    href="/register"
                    className="text-primary hover:text-accent font-semibold transition-all duration-200 hover:underline"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground/70 mt-2 leading-relaxed">
                  Tham gia cộng đồng yêu thích cá Koi và khám phá những giống cá
                  quý hiếm
                </p>
              </div>
            </CardContent>

            {/* Bottom highlight */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>
          </Card>
        </div>

        {/* Right Side - Hero Image */}
        <div className="hidden lg:block relative bg-muted">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 z-10" />

          {/* Hero Image */}
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg"
            alt="Beautiful Japanese Koi fish swimming in clear pond"
            fill
            className="object-cover"
            priority
          />

          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/40 z-20" />

          {/* Floating koi fish animations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
            <div
              className="absolute top-1/6 right-1/4 w-16 h-8 bg-white/10 rounded-full animate-pulse"
              style={{
                clipPath: "ellipse(70% 50% at 30% 50%)",
                animation: "float-koi-1 20s ease-in-out infinite",
              }}
            />
            <div
              className="absolute top-1/2 left-1/6 w-12 h-6 bg-white/10 rounded-full animate-pulse"
              style={{
                clipPath: "ellipse(70% 50% at 30% 50%)",
                animation: "float-koi-2 25s ease-in-out infinite reverse",
              }}
            />
            <div
              className="absolute bottom-1/4 right-1/3 w-14 h-7 bg-white/10 rounded-full animate-pulse"
              style={{
                clipPath: "ellipse(70% 50% at 30% 50%)",
                animation: "float-koi-3 22s ease-in-out infinite",
              }}
            />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center p-12 z-40">
            <div className="text-center text-white space-y-6 max-w-lg">
              <h1 className="text-4xl font-bold text-balance leading-tight">
                Khám phá thế giới cá Koi tuyệt đẹp
              </h1>
              <p className="text-lg text-white/90 text-pretty leading-relaxed">
                Tham gia cộng đồng những người yêu thích cá Koi với hệ thống
                quản lý hiện đại và công nghệ RFID tiên tiến
              </p>

              {/* Features showcase */}
              <div className="pt-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-4 md:gap-6 text-white/90">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-secondary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm">Chất lượng Nhật Bản</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span className="text-sm">Công nghệ RFID</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="text-sm">Hỗ trợ 24/7</span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-xs text-white/80">Giống cá Koi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-xs text-white/80">Khách hàng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">15+</div>
                  <div className="text-xs text-white/80">Năm kinh nghiệm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
