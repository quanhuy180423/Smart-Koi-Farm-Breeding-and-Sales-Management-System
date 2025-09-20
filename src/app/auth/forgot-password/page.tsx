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
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_ZenKoi-X95BEtPYa1RmHyORZJOM8kXYINBl2Z.png"
                alt="ZenKoi Logo"
                width={96}
                height={96}
                className="w-24 h-24 object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Email đã được gửi!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến email của bạn.
              Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Không nhận được email? Kiểm tra thư mục spam hoặc thử lại sau
                vài phút.
              </p>

              <Button asChild className="w-full">
                <Link href="/auth/sign-in">Quay lại đăng nhập</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_ZenKoi-X95BEtPYa1RmHyORZJOM8kXYINBl2Z.png"
              alt="ZenKoi Logo"
              width={96}
              height={96}
              className="w-24 h-24 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Quên mật khẩu
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email")}
                className="bg-input border-border focus:ring-ring focus:border-primary"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoading ? "Đang gửi..." : "Gửi hướng dẫn"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Quay lại{" "}
              <Link
                href="/auth/sign-in"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                đăng nhập
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
