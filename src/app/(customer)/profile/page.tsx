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
import {
  Edit,
  Camera,
  Save,
  X,
  Loader2,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Lock,
  CheckCircle2,
  AlertCircle,
  Upload,
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
import { getUserGenderLabelForPerson } from "@/lib/utils/enum";
import toast from "react-hot-toast";
import { DatePickerFilter } from "@/components/ui/DatePickerFilter";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";
import { useRouter } from "next/navigation";

interface CustomerProfile {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarURL?: string;
  dateOfBirth: string;
  address: string;
  gender: string;
}

export default function CustomerProfilePage() {
  const router = useRouter();
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      toast.success("Đổi mật khẩu thành công, vui lòng đăng nhập lại");
      router.push("/login");
    });

  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<CustomerProfile | null>(
    null,
  );

  React.useEffect(() => {
    if (userDetails) {
      const profileData: CustomerProfile = {
        id: userDetails.id,
        fullName: userDetails.fullName || "",
        email: userDetails.email || "",
        phoneNumber: userDetails.phoneNumber || "",
        avatarURL: userDetails.avatarURL || "",
        dateOfBirth: userDetails.dateOfBirth || "",
        address: userDetails.address || "",
        gender: userDetails.gender || "",
      };
      setProfile(profileData);
      setEditedProfile(profileData);
    }
  }, [userDetails]);

  const handleSave = () => {
    if (!editedProfile) return;

    const newErrors: Record<string, string> = {};
    if (!editedProfile.fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống";
    }
    if (!editedProfile.email.trim()) {
      newErrors.email = "Email không được để trống";
    }
    if (!editedProfile.phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại không được để trống";
    }
    if (!editedProfile.gender) {
      newErrors.gender = "Giới tính không được để trống";
    }
    if (!editedProfile.dateOfBirth) {
      newErrors.dateOfBirth = "Ngày sinh không được để trống";
    }
    // if (!editedProfile.address.trim()) {
    //   newErrors.address = "Địa chỉ không được để trống";
    // }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

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
    setErrors({});
  };

  const handleInputChange = (field: keyof CustomerProfile, value: string) => {
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

    changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
      confirmedNewPassword: passwordForm.confirmedNewPassword,
    });
  };

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground text-lg">Đang tải thông tin...</p>
        </div>
      </CustomerLayout>
    );
  }

  if (error || !profile) {
    return (
      <CustomerLayout>
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 items-center justify-center min-h-[60vh]">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-red-600 text-lg">
            Có lỗi xảy ra khi tải thông tin cá nhân
          </p>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="flex flex-1 flex-col gap-6 px-4 md:gap-8 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Thông tin cá nhân
            </h1>
            <p className="text-muted-foreground">
              Quản lý thông tin cá nhân và bảo mật tài khoản của bạn
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 h-10">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Thông tin
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Bảo mật
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Profile Card */}
              <Card className="lg:col-span-4 border-2 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                      <Avatar className="h-36 w-36 border-4 border-background shadow-xl ring-2 ring-primary/20">
                        <AvatarImage
                          src={profile.avatarURL}
                          alt={profile.fullName}
                        />
                        <AvatarFallback className="text-2xl bg-linear-to-br from-primary to-primary/60 text-white">
                          {profile.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full shadow-lg hover:scale-110 transition-transform"
                        onClick={() => setIsAvatarDialogOpen(true)}
                      >
                        <Camera className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="space-y-2 w-full">
                      <h3 className="text-2xl font-bold">{profile.fullName}</h3>
                      <Badge variant="secondary" className="px-4 py-1">
                        <User className="h-3 w-3 mr-1" />
                        Khách hàng
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>{profile.phoneNumber || "Chưa cập nhật"}</span>
                  </div>
                  {/* <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {profile.address || "Chưa cập nhật"}
                    </span>
                  </div> */}
                </CardContent>
              </Card>

              {/* Profile Details */}
              <Card className="lg:col-span-8 border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        Thông tin chi tiết
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Cập nhật và quản lý thông tin cá nhân của bạn
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button
                        onClick={() => {
                          setIsEditing(true);
                          setErrors({});
                        }}
                        size="lg"
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Chỉnh sửa
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isUpdating}
                          size="lg"
                          className="gap-2 bg-red-500 text-white hover:bg-red-600 focus:ring-red-600"
                        >
                          <X className="h-4 w-4" />
                          Hủy
                        </Button>
                        <Button
                          onClick={handleSave}
                          disabled={isUpdating}
                          size="lg"
                          className="gap-2"
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Đang lưu...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Lưu
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="flex items-center gap-2 text-base"
                      >
                        <User className="h-4 w-4 text-primary" />
                        Họ và tên
                      </Label>
                      {isEditing ? (
                        <Input
                          id="fullName"
                          value={editedProfile?.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          className="h-10 rounded-lg border-2 focus:ring-2 focus:ring-primary/20"
                          placeholder="Nhập họ và tên"
                        />
                      ) : (
                        <div className="bg-muted/50 border-2 border-border rounded-lg px-4 py-2 text-sm font-medium">
                          {profile.fullName || "Chưa có"}
                        </div>
                      )}
                      {errors.fullName && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2 text-base"
                      >
                        <Mail className="h-4 w-4 text-primary" />
                        Email
                      </Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editedProfile?.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="h-10 rounded-lg border-2 focus:ring-2 focus:ring-primary/20"
                          placeholder="Nhập email"
                        />
                      ) : (
                        <div className="bg-muted/50 border-2 border-border rounded-lg px-4 py-2 text-sm font-medium">
                          {profile.email || "Chưa có"}
                        </div>
                      )}
                      {errors.email && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="phoneNumber"
                        className="flex items-center gap-2 text-base"
                      >
                        <Phone className="h-4 w-4 text-primary" />
                        Số điện thoại
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phoneNumber"
                          value={editedProfile?.phoneNumber}
                          onChange={(e) =>
                            handleInputChange("phoneNumber", e.target.value)
                          }
                          className="h-10 rounded-lg border-2 focus:ring-2 focus:ring-primary/20"
                          placeholder="Nhập số điện thoại"
                        />
                      ) : (
                        <div className="bg-muted/50 border-2 border-border rounded-lg px-4 py-2 text-sm font-medium">
                          {profile.phoneNumber || "Chưa có"}
                        </div>
                      )}
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="gender"
                        className="flex items-center gap-2 text-base"
                      >
                        <User className="h-4 w-4 text-primary" />
                        Giới tính
                      </Label>
                      {isEditing ? (
                        <Select
                          value={editedProfile?.gender || ""}
                          onValueChange={(value) =>
                            handleInputChange("gender", value)
                          }
                        >
                          <SelectTrigger
                            id="gender"
                            className="h-10 w-full rounded-lg border-2 focus:ring-2 focus:ring-primary/20"
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
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="bg-muted/50 border-2 border-border rounded-lg px-4 py-2 text-sm font-medium">
                          {
                            getUserGenderLabelForPerson(
                              editedProfile?.gender as Gender | undefined,
                            ).label
                          }
                        </div>
                      )}
                      {errors.gender && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.gender}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="dateOfBirth"
                      className="flex items-center gap-2 text-base"
                    >
                      <Calendar className="h-4 w-4 text-primary" />
                      Ngày sinh
                    </Label>
                    {isEditing ? (
                      <DatePickerFilter
                        label=""
                        value={editedProfile?.dateOfBirth || ""}
                        onChange={(value) =>
                          handleInputChange("dateOfBirth", value)
                        }
                      />
                    ) : (
                      <div className="bg-muted/50 border-2 border-border rounded-lg px-4 py-2 text-sm font-medium">
                        {profile.dateOfBirth
                          ? formatDate(
                              profile.dateOfBirth,
                              DATE_FORMATS.MEDIUM_DATE,
                            )
                          : "Chưa có"}
                      </div>
                    )}
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.dateOfBirth}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  {/* <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="flex items-center gap-2 text-base"
                    >
                      <MapPin className="h-4 w-4 text-primary" />
                      Địa chỉ
                    </Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={editedProfile?.address || ""}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="h-10 rounded-lg border-2 focus:ring-2 focus:ring-primary/20"
                        placeholder="Nhập địa chỉ"
                      />
                    ) : (
                      <div className="bg-muted/50 border-2 border-border rounded-lg px-4 py-2 text-sm font-medium">
                        {profile.address || "Chưa có"}
                      </div>
                    )}
                    {errors.address && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.address}
                      </p>
                    )}
                  </div> */}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      Bảo mật tài khoản
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Thay đổi mật khẩu để bảo vệ tài khoản của bạn
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentPassword"
                      className="flex items-center gap-2 text-base"
                    >
                      <Lock className="h-4 w-4 text-primary" />
                      Mật khẩu hiện tại
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showOldPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordForm.oldPassword}
                        onChange={(e) =>
                          handlePasswordChange("oldPassword", e.target.value)
                        }
                        disabled={isChangingPassword}
                        className="h-10 rounded-lg border-2 focus:ring-2 focus:ring-primary/20 pr-11"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 hover:bg-transparent"
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

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="flex items-center gap-2 text-base"
                    >
                      <Lock className="h-4 w-4 text-primary" />
                      Mật khẩu mới
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          handlePasswordChange("newPassword", e.target.value)
                        }
                        disabled={isChangingPassword}
                        className="h-10 rounded-lg border-2 focus:ring-2 focus:ring-primary/20 pr-11"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 hover:bg-transparent"
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

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="flex items-center gap-2 text-base"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Xác nhận mật khẩu
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordForm.confirmedNewPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "confirmedNewPassword",
                            e.target.value,
                          )
                        }
                        disabled={isChangingPassword}
                        className="h-10 rounded-lg border-2 focus:ring-2 focus:ring-primary/20 pr-11"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 hover:bg-transparent"
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

                {passwordForm.newPassword &&
                  passwordForm.confirmedNewPassword &&
                  passwordForm.newPassword !==
                    passwordForm.confirmedNewPassword && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">
                        Mật khẩu mới không khớp với xác nhận
                      </p>
                    </div>
                  )}

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
                  size="lg"
                  className="w-full md:w-auto gap-2"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Đổi mật khẩu
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Avatar Change Dialog */}
        <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Camera className="h-6 w-6 text-primary" />
                Thay đổi ảnh đại diện
              </DialogTitle>
              <DialogDescription>
                Chọn ảnh mới để cập nhật hồ sơ của bạn
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex justify-center">
                <div className="relative group">
                  <Avatar className="h-40 w-40 border-4 border-background shadow-xl ring-4 ring-primary/20">
                    <AvatarImage
                      src={previewAvatarUrl || editedProfile?.avatarURL}
                      alt={profile?.fullName}
                    />
                    <AvatarFallback className="text-3xl bg-linear-to-br from-primary to-primary/60 text-white">
                      {profile?.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
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
                  size="lg"
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Chọn ảnh
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
                size="lg"
                className="gap-2 bg-red-500 text-white hover:bg-red-600 focus:ring-red-600"
              >
                <X className="h-4 w-4" />
                Hủy
              </Button>
              <Button
                onClick={handleAvatarConfirm}
                disabled={isUploading || !selectedAvatarFile}
                size="lg"
                className="gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Xác nhận
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </CustomerLayout>
  );
}
