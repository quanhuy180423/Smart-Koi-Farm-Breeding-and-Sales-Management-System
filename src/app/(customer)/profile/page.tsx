"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Camera,
  Save,
  Edit,
  Loader2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { useChangePassword } from "@/hooks/useAuth";
import { DatePickerFilter } from "@/components/ui/DatePickerFilter";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmedNewPassword: "",
  });

  const handlePasswordFormReset = useCallback(() => {
    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmedNewPassword: "",
    });
  }, []);

  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword(handlePasswordFormReset);

  const [profileData, setProfileData] = useState({
    fullName: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "0123456789",
    dateOfBirth: "1990-01-15",
    gender: "male",
    address: "123 Đường ABC",
    ward: "Phường 1",
    district: "Quận 1",
    city: "hcm",
    bio: "Người yêu thích cá Koi và có kinh nghiệm nuôi cá hơn 5 năm.",
    avatar: "/user-avatar.jpg",
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false);
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = () => {
    // Validate form
    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmedNewPassword
    ) {
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmedNewPassword) {
      return;
    }

    // Call API - form sẽ được reset tự động khi success
    changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
      confirmedNewPassword: passwordForm.confirmedNewPassword,
    });
  };

  const customerStats = {
    totalOrders: 12,
    totalSpent: 180000000,
    memberSince: "2023",
    loyaltyPoints: 1250,
  };

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
            <p className="text-muted-foreground">
              Quản lý thông tin tài khoản của bạn
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-3">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Thông tin</TabsTrigger>
            <TabsTrigger value="security">Bảo mật</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      isEditing ? handleSave() : setIsEditing(true)
                    }
                  >
                    {isEditing ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Lưu
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          src={profileData.avatar || "/placeholder.svg"}
                          alt="Avatar"
                        />
                        <AvatarFallback>
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-transparent"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {profileData.fullName}
                      </h3>
                      <p className="text-muted-foreground">
                        {profileData.email}
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        Khách hàng thân thiết
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName" className="mb-2">
                        Họ và tên
                      </Label>
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        disabled={!isEditing}
                        className="border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="mb-2">
                        Số điện thoại
                      </Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        disabled={!isEditing}
                        className="border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="mb-2">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!isEditing}
                        className="border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth" className="mb-2">
                        Ngày sinh
                      </Label>
                      {isEditing ? (
                        <DatePickerFilter
                          label="Chọn ngày..."
                          value={profileData.dateOfBirth}
                          onChange={(value) =>
                            handleInputChange("dateOfBirth", value)
                          }
                        />
                      ) : (
                        <div className="border-2 border-border rounded-md px-3 py-2 text-sm bg-muted/50">
                          {profileData.dateOfBirth
                            ? new Date(
                                profileData.dateOfBirth,
                              ).toLocaleDateString("vi-VN")
                            : "Chưa có"}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="gender" className="mb-2">
                        Giới tính
                      </Label>
                      <Select
                        value={profileData.gender}
                        onValueChange={(value) =>
                          handleInputChange("gender", value)
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="border-2 border-border hover:border-primary/50 focus:border-primary transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Nam</SelectItem>
                          <SelectItem value="female">Nữ</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio" className="mb-2">
                      Giới thiệu bản thân
                    </Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="Chia sẻ về sở thích nuôi cá Koi của bạn..."
                      className="border-2 border-border hover:border-primary/50 focus:border-primary transition-colors resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê tài khoản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Thành viên từ
                      </p>
                      <p className="font-semibold">
                        {customerStats.memberSince}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">
                        {customerStats.totalOrders}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tổng đơn hàng
                      </p>
                      <p className="font-semibold">
                        {customerStats.totalOrders} đơn
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xs">₫</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tổng chi tiêu
                      </p>
                      <p className="font-semibold">
                        {formatCurrency(customerStats.totalSpent)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Bảo mật tài khoản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="currentPassword" className="mb-2">
                      Mật khẩu hiện tại
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Nhập mật khẩu hiện tại"
                      value={passwordForm.oldPassword}
                      onChange={(e) =>
                        handlePasswordChange("oldPassword", e.target.value)
                      }
                      disabled={isChangingPassword}
                      className="border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="mb-2">
                      Mật khẩu mới
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                      disabled={isChangingPassword}
                      className="border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="mb-2">
                      Xác nhận mật khẩu mới
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Xác nhận mật khẩu mới"
                      value={passwordForm.confirmedNewPassword}
                      onChange={(e) =>
                        handlePasswordChange(
                          "confirmedNewPassword",
                          e.target.value,
                        )
                      }
                      disabled={isChangingPassword}
                      className="border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleChangePassword}
                  disabled={
                    isChangingPassword ||
                    !passwordForm.oldPassword ||
                    !passwordForm.newPassword ||
                    !passwordForm.confirmedNewPassword ||
                    passwordForm.newPassword !==
                      passwordForm.confirmedNewPassword
                  }
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Đổi mật khẩu
                    </>
                  )}
                </Button>
                {passwordForm.newPassword &&
                  passwordForm.confirmedNewPassword &&
                  passwordForm.newPassword !==
                    passwordForm.confirmedNewPassword && (
                    <p className="text-sm text-red-500">
                      Mật khẩu mới không khớp với xác nhận
                    </p>
                  )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CustomerLayout>
  );
}
