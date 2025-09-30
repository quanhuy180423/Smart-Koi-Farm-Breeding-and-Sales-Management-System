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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Bell,
  Shield,
  Database,
  Mail,
  Smartphone,
  Globe,
  Save,
  RefreshCw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface SystemSettings {
  // General Settings
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;

  // Notification Settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  orderNotifications: boolean;
  systemAlerts: boolean;
  marketingEmails: boolean;

  // Security Settings
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  loginAlerts: boolean;

  // System Settings
  maintenanceMode: boolean;
  debugMode: boolean;
  backupFrequency: string;
  logRetention: number;
}

export default function ManagerSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    // General
    language: "vi",
    timezone: "Asia/Ho_Chi_Minh",
    dateFormat: "DD/MM/YYYY",
    currency: "VND",

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    systemAlerts: true,
    marketingEmails: false,

    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAlerts: true,

    // System
    maintenanceMode: false,
    debugMode: false,
    backupFrequency: "daily",
    logRetention: 30,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = <K extends keyof SystemSettings>(
    key: K,
    value: SystemSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In real app, this would save to API
    console.log("Saving settings:", settings);
    setHasChanges(false);
    // Show success message
  };

  const handleReset = () => {
    // Reset to default settings
    setSettings({
      language: "vi",
      timezone: "Asia/Ho_Chi_Minh",
      dateFormat: "DD/MM/YYYY",
      currency: "VND",
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      orderNotifications: true,
      systemAlerts: true,
      marketingEmails: false,
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAlerts: true,
      maintenanceMode: false,
      debugMode: false,
      backupFrequency: "daily",
      logRetention: 30,
    });
    setHasChanges(true);
  };

  const handleNumericInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const value = target.value;
    // Chỉ cho phép số và tối đa một dấu chấm (cho số thập phân)
    const numericValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
    if (value !== numericValue) {
      target.value = numericValue;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cài đặt hệ thống
          </h1>
          <p className="text-muted-foreground">
            Quản lý các cài đặt và tùy chọn của hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Đặt lại
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="mr-2 h-4 w-4" />
            Lưu thay đổi
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Chung
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Bảo mật
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Hệ thống
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Cài đặt chung
              </CardTitle>
              <CardDescription>
                Cấu hình ngôn ngữ, múi giờ và định dạng hiển thị
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Ngôn ngữ</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) =>
                      handleSettingChange("language", value)
                    }
                  >
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Múi giờ</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) =>
                      handleSettingChange("timezone", value)
                    }
                  >
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Ho_Chi_Minh">
                        Asia/Ho_Chi_Minh (GMT+7)
                      </SelectItem>
                      <SelectItem value="Asia/Bangkok">
                        Asia/Bangkok (GMT+7)
                      </SelectItem>
                      <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Định dạng ngày</Label>
                  <Select
                    value={settings.dateFormat}
                    onValueChange={(value) =>
                      handleSettingChange("dateFormat", value)
                    }
                  >
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Đơn vị tiền tệ</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) =>
                      handleSettingChange("currency", value)
                    }
                  >
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VND">VND (₫)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Cài đặt thông báo
              </CardTitle>
              <CardDescription>
                Quản lý các loại thông báo bạn muốn nhận
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <Label>Email notifications</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo qua email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("emailNotifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <Label>Push notifications</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo đẩy trên trình duyệt
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("pushNotifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo qua tin nhắn SMS
                    </p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("smsNotifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Thông báo đơn hàng</Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo về đơn hàng mới và cập nhật
                    </p>
                  </div>
                  <Switch
                    checked={settings.orderNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("orderNotifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cảnh báo hệ thống</Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận cảnh báo về lỗi hệ thống và bảo trì
                    </p>
                  </div>
                  <Switch
                    checked={settings.systemAlerts}
                    onCheckedChange={(checked) =>
                      handleSettingChange("systemAlerts", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận email về khuyến mãi và tin tức
                    </p>
                  </div>
                  <Switch
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) =>
                      handleSettingChange("marketingEmails", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Cài đặt bảo mật
              </CardTitle>
              <CardDescription>
                Quản lý bảo mật tài khoản và hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Xác thực hai yếu tố (2FA)</Label>
                    <p className="text-sm text-muted-foreground">
                      Thêm lớp bảo mật cho tài khoản
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        handleSettingChange("twoFactorAuth", checked)
                      }
                    />
                    {settings.twoFactorAuth && (
                      <Badge variant="secondary">Đã bật</Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">
                      Thời gian phiên (phút)
                    </Label>
                    <Input
                      id="sessionTimeout"
                      value={settings.sessionTimeout}
                      onChange={(e) =>
                        handleSettingChange(
                          "sessionTimeout",
                          parseInt(e.target.value) || 30
                        )
                      }
                      onInput={handleNumericInput}
                      className="border border-gray-300"
                    />
                    <p className="text-xs text-muted-foreground">
                      Thời gian tự động đăng xuất khi không hoạt động
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">
                      Hết hạn mật khẩu (ngày)
                    </Label>
                    <Input
                      id="passwordExpiry"
                      value={settings.passwordExpiry}
                      onChange={(e) =>
                        handleSettingChange(
                          "passwordExpiry",
                          parseInt(e.target.value) || 90
                        )
                      }
                      onInput={handleNumericInput}
                      className="border border-gray-300"
                    />
                    <p className="text-xs text-muted-foreground">
                      Số ngày trước khi yêu cầu đổi mật khẩu
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cảnh báo đăng nhập</Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo khi có đăng nhập từ thiết bị mới
                    </p>
                  </div>
                  <Switch
                    checked={settings.loginAlerts}
                    onCheckedChange={(checked) =>
                      handleSettingChange("loginAlerts", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Cài đặt hệ thống
              </CardTitle>
              <CardDescription>
                Cấu hình nâng cao cho hệ thống (Chỉ dành cho quản trị viên)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Chế độ bảo trì</Label>
                    <p className="text-sm text-muted-foreground">
                      Tạm thời vô hiệu hóa hệ thống cho người dùng cuối
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) =>
                        handleSettingChange("maintenanceMode", checked)
                      }
                    />
                    {settings.maintenanceMode && (
                      <Badge variant="destructive">Đang bảo trì</Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Chế độ debug</Label>
                    <p className="text-sm text-muted-foreground">
                      Hiển thị thông tin debug chi tiết (Không khuyến nghị cho
                      production)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.debugMode}
                      onCheckedChange={(checked) =>
                        handleSettingChange("debugMode", checked)
                      }
                    />
                    {settings.debugMode && (
                      <Badge variant="outline">Debug mode</Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Tần suất sao lưu</Label>
                    <Select
                      value={settings.backupFrequency}
                      onValueChange={(value) =>
                        handleSettingChange("backupFrequency", value)
                      }
                    >
                      <SelectTrigger className="w-full border border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hàng giờ</SelectItem>
                        <SelectItem value="daily">Hàng ngày</SelectItem>
                        <SelectItem value="weekly">Hàng tuần</SelectItem>
                        <SelectItem value="monthly">Hàng tháng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logRetention">Giữ log (ngày)</Label>
                    <Input
                      id="logRetention"
                      value={settings.logRetention}
                      onChange={(e) =>
                        handleSettingChange(
                          "logRetention",
                          parseInt(e.target.value) || 30
                        )
                      }
                      onInput={handleNumericInput}
                    />
                    <p className="text-xs text-muted-foreground">
                      Số ngày lưu trữ file log hệ thống
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
