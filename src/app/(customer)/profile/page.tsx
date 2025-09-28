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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, MapPin, Calendar, Camera, Save, Edit, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import CustomerLayout from "@/components/customer/CustomerLayout";

type Address = {
  id: number;
  name: string;
  address: string;
  ward: string;
  city: string;
  isDefault: boolean;
};

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

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Nhà riêng",
      address: "123 Đường ABC",
      ward: "Phường 1",
      city: "TP. Hồ Chí Minh",
      isDefault: true,
    },
    {
      id: 2,
      name: "Công ty",
      address: "789 Đường XYZ",
      ward: "Phường 2",
      city: "TP. Hồ Chí Minh",
      isDefault: false,
    },
    {
      id: 3,
      name: "Nhà bố mẹ",
      address: "456 Đường DEF",
      ward: "Phường 5",
      city: "TP. Hồ Chí Minh",
      isDefault: false,
    },
  ]);

  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    name: "",
    address: "",
    ward: "",
    city: "hcm",
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log("Profile saved:", profileData);
    setIsEditing(false);
  };

  const handleSetDefault = (addressId: number) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      })),
    );
  };

  const handleDeleteAddress = (addressId: number) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
  };

  const handleEditAddress = (addressId: number) => {
    const address = addresses.find((addr) => addr.id === addressId);
    if (address) {
      setEditingAddress(address);
      setAddressForm({
        name: address.name,
        address: address.address,
        ward: address.ward,
        city: address.city === "TP. Hồ Chí Minh" ? "hcm" : address.city,
      });
      setIsAddressDialogOpen(true);
    }
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      name: "",
      address: "",
      ward: "",
      city: "hcm",
    });
    setIsAddressDialogOpen(true);
  };

  const handleSaveAddress = () => {
    const cityName =
      addressForm.city === "hcm" ? "TP. Hồ Chí Minh" : addressForm.city;

    if (editingAddress) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id
            ? { ...addr, ...addressForm, city: cityName }
            : addr,
        ),
      );
    } else {
      // Add new address
      const newAddress = {
        id: Math.max(...addresses.map((a) => a.id)) + 1,
        ...addressForm,
        city: cityName,
        isDefault: addresses.length === 0, // First address is default
      };
      setAddresses((prev) => [...prev, newAddress]);
    }

    setIsAddressDialogOpen(false);
    setEditingAddress(null);
  };

  const handleAddressFormChange = (field: string, value: string) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Thông tin</TabsTrigger>
            <TabsTrigger value="address">Địa chỉ</TabsTrigger>
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
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) =>
                          handleInputChange("dateOfBirth", e.target.value)
                        }
                        disabled={!isEditing}
                        className="border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                      />
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

          {/* Address Tab */}
          <TabsContent value="address">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Địa chỉ giao hàng</h3>
                  <p className="text-sm text-muted-foreground">
                    Quản lý các địa chỉ giao hàng của bạn
                  </p>
                </div>
                <Button onClick={handleAddNewAddress}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm địa chỉ mới
                </Button>
              </div>

              {/* Address Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {addresses.map((address) => (
                  <Card
                    key={address.id}
                    className={`relative ${address.isDefault ? "border-primary/50 bg-primary/5" : ""}`}
                  >
                    {address.isDefault && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="default" className="text-xs">
                          Mặc định
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin
                            className={`h-4 w-4 mt-1 flex-shrink-0 ${address.isDefault ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <div className="min-w-0">
                            <p className="font-medium">{address.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {address.address}, {address.ward}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          {address.isDefault ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleEditAddress(address.id)}
                              >
                                Chỉnh sửa
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAddress(address.id)}
                              >
                                Xóa
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleSetDefault(address.id)}
                              >
                                Đặt mặc định
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditAddress(address.id)}
                              >
                                Sửa
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAddress(address.id)}
                              >
                                Xóa
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Address Dialog */}
              <Dialog
                open={isAddressDialogOpen}
                onOpenChange={setIsAddressDialogOpen}
              >
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingAddress
                        ? "Chỉnh sửa địa chỉ"
                        : "Thêm địa chỉ mới"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="addressName" className="mb-2">
                        Tên địa chỉ
                      </Label>
                      <Input
                        id="addressName"
                        value={addressForm.name}
                        onChange={(e) =>
                          handleAddressFormChange("name", e.target.value)
                        }
                        placeholder="VD: Nhà riêng, Công ty, ..."
                        className="border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <Label htmlFor="addressStreet" className="mb-2">
                        Địa chỉ cụ thể
                      </Label>
                      <Input
                        id="addressStreet"
                        value={addressForm.address}
                        onChange={(e) =>
                          handleAddressFormChange("address", e.target.value)
                        }
                        placeholder="VD: 123 Đường ABC"
                        className="border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="addressWard" className="mb-2">
                          Phường/Xã
                        </Label>
                        <Input
                          id="addressWard"
                          value={addressForm.ward}
                          onChange={(e) =>
                            handleAddressFormChange("ward", e.target.value)
                          }
                          placeholder="VD: Phường 1"
                          className="border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <Label htmlFor="addressCity" className="mb-2">
                          Tỉnh/Thành phố
                        </Label>
                        <Select
                          value={addressForm.city}
                          onValueChange={(value) =>
                            handleAddressFormChange("city", value)
                          }
                        >
                          <SelectTrigger className="w-full border-2 border-border hover:border-primary/50 focus:border-primary transition-colors">
                            <SelectValue placeholder="Chọn tỉnh/thành" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hanoi">Hà Nội</SelectItem>
                            <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                            <SelectItem value="danang">Đà Nẵng</SelectItem>
                            <SelectItem value="haiphong">Hải Phòng</SelectItem>
                            <SelectItem value="cantho">Cần Thơ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSaveAddress}
                        className="flex-1"
                        disabled={
                          !addressForm.name ||
                          !addressForm.address ||
                          !addressForm.ward
                        }
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {editingAddress ? "Cập nhật" : "Thêm mới"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddressDialogOpen(false)}
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
                      className="border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                    />
                  </div>
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
    </CustomerLayout>
  );
}
