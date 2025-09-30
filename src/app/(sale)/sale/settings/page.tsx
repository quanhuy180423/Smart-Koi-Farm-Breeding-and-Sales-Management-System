"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Bell,
  Palette,
  Globe,
  Save,
  Monitor,
  Moon,
  Sun,
  Mail,
  Phone,
  MessageSquare,
  Eye,
  EyeOff,
  Lock,
  Key,
  RefreshCw,
} from "lucide-react";

// Mock settings data
const mockSettings = {
  appearance: {
    theme: "light",
    language: "vi",
    fontSize: "medium",
    compactMode: false,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    weeklyReports: true,
    systemAlerts: true,
  },
  privacy: {
    profileVisibility: "public",
    activityTracking: true,
    analyticsOptIn: true,
    showOnlineStatus: true,
  },
  account: {
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
  },
};

export default function SaleSettingsPage() {
  const [settings, setSettings] = useState(mockSettings);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSave = () => {
    // Save settings logic here
    console.log("Settings saved:", settings);
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    // Change password logic here
    console.log("Password changed");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Cài đặt hệ thống
          </h1>
          <p className="text-muted-foreground">
            Tùy chỉnh giao diện và cài đặt tài khoản
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Đặt lại
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Lưu cài đặt
          </Button>
        </div>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="appearance">Giao diện</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="privacy">Bảo mật</TabsTrigger>
          <TabsTrigger value="account">Tài khoản</TabsTrigger>
        </TabsList>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Tùy chỉnh giao diện
              </CardTitle>
              <CardDescription>
                Thay đổi giao diện và ngôn ngữ hiển thị
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Chủ đề giao diện</Label>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, theme: value },
                      })
                    }
                  >
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Sáng
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Tối
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          Theo hệ thống
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ngôn ngữ</Label>
                  <Select
                    value={settings.appearance.language}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, language: value },
                      })
                    }
                  >
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Tiếng Việt
                        </div>
                      </SelectItem>
                      <SelectItem value="en">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          English
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Kích thước chữ</Label>
                  <Select
                    value={settings.appearance.fontSize}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, fontSize: value },
                      })
                    }
                  >
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Nhỏ</SelectItem>
                      <SelectItem value="medium">Vừa</SelectItem>
                      <SelectItem value="large">Lớn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Chế độ thu gọn</Label>
                  <p className="text-sm text-muted-foreground">
                    Hiển thị giao diện thu gọn để tiết kiệm không gian
                  </p>
                </div>
                <Switch
                  checked={settings.appearance.compactMode}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      appearance: {
                        ...settings.appearance,
                        compactMode: checked,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Cài đặt thông báo
              </CardTitle>
              <CardDescription>
                Quản lý các loại thông báo nhận được
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>Thông báo qua email</Label>
                      <p className="text-sm text-muted-foreground">
                        Nhận thông báo quan trọng qua email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          emailNotifications: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>Thông báo SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Nhận thông báo khẩn cấp qua tin nhắn
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          smsNotifications: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>Thông báo đẩy</Label>
                      <p className="text-sm text-muted-foreground">
                        Hiển thị thông báo trên trình duyệt
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          pushNotifications: checked,
                        },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cập nhật đơn hàng</Label>
                    <p className="text-sm text-muted-foreground">
                      Thông báo khi có đơn hàng mới hoặc thay đổi
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.orderUpdates}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          orderUpdates: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email khuyến mãi</Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông tin về chương trình khuyến mãi
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.promotionalEmails}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          promotionalEmails: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Báo cáo hàng tuần</Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận tóm tắt hiệu suất làm việc hàng tuần
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.weeklyReports}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          weeklyReports: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cảnh báo hệ thống</Label>
                    <p className="text-sm text-muted-foreground">
                      Thông báo về bảo trì và cập nhật hệ thống
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.systemAlerts}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          systemAlerts: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Cài đặt bảo mật
              </CardTitle>
              <CardDescription>
                Quản lý quyền riêng tư và bảo mật dữ liệu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Hiển thị hồ sơ</Label>
                  <Select
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        privacy: {
                          ...settings.privacy,
                          profileVisibility: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Công khai</SelectItem>
                      <SelectItem value="private">Riêng tư</SelectItem>
                      <SelectItem value="colleagues">
                        Chỉ đồng nghiệp
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Theo dõi hoạt động</Label>
                    <p className="text-sm text-muted-foreground">
                      Cho phép hệ thống theo dõi hoạt động để cải thiện trải
                      nghiệm
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.activityTracking}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: {
                          ...settings.privacy,
                          activityTracking: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Chia sẻ dữ liệu phân tích</Label>
                    <p className="text-sm text-muted-foreground">
                      Cho phép chia sẻ dữ liệu ẩn danh để cải thiện sản phẩm
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.analyticsOptIn}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: {
                          ...settings.privacy,
                          analyticsOptIn: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Hiển thị trạng thái online</Label>
                    <p className="text-sm text-muted-foreground">
                      Cho phép đồng nghiệp thấy khi bạn đang online
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.showOnlineStatus}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: {
                          ...settings.privacy,
                          showOnlineStatus: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Bảo mật tài khoản
              </CardTitle>
              <CardDescription>
                Cài đặt bảo mật và quản lý mật khẩu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Xác thực hai bước</Label>
                  <p className="text-sm text-muted-foreground">
                    Thêm lớp bảo mật bằng mã xác thực qua điện thoại
                  </p>
                </div>
                <Switch
                  checked={settings.account.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      account: { ...settings.account, twoFactorAuth: checked },
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Thời gian hết phiên (phút)</Label>
                  <Select
                    value={settings.account.sessionTimeout}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        account: { ...settings.account, sessionTimeout: value },
                      })
                    }
                  >
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 phút</SelectItem>
                      <SelectItem value="30">30 phút</SelectItem>
                      <SelectItem value="60">1 giờ</SelectItem>
                      <SelectItem value="120">2 giờ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Thời hạn mật khẩu (ngày)</Label>
                  <Select
                    value={settings.account.passwordExpiry}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        account: { ...settings.account, passwordExpiry: value },
                      })
                    }
                  >
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 ngày</SelectItem>
                      <SelectItem value="60">60 ngày</SelectItem>
                      <SelectItem value="90">90 ngày</SelectItem>
                      <SelectItem value="never">Không giới hạn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Change Password Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Thay đổi mật khẩu</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Nhập mật khẩu hiện tại"
                        className="border border-gray-300"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            current: !showPasswords.current,
                          })
                        }
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                        className="border border-gray-300"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            new: !showPasswords.new,
                          })
                        }
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Xác nhận mật khẩu mới
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        className="border border-gray-300"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            confirm: !showPasswords.confirm,
                          })
                        }
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handlePasswordChange} className="w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Thay đổi mật khẩu
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
