"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
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
import { authHelpers } from "@/store/auth-store";
import Logo from "@/assets/images/Logo_ZenKoi.png";

const registerSchema = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    username: z.string().min(3, "Tên người dùng phải có ít nhất 3 ký tự"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const result = await authHelpers.register(
        data.email,
        data.username,
        data.password,
      );

      if (result.success) {
        toast.success("Đăng ký thành công! Chào mừng bạn đến với ZenKoi.");
        // Redirect to customer dashboard
        window.location.href = "/customer/dashboard";
      } else {
        toast.error(result.error || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Register Form */}
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
                  Tạo tài khoản
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Tham gia cộng đồng yêu thích cá Koi cùng ZenKoi
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pt-1 relative z-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-foreground font-medium text-sm"
                  >
                    Địa chỉ Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email của bạn..."
                    {...register("email")}
                    className="bg-input/50 border-border/60 focus:ring-primary/30 focus:border-primary transition-all duration-200 h-10 px-3 hover:border-primary/50"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive font-medium flex items-center gap-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-foreground font-medium text-sm"
                  >
                    Họ và tên
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Nhập họ và tên..."
                    {...register("username")}
                    className="bg-input/50 border-border/60 focus:ring-primary/30 focus:border-primary transition-all duration-200 h-10 px-3 hover:border-primary/50"
                  />
                  {errors.username && (
                    <p className="text-xs text-destructive font-medium flex items-center gap-1">
                      {errors.username.message}
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

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-foreground font-medium text-sm"
                  >
                    Xác nhận mật khẩu
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu..."
                      {...register("confirmPassword")}
                      className="bg-input/50 border-border/60 focus:ring-primary/30 focus:border-primary pr-11 transition-all duration-200 h-10 px-3 hover:border-primary/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0.5 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-primary/10 rounded-md transition-all duration-200"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive font-medium flex items-center gap-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
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
                        Đang tạo tài khoản...
                      </div>
                    ) : (
                      "Đăng ký"
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Button>
              </form>

              {/* Google Register */}
              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  className="w-full bg-white/50 hover:bg-white/70 hover:text-black border-border/60 text-foreground font-medium py-2.5 h-10 transition-all duration-300 hover:scale-[1.02] hover:shadow-md relative overflow-hidden group disabled:opacity-50 disabled:scale-100"
                >
                  <div className="flex items-center justify-center gap-2.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Đăng ký với Google</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Button>
              </div>

              {/* Decorative divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/40"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground/70 font-medium">
                    hoặc đăng nhập
                  </span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  Đã có tài khoản?{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:text-accent font-semibold transition-all duration-200 hover:underline"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground/70 mt-2 leading-relaxed">
                  Bằng cách đăng ký, bạn đồng ý với điều khoản sử dụng của chúng
                  tôi
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
                Tham gia cộng đồng ZenKoi
              </h1>
              <p className="text-lg text-white/90 text-pretty leading-relaxed">
                Khởi đầu hành trình khám phá thế giới cá Koi với hệ thống quản
                lý hiện đại và công nghệ RFID tiên tiến
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
                    <span className="text-sm">Miễn phí tạo tài khoản</span>
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span className="text-sm">Bảo mật tuyệt đối</span>
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span className="text-sm">Trải nghiệm nhanh</span>
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
                  <div className="text-xs text-white/80">Thành viên</div>
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
