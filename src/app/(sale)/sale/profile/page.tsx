"use client";

import { useState } from "react";
import * as React from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar as CalendarIcon,
  Shield,
  Edit,
  Camera,
  Save,
  X,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetUserDetails, useUpdateProfile } from "@/hooks/useUsers";
import { useChangePassword } from "@/hooks/useAuth";
import { UpdateProfileRequest } from "@/lib/api/services/fetchUsers";
import { useUploadImage } from "@/hooks/useUploadFile";
import { Gender } from "@/lib/api/services/fetchKoiFish";
import { getUserGenderLabelForPerson, getRoleLabel } from "@/lib/utils/enum";
import { Roles } from "@/lib/api/services/fetchAuth";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface SaleProfile {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarURL?: string;
  role: Roles;
  dateOfBirth: string;
  address: string;
  gender: string;
}

export default function SaleProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null,
  );
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmedNewPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch user details from API
  const { data: userDetails, isLoading, error } = useGetUserDetails();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();
  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword(() => {
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmedNewPassword: "",
      });
      toast.success("Đổi mật khẩu thành công");
    });

  // Convert API response to component state
  const [profile, setProfile] = useState<SaleProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<SaleProfile | null>(null);

  // Update profile when user details are fetched
  React.useEffect(() => {
    if (userDetails) {
      const profileData: SaleProfile = {
        id: userDetails.id,
        fullName: userDetails.fullName,
        email: userDetails.email,
        phoneNumber: userDetails.phoneNumber,
        avatarURL: userDetails.avatarURL,
        role: userDetails.role,
        dateOfBirth: userDetails.dateOfBirth,
        address: userDetails.address,
        gender: userDetails.gender,
      };
      setProfile(profileData);
      setEditedProfile(profileData);
    }
  }, [userDetails]);

  const handleSave = () => {
    if (!editedProfile) return;

    // Prepare update request
    const updateRequest: UpdateProfileRequest = {
      fullName: editedProfile.fullName,
      phoneNumber: editedProfile.phoneNumber,
      dateOfBirth: editedProfile.dateOfBirth || new Date().toISOString(),
      gender: editedProfile.gender,
      avatarURL: editedProfile.avatarURL || "",
      address: editedProfile.address,
    };

    updateProfile(updateRequest, {
      onSuccess: () => {
        setProfile(editedProfile);
        setIsEditing(false);
      },
    });
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof SaleProfile, value: string) => {
    if (editedProfile) {
      setEditedProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          [field]: value,
        };
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAvatarFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewAvatarUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarConfirm = () => {
    if (!selectedAvatarFile || !editedProfile) return;

    uploadImage(
      { file: selectedAvatarFile },
      {
        onSuccess: (uploadedUrl) => {
          const updatedProfile = {
            ...editedProfile,
            avatarURL: uploadedUrl.url,
          };
          setEditedProfile(updatedProfile);

          // If not editing, call updateProfile immediately
          if (!isEditing) {
            const updateRequest = {
              fullName: updatedProfile.fullName,
              phoneNumber: updatedProfile.phoneNumber,
              dateOfBirth:
                updatedProfile.dateOfBirth || new Date().toISOString(),
              gender: updatedProfile.gender,
              avatarURL: updatedProfile.avatarURL,
              address: updatedProfile.address,
            };
            updateProfile(updateRequest);
          }

          setSelectedAvatarFile(null);
          setPreviewAvatarUrl(null);
          setIsAvatarDialogOpen(false);
        },
      },
    );
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
      toast.error("Vui lòng điền đầy đủ tất cả các trường");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmedNewPassword) {
      toast.error("Mật khẩu mới không khớp với xác nhận");
      return;
    }

    // Call API
    changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
      confirmedNewPassword: passwordForm.confirmedNewPassword,
    });
  };

  // Helper functions for date handling
  const getDateFromString = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const parts = dateString.split("T")[0].split("-");
    return new Date(
      parseInt(parts[0]),
      parseInt(parts[1]) - 1,
      parseInt(parts[2]),
    );
  };

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Đang tải thông tin...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 items-center justify-center">
        <p className="text-red-600">Có lỗi xảy ra khi tải thông tin cá nhân</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Thông tin cá nhân
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin cá nhân và hồ sơ của bạn
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
          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Card */}
            <Card className="md:col-span-1">
              <CardHeader className="text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={profile.avatarURL}
                        alt={profile.fullName}
                      />
                      <AvatarFallback className="text-lg">
                        {profile.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                      onClick={() => setIsAvatarDialogOpen(true)}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">
                      {profile.fullName}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 w-fit mx-auto"
                    >
                      <Shield className="h-3 w-3" />
                      {getRoleLabel(profile.role).label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Ngày sinh:{" "}
                    {new Date(profile.dateOfBirth).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Giới tính</h4>
                  <p className="text-sm text-muted-foreground">
                    {
                      getUserGenderLabelForPerson(
                        profile.gender as Gender | undefined,
                      ).label
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Thông tin chi tiết</CardTitle>
                    <CardDescription>
                      Cập nhật thông tin cá nhân của bạn
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isUpdating}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Hủy
                      </Button>
                      <Button onClick={handleSave} disabled={isUpdating}>
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Lưu
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input
                      id="fullName"
                      value={
                        isEditing ? editedProfile?.fullName : profile.fullName
                      }
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      disabled={!isEditing}
                      className={
                        !isEditing ? "bg-muted/50" : "border border-primary"
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={isEditing ? editedProfile?.email : profile.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={!isEditing}
                      className={
                        !isEditing ? "bg-muted/50" : "border border-primary"
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Số điện thoại</Label>
                    <Input
                      id="phoneNumber"
                      value={
                        isEditing
                          ? editedProfile?.phoneNumber
                          : profile.phoneNumber
                      }
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      disabled={!isEditing}
                      className={
                        !isEditing ? "bg-muted/50" : "border border-primary"
                      }
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="gender">Giới tính</Label>
                    {isEditing ? (
                      <Select
                        value={editedProfile?.gender || ""}
                        onValueChange={(value) =>
                          handleInputChange("gender", value)
                        }
                      >
                        <SelectTrigger
                          id="gender"
                          className="border border-primary w-full"
                        >
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Gender.MALE}>
                            {getUserGenderLabelForPerson(Gender.MALE).label}
                          </SelectItem>
                          <SelectItem value={Gender.FEMALE}>
                            {getUserGenderLabelForPerson(Gender.FEMALE).label}
                          </SelectItem>
                          <SelectItem value={Gender.UNKNOWN}>
                            {getUserGenderLabelForPerson(Gender.UNKNOWN).label}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="bg-muted/50 border border-gray-200 rounded-md px-3 py-2 text-sm">
                        {
                          getUserGenderLabelForPerson(
                            editedProfile?.gender as Gender | undefined,
                          ).label
                        }
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  {isEditing ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal border border-primary"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editedProfile?.dateOfBirth
                            ? format(
                                getDateFromString(editedProfile.dateOfBirth)!,
                                "dd MMM yyyy",
                                { locale: vi },
                              )
                            : "Chọn ngày..."}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={getDateFromString(
                            editedProfile?.dateOfBirth || "",
                          )}
                          onSelect={(date) => {
                            if (date) {
                              handleInputChange(
                                "dateOfBirth",
                                formatDateToString(date),
                              );
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <div className="bg-muted/50 border border-gray-200 rounded-md px-3 py-2 text-sm">
                      {profile.dateOfBirth
                        ? format(
                            getDateFromString(profile.dateOfBirth)!,
                            "dd MMM yyyy",
                            { locale: vi },
                          )
                        : "Chưa có"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    value={isEditing ? editedProfile?.address : profile.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    disabled={!isEditing}
                    className={
                      !isEditing ? "bg-muted/50" : "border border-primary"
                    }
                  />
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
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu hiện tại"
                      value={passwordForm.oldPassword}
                      onChange={(e) =>
                        handlePasswordChange("oldPassword", e.target.value)
                      }
                      disabled={isChangingPassword}
                      className="border-2 border-border hover:border-primary/50 focus:border-primary transition-colors pr-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      disabled={isChangingPassword}
                    >
                      {showOldPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="newPassword" className="mb-2">
                    Mật khẩu mới
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                      disabled={isChangingPassword}
                      className="border-2 border-border hover:border-primary/50 focus:border-primary transition-colors pr-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={isChangingPassword}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="mb-2">
                    Xác nhận mật khẩu mới
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Xác nhận mật khẩu mới"
                      value={passwordForm.confirmedNewPassword}
                      onChange={(e) =>
                        handlePasswordChange(
                          "confirmedNewPassword",
                          e.target.value,
                        )
                      }
                      disabled={isChangingPassword}
                      className="border-2 border-border hover:border-primary/50 focus:border-primary transition-colors pr-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isChangingPassword}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleChangePassword}
                disabled={
                  isChangingPassword ||
                  !passwordForm.oldPassword ||
                  !passwordForm.newPassword ||
                  !passwordForm.confirmedNewPassword ||
                  passwordForm.newPassword !== passwordForm.confirmedNewPassword
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

      {/* Avatar Change Dialog */}
      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thay đổi ảnh đại diện</DialogTitle>
            <DialogDescription>
              Chọn ảnh mới cho hồ sơ của bạn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={previewAvatarUrl || editedProfile?.avatarURL}
                  alt={profile?.fullName}
                />
                <AvatarFallback className="text-2xl">
                  {profile?.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex gap-2 justify-center">
              <input
                ref={(input) => {
                  if (input) input.accept = "image/*";
                }}
                type="file"
                id="avatar-upload"
                style={{ display: "none" }}
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <Button
                variant="outline"
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
                disabled={isUploading || previewAvatarUrl !== null}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Chọn ảnh
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAvatarDialogOpen(false);
                setSelectedAvatarFile(null);
                setPreviewAvatarUrl(null);
              }}
              disabled={isUploading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleAvatarConfirm}
              disabled={isUploading || !selectedAvatarFile}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải...
                </>
              ) : (
                "Xong"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
