"use client";

import { useState } from "react";
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
import { User, MapPin, Calendar, Camera, Save, Edit } from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
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
    console.log("Profile saved:", profileData);
    setIsEditing(false);
  };

  const customerStats = {
    totalOrders: 12,
    totalSpent: 180000000,
    memberSince: "2023",
    loyaltyPoints: 1250,
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
              <p className="text-muted-foreground">
                Quản lý thông tin tài khoản của bạn
              </p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Thông tin</TabsTrigger>
              <TabsTrigger value="address">Địa chỉ</TabsTrigger>
              <TabsTrigger value="preferences">Sở thích</TabsTrigger>
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
                        <Label htmlFor="fullName">Họ và tên</Label>
                        <Input
                          id="fullName"
                          value={profileData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) =>
                            handleInputChange("dateOfBirth", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Giới tính</Label>
                        <Select
                          value={profileData.gender}
                          onValueChange={(value) =>
                            handleInputChange("gender", value)
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
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
                      <Label htmlFor="bio">Giới thiệu bản thân</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        disabled={!isEditing}
                        rows={3}
                        placeholder="Chia sẻ về sở thích nuôi cá Koi của bạn..."
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
                        <Calendar className="h-5 w-5 text-primary" />
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
                        <span className="text-blue-600 font-bold text-xs">
                          ₫
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Tổng chi tiêu
                        </p>
                        <p className="font-semibold">
                          {formatPrice(customerStats.totalSpent)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 font-bold text-sm">
                          ★
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Điểm tích lũy
                        </p>
                        <p className="font-semibold">
                          {customerStats.loyaltyPoints} điểm
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Địa chỉ giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Địa chỉ cụ thể</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="Số nhà, tên đường"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="ward">Phường/Xã</Label>
                      <Input
                        id="ward"
                        value={profileData.ward}
                        onChange={(e) =>
                          handleInputChange("ward", e.target.value)
                        }
                        placeholder="Phường/Xã"
                      />
                    </div>
                    <div>
                      <Label htmlFor="district">Quận/Huyện</Label>
                      <Input
                        id="district"
                        value={profileData.district}
                        onChange={(e) =>
                          handleInputChange("district", e.target.value)
                        }
                        placeholder="Quận/Huyện"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Tỉnh/Thành phố</Label>
                      <Select
                        value={profileData.city}
                        onValueChange={(value) =>
                          handleInputChange("city", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tỉnh/thành" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hanoi">Hà Nội</SelectItem>
                          <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                          <SelectItem value="danang">Đà Nẵng</SelectItem>
                          <SelectItem value="haiphong">Hải Phong</SelectItem>
                          <SelectItem value="cantho">Cần Thơ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu địa chỉ
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Sở thích cá Koi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">
                      Giống cá yêu thích
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {[
                        "Kohaku",
                        "Sanke",
                        "Showa",
                        "Tancho",
                        "Ogon",
                        "Asagi",
                        "Shusui",
                        "Bekko",
                      ].map((variety) => (
                        <Badge
                          key={variety}
                          variant="outline"
                          className="justify-center py-2"
                        >
                          {variety}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">
                      Kích thước ưa thích
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">20-30cm</Badge>
                      <Badge variant="default">30-40cm</Badge>
                      <Badge variant="outline">40cm+</Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">
                      Ngân sách thường xuyên
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">Dưới 10 triệu</Badge>
                      <Badge variant="default">10-20 triệu</Badge>
                      <Badge variant="outline">Trên 20 triệu</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Bảo mật tài khoản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">
                      Xác nhận mật khẩu mới
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Xác nhận mật khẩu mới"
                    />
                  </div>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Đổi mật khẩu
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
