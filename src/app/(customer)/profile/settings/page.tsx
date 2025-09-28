"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Shield, 
  Eye, 
  Mail, 
  Save,
  Trash2,
  Download
} from "lucide-react";
import CustomerLayout from "@/components/customer/CustomerLayout";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: true,
    orderUpdates: true,
    promotions: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "private",
    showPurchases: false,
    allowContact: true,
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Cài đặt tài khoản</h1>
            <p className="text-muted-foreground">
              Quản lý cài đặt và tùy chọn cá nhân của bạn
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Cài đặt thông báo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Email thông báo</Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo qua email về đơn hàng và cập nhật
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked: boolean) => handleNotificationChange('email', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">SMS thông báo</Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận tin nhắn SMS về trạng thái đơn hàng
                    </p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked: boolean) => handleNotificationChange('sms', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Thông báo đẩy</Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo đẩy trên trình duyệt
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked: boolean) => handleNotificationChange('push', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Cập nhật đơn hàng</Label>
                    <p className="text-sm text-muted-foreground">
                      Thông báo về trạng thái giao hàng và thanh toán
                    </p>
                  </div>
                  <Switch
                    checked={notifications.orderUpdates}
                    onCheckedChange={(checked: boolean) => handleNotificationChange('orderUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Khuyến mãi và ưu đãi</Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông tin về các chương trình khuyến mãi
                    </p>
                  </div>
                  <Switch
                    checked={notifications.promotions}
                    onCheckedChange={(checked: boolean) => handleNotificationChange('promotions', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận email marketing và thông tin sản phẩm mới
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked: boolean) => handleNotificationChange('marketing', checked)}
                  />
                </div>
              </div>

              <Button>
                <Save className="h-4 w-4 mr-2" />
                Lưu cài đặt thông báo
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Cài đặt quyền riêng tư
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Hiển thị lịch sử mua hàng</Label>
                    <p className="text-sm text-muted-foreground">
                      Cho phép hiển thị lịch sử mua hàng trong hồ sơ công khai
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showPurchases}
                    onCheckedChange={(checked: boolean) => handlePrivacyChange('showPurchases', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Cho phép liên hệ</Label>
                    <p className="text-sm text-muted-foreground">
                      Cho phép khách hàng khác liên hệ với bạn qua hệ thống
                    </p>
                  </div>
                  <Switch
                    checked={privacy.allowContact}
                    onCheckedChange={(checked: boolean) => handlePrivacyChange('allowContact', checked)}
                  />
                </div>
              </div>

              <Button>
                <Save className="h-4 w-4 mr-2" />
                Lưu cài đặt quyền riêng tư
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Cài đặt bảo mật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Xác nhận mật khẩu mới"
                />
              </div>

              <Button>
                <Shield className="h-4 w-4 mr-2" />
                Đổi mật khẩu
              </Button>
            </CardContent>
          </Card>

          {/* Contact Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Thông tin liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email liên hệ</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="nguyenvanan@email.com"
                  placeholder="Nhập email liên hệ"
                />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  defaultValue="0123456789"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <Button>
                <Save className="h-4 w-4 mr-2" />
                Cập nhật thông tin liên hệ
              </Button>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Quản lý dữ liệu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="text-base font-medium">Tải xuống dữ liệu</Label>
                  <p className="text-sm text-muted-foreground">
                    Tải xuống bản sao tất cả dữ liệu cá nhân của bạn
                  </p>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20">
                <div>
                  <Label className="text-base font-medium text-destructive">Xóa tài khoản</Label>
                  <p className="text-sm text-muted-foreground">
                    Xóa vĩnh viễn tài khoản và tất cả dữ liệu liên quan
                  </p>
                </div>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa tài khoản
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerLayout>
  );
}