"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
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
import Logo from "@/assets/images/Logo_ZenKoi.png";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      // TODO: Implement forgot password API call
      console.log("Forgot password data:", data);
      toast.success("Email khôi phục mật khẩu đã được gửi!");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Gửi email thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left Side - Success Message */}
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
                    Email đã được gửi!
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến email của bạn
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pt-1 relative z-10">
                <div className="space-y-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Vui lòng kiểm tra hộp thư và làm theo hướng dẫn. Không nhận được email? 
                      Kiểm tra thư mục spam hoặc thử lại sau vài phút.
                    </p>
                  </div>

                  <Button 
                    asChild 
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-2.5 h-10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 relative overflow-hidden group"
                  >
                    <Link href="/login">
                      <span className="relative z-10">Quay lại đăng nhập</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </Link>
                  </Button>
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
                  Khôi phục tài khoản
                </h1>
                <p className="text-lg text-white/90 text-pretty leading-relaxed">
                  Chúng tôi luôn sẵn sàng hỗ trợ bạn truy cập lại tài khoản ZenKoi một cách an toàn
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
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span className="text-sm">Bảo mật cao</span>
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm">Email nhanh chóng</span>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Forgot Password Form */}
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
                  Quên mật khẩu
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Nhập email để nhận hướng dẫn khôi phục mật khẩu
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pt-1 relative z-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium text-sm">
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
                      <span className="w-1 h-1 bg-destructive rounded-full"></span>
                      {errors.email.message}
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
                        Đang gửi...
                      </div>
                    ) : (
                      "Gửi mã OTP"
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Button>
              </form>

              {/* Decorative divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/40"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground/70 font-medium">hoặc</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  Quay lại{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:text-accent font-semibold transition-all duration-200 hover:underline"
                  >
                    Đăng nhập
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground/70 mt-2 leading-relaxed">
                  Hoặc{" "}
                  <Link
                    href="/register"
                    className="text-primary hover:text-accent font-medium transition-all duration-200 hover:underline"
                  >
                    tạo tài khoản mới
                  </Link>
                  {" "}nếu chưa có tài khoản
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
                Khôi phục mật khẩu dễ dàng
              </h1>
              <p className="text-lg text-white/90 text-pretty leading-relaxed">
                Đừng lo lắng! Chúng tôi sẽ giúp bạn lấy lại quyền truy cập vào tài khoản ZenKoi một cách nhanh chóng và an toàn
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span className="text-sm">Bảo mật cao</span>
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
                    <span className="text-sm">Nhanh chóng</span>
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm">Email tức thì</span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-xs text-white/80">Thành công</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">&lt;5min</div>
                  <div className="text-xs text-white/80">Thời gian</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-xs text-white/80">Hỗ trợ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
