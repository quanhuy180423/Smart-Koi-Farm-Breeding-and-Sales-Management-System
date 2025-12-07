# 📧 Messages Documentation

## Smart Koi Farm - Application Messages Catalog

> Tài liệu tổng hợp toàn bộ Messages được sử dụng trong ứng dụng.

---

## 📑 Mục Lục

1. [Authentication Messages](#1-authentication-messages)
2. [User Management Messages](#2-user-management-messages)
3. [Cart & Order Messages](#3-cart--order-messages)
4. [Koi Fish Messages](#4-koi-fish-messages)
5. [Pond Management Messages](#5-pond-management-messages)
6. [Breeding Process Messages](#6-breeding-process-messages)
7. [Work Schedule Messages](#7-work-schedule-messages)
8. [Shipping Messages](#8-shipping-messages)
9. [Promotion Messages](#9-promotion-messages)
10. [Incident Messages](#10-incident-messages)
11. [Customer Address Messages](#11-customer-address-messages)
12. [Map & Location Messages](#12-map--location-messages)
13. [Water Parameter Messages](#13-water-parameter-messages)
14. [Form Validation Messages](#14-form-validation-messages)

---

## Message Types

| Type       | Description                   | Style             |
| ---------- | ----------------------------- | ----------------- |
| **Toast**  | Hiển thị thông báo popup      | `react-hot-toast` |
| **Inline** | Hiển thị trực tiếp trong form | Text bình thường  |
| **Error**  | Hiển thị lỗi dưới input       | Text màu đỏ       |

---

## 1. Authentication Messages

### File: `src/hooks/useAuth.ts`

| Code | Type  | Context                   | Content                       |
| ---- | ----- | ------------------------- | ----------------------------- |
| 1    | Toast | Register - Success        | `Đăng ký thành công`          |
| 2    | Toast | Register - Error          | `Đăng ký thất bại`            |
| 3    | Toast | Login - Success           | `Đăng nhập thành công`        |
| 4    | Toast | Login - Error             | `Đăng nhập thất bại`          |
| 5    | Toast | Forgot Password - Success | `Gửi email thành công`        |
| 6    | Toast | Forgot Password - Error   | `Gửi email thất bại`          |
| 7    | Toast | Reset Password - Success  | `Đặt lại mật khẩu thành công` |
| 8    | Toast | Reset Password - Error    | `Đặt lại mật khẩu thất bại`   |
| 9    | Toast | Change Password - Success | `Đổi mật khẩu thành công`     |
| 10   | Toast | Change Password - Error   | `Đổi mật khẩu thất bại`       |
| 11   | Toast | Verify Email - Success    | `Xác thực email thành công`   |
| 12   | Toast | Verify Email - Error      | `Xác thực email thất bại`     |
| 13   | Toast | Send OTP - Success        | `Gửi mã OTP thành công`       |
| 14   | Toast | Send OTP - Error          | `Gửi mã OTP thất bại`         |

### File: `src/components/LoginGoogle.tsx`

| Code | Type  | Context              | Content                          |
| ---- | ----- | -------------------- | -------------------------------- |
| 15   | Toast | Google Login - Error | `Không lấy được token từ Google` |
| 16   | Toast | Google Login - Error | `Đăng nhập Google thất bại`      |

---

## 2. User Management Messages

### File: `src/hooks/useUsers.ts`

| Code | Type  | Context                  | Content                                            |
| ---- | ----- | ------------------------ | -------------------------------------------------- |
| 17   | Toast | Create Staff - Success   | `Tạo tài khoản nhân viên thành công`               |
| 18   | Toast | Create Staff - Error     | `Có lỗi xảy ra khi tạo tài khoản.`                 |
| 19   | Toast | Toggle Status - Success  | `Cập nhật trạng thái tài khoản thành công`         |
| 20   | Toast | Toggle Status - Error    | `Có lỗi xảy ra khi cập nhật trạng thái tài khoản.` |
| 21   | Toast | Import Users - Success   | `Import tài khoản thành công`                      |
| 22   | Toast | Import Users - Error     | `Có lỗi xảy ra khi import tài khoản`               |
| 23   | Toast | Update Profile - Success | `Cập nhật thông tin cá nhân thành công`            |
| 24   | Toast | Update Profile - Error   | `Có lỗi xảy ra khi cập nhật thông tin.`            |

---

## 3. Cart & Order Messages

### File: `src/hooks/useCart.ts`

| Code | Type  | Context                    | Content                                              |
| ---- | ----- | -------------------------- | ---------------------------------------------------- |
| 25   | Toast | Add to Cart - Success      | `Thêm sản phẩm vào giỏ hàng thành công`              |
| 26   | Toast | Add to Cart - Error (Auth) | `Bạn cần đăng nhập để dùng tính năng này.`           |
| 27   | Toast | Add to Cart - Error        | `Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng`       |
| 28   | Toast | Update Cart - Error        | `Có lỗi xảy ra khi cập nhật sản phẩm trong giỏ hàng` |
| 29   | Toast | Delete Cart Item - Error   | `Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng`       |
| 30   | Toast | Convert Cart - Error       | `Có lỗi xảy ra khi tạo đơn hàng`                     |

### File: `src/hooks/useOrder.ts`

| Code | Type  | Context                 | Content                                          |
| ---- | ----- | ----------------------- | ------------------------------------------------ |
| 31   | Toast | Update Status - Success | `Cập nhật trạng thái đơn hàng thành công`        |
| 32   | Toast | Update Status - Error   | `Có lỗi xảy ra khi cập nhật trạng thái đơn hàng` |

### File: `src/hooks/useOrderPayment.ts`

| Code | Type  | Context                | Content                                     |
| ---- | ----- | ---------------------- | ------------------------------------------- |
| 33   | Toast | Create Payment - Error | `Không thể tạo liên kết thanh toán`         |
| 34   | Toast | Create Payment - Error | `Có lỗi xảy ra khi tạo liên kết thanh toán` |

---

## 4. Koi Fish Messages

### File: `src/hooks/useKoiFish.ts`

| Code | Type  | Context              | Content                                |
| ---- | ----- | -------------------- | -------------------------------------- |
| 35   | Toast | Update Koi - Success | `Chỉnh sửa cá Koi thành công`          |
| 36   | Toast | Update Koi - Error   | `Có lỗi xảy ra khi cập nhật thông tin` |
| 37   | Toast | Delete Koi - Success | `Xóa cá Koi thành công`                |
| 38   | Toast | Delete Koi - Error   | `Có lỗi xảy ra khi xóa cá Koi`         |

### File: `src/hooks/useVariety.ts`

| Code | Type  | Context                  | Content                                |
| ---- | ----- | ------------------------ | -------------------------------------- |
| 39   | Toast | Create Variety - Success | `Tạo giống cá thành công`              |
| 40   | Toast | Create Variety - Error   | `Có lỗi xảy ra khi cập nhật thông tin` |
| 41   | Toast | Update Variety - Success | `Chỉnh sửa giống cá thành công`        |
| 42   | Toast | Update Variety - Error   | `Có lỗi xảy ra khi cập nhật thông tin` |
| 43   | Toast | Delete Variety - Success | `Xóa giống cá thành công`              |
| 44   | Toast | Delete Variety - Error   | `Có lỗi xảy ra khi cập nhật thông tin` |

### File: `src/hooks/usePattern.ts`

| Code | Type  | Context                  | Content                                |
| ---- | ----- | ------------------------ | -------------------------------------- |
| 45   | Toast | Create Pattern - Success | `Tạo hoa văn thành công`               |
| 46   | Toast | Create Pattern - Error   | `Có lỗi xảy ra khi tạo hoa văn`        |
| 47   | Toast | Update Pattern - Success | `Cập nhật hoa văn thành công`          |
| 48   | Toast | Update Pattern - Error   | `Có lỗi xảy ra khi cập nhật hoa văn`   |
| 49   | Toast | Delete Pattern - Success | `Xóa hoa văn thành công`               |
| 50   | Toast | Delete Pattern - Error   | `Có lỗi xảy ra khi xóa hoa văn`        |
| 51   | Toast | Assign Variety - Success | `Gán giống cá cho hoa văn thành công`  |
| 52   | Toast | Assign Variety - Error   | `Có lỗi xảy ra khi gán giống cá`       |
| 53   | Toast | Remove Variety - Success | `Xóa giống cá khỏi hoa văn thành công` |
| 54   | Toast | Remove Variety - Error   | `Có lỗi xảy ra khi xóa giống cá`       |

### File: `src/hooks/useFavoriteKoi.ts`

| Code | Type  | Context                   | Content                                          |
| ---- | ----- | ------------------------- | ------------------------------------------------ |
| 55   | Toast | Add Favorite - Success    | `Đã thêm cá vào danh sách yêu thích`             |
| 56   | Toast | Add Favorite - Error      | `Có lỗi xảy ra khi thêm vào danh sách yêu thích` |
| 57   | Toast | Remove Favorite - Success | `Đã xóa cá khỏi danh sách yêu thích`             |
| 58   | Toast | Remove Favorite - Error   | `Có lỗi xảy ra khi xóa khỏi danh sách yêu thích` |

### File: `src/hooks/usePacketFish.ts`

| Code | Type  | Context                 | Content                          |
| ---- | ----- | ----------------------- | -------------------------------- |
| 59   | Toast | Create Packet - Success | `Thêm gói bán thành công`        |
| 60   | Toast | Create Packet - Error   | `Có lỗi xảy ra khi thêm gói bán` |

---

## 5. Pond Management Messages

### File: `src/hooks/usePond.ts`

| Code | Type  | Context               | Content                                |
| ---- | ----- | --------------------- | -------------------------------------- |
| 61   | Toast | Create Pond - Success | `Tạo hồ thành công`                    |
| 62   | Toast | Create Pond - Error   | `Có lỗi xảy ra khi cập nhật thông tin` |
| 63   | Toast | Update Pond - Success | `Chỉnh sửa hồ thành công`              |
| 64   | Toast | Update Pond - Error   | `Có lỗi xảy ra khi cập nhật thông tin` |
| 65   | Toast | Delete Pond - Success | `Xóa hồ thành công`                    |
| 66   | Toast | Delete Pond - Error   | `Có lỗi xảy ra khi cập nhật thông tin` |

### File: `src/hooks/usePondType.ts`

| Code | Type  | Context                    | Content                                |
| ---- | ----- | -------------------------- | -------------------------------------- |
| 67   | Toast | Create Pond Type - Success | `Tạo loại hồ thành công`               |
| 68   | Toast | Create Pond Type - Error   | `Có lỗi xảy ra khi cập nhật thông tin` |
| 69   | Toast | Update Pond Type - Success | `Chỉnh sửa loại hồ thành công`         |
| 70   | Toast | Update Pond Type - Error   | `Có lỗi xảy ra khi cập nhật thông tin` |
| 71   | Toast | Delete Pond Type - Success | `Xóa loại hồ thành công`               |
| 72   | Toast | Delete Pond Type - Error   | `Có lỗi xảy ra khi cập nhật thông tin` |

### File: `src/hooks/useArea.ts`

| Code | Type  | Context               | Content                                |
| ---- | ----- | --------------------- | -------------------------------------- |
| 73   | Toast | Create Area - Success | `Tạo khu vực thành công`               |
| 74   | Toast | Create Area - Error   | `Có lỗi xảy ra khi cập nhật thông tin` |
| 75   | Toast | Update Area - Success | `Chỉnh sửa khu vực thành công`         |
| 76   | Toast | Update Area - Error   | `Có lỗi xảy ra khi cập nhật thông tin` |
| 77   | Toast | Delete Area - Success | `Xóa khu vực thành công`               |
| 78   | Toast | Delete Area - Error   | `Có lỗi xảy ra khi xóa khu vực`        |

---

## 6. Breeding Process Messages

### File: `src/hooks/useBreedingProcess.ts`

| Code | Type  | Context                  | Content                                    |
| ---- | ----- | ------------------------ | ------------------------------------------ |
| 79   | Toast | Create Process - Success | `Tạo quy trình thành công`                 |
| 80   | Toast | Create Process - Error   | `Có lỗi xảy ra khi tạo quy trình sinh sản` |
| 81   | Toast | Cancel Process - Success | `Hủy quy trình thành công`                 |
| 82   | Toast | Cancel Process - Error   | `Có lỗi xảy ra khi hủy quy trình sinh sản` |
| 83   | Toast | Get Info - Error         | `Có lỗi xảy ra khi lấy thông tin`          |
| 84   | Toast | Analyze Pair - Error     | `Có lỗi xảy ra khi phân tích cặp cá`       |

### File: `src/hooks/useClassificationStage.ts`

| Code | Type  | Context                           | Content                                  |
| ---- | ----- | --------------------------------- | ---------------------------------------- |
| 85   | Toast | Complete Classification - Success | `Hoàn thành phân loại thành công`        |
| 86   | Toast | Complete Classification - Error   | `Không thể hoàn thành phân loại`         |
| 87   | Toast | Complete Classification - Error   | `Có lỗi xảy ra khi hoàn thành phân loại` |

---

## 7. Work Schedule Messages

### File: `src/hooks/useWorkSchedule.ts`

| Code | Type  | Context                       | Content                                           |
| ---- | ----- | ----------------------------- | ------------------------------------------------- |
| 88   | Toast | Create Schedule - Success     | `Tạo công việc thành công`                        |
| 89   | Toast | Create Schedule - Error       | `Có lỗi xảy ra khi tạo công việc`                 |
| 90   | Toast | Update Schedule - Success     | `Cập nhật công việc thành công`                   |
| 91   | Toast | Update Schedule - Error       | `Có lỗi xảy ra khi cập nhật công việc`            |
| 92   | Toast | Delete Schedule - Success     | `Xóa công việc thành công`                        |
| 93   | Toast | Delete Schedule - Error       | `Có lỗi xảy ra khi xóa công việc`                 |
| 94   | Toast | Complete Assignment - Success | `Đánh dấu công việc hoàn thành thành công`        |
| 95   | Toast | Complete Assignment - Error   | `Có lỗi xảy ra khi đánh dấu công việc hoàn thành` |

### File: `src/hooks/useWeeklyScheduleTemplate.ts`

| Code | Type  | Context                   | Content                                 |
| ---- | ----- | ------------------------- | --------------------------------------- |
| 96   | Toast | Create Template - Success | `Tạo mẫu lịch thành công`               |
| 97   | Toast | Create Template - Error   | `Có lỗi xảy ra khi tạo mẫu lịch`        |
| 98   | Toast | Update Template - Success | `Cập nhật mẫu lịch thành công`          |
| 99   | Toast | Update Template - Error   | `Có lỗi xảy ra khi cập nhật mẫu lịch`   |
| 100  | Toast | Delete Template - Success | `Xóa mẫu lịch thành công`               |
| 101  | Toast | Delete Template - Error   | `Có lỗi xảy ra khi xóa mẫu lịch`        |
| 102  | Toast | Apply Template - Success  | `{count} công việc được tạo thành công` |
| 103  | Toast | Apply Template - Error    | `Có lỗi xảy ra khi tạo công việc`       |

### File: `src/hooks/useTaskTemplate.ts`

| Code | Type  | Context               | Content                                |
| ---- | ----- | --------------------- | -------------------------------------- |
| 104  | Toast | Create Task - Success | `Tạo công việc thành công`             |
| 105  | Toast | Create Task - Error   | `Có lỗi xảy ra khi tạo công việc`      |
| 106  | Toast | Update Task - Success | `Cập nhật công việc thành công`        |
| 107  | Toast | Update Task - Error   | `Có lỗi xảy ra khi cập nhật công việc` |
| 108  | Toast | Delete Task - Success | `Xóa công việc thành công`             |
| 109  | Toast | Delete Task - Error   | `Có lỗi xảy ra khi xóa công việc`      |

---

## 8. Shipping Messages

### File: `src/hooks/useShippingBox.ts`

| Code | Type  | Context               | Content                                         |
| ---- | ----- | --------------------- | ----------------------------------------------- |
| 110  | Toast | Create Box - Success  | `Tạo hộp vận chuyển thành công`                 |
| 111  | Toast | Create Box - Error    | `Không thể tạo hộp vận chuyển`                  |
| 112  | Toast | Create Box - Error    | `Có lỗi xảy ra khi tạo hộp vận chuyển`          |
| 113  | Toast | Update Box - Success  | `Cập nhật hộp vận chuyển thành công`            |
| 114  | Toast | Update Box - Error    | `Không thể cập nhật hộp vận chuyển`             |
| 115  | Toast | Update Box - Error    | `Có lỗi xảy ra khi cập nhật hộp vận chuyển`     |
| 116  | Toast | Delete Box - Success  | `Xóa hộp vận chuyển thành công`                 |
| 117  | Toast | Delete Box - Error    | `Không thể xóa hộp vận chuyển`                  |
| 118  | Toast | Delete Box - Error    | `Có lỗi xảy ra khi xóa hộp vận chuyển`          |
| 119  | Toast | Create Rule - Success | `Tạo quy tắc vận chuyển thành công`             |
| 120  | Toast | Create Rule - Error   | `Không thể tạo quy tắc vận chuyển`              |
| 121  | Toast | Create Rule - Error   | `Có lỗi xảy ra khi tạo quy tắc vận chuyển`      |
| 122  | Toast | Update Rule - Success | `Cập nhật quy tắc vận chuyển thành công`        |
| 123  | Toast | Update Rule - Error   | `Không thể cập nhật quy tắc vận chuyển`         |
| 124  | Toast | Update Rule - Error   | `Có lỗi xảy ra khi cập nhật quy tắc vận chuyển` |
| 125  | Toast | Delete Rule - Success | `Xóa quy tắc vận chuyển thành công`             |
| 126  | Toast | Delete Rule - Error   | `Không thể xóa quy tắc vận chuyển`              |
| 127  | Toast | Delete Rule - Error   | `Có lỗi xảy ra khi xóa quy tắc vận chuyển`      |

### File: `src/hooks/useShippingDistance.ts`

| Code | Type  | Context                   | Content                                             |
| ---- | ----- | ------------------------- | --------------------------------------------------- |
| 128  | Toast | Create Distance - Success | `Tạo khoảng cách vận chuyển thành công`             |
| 129  | Toast | Create Distance - Error   | `Không thể tạo khoảng cách vận chuyển`              |
| 130  | Toast | Create Distance - Error   | `Có lỗi xảy ra khi tạo khoảng cách vận chuyển`      |
| 131  | Toast | Update Distance - Success | `Cập nhật khoảng cách vận chuyển thành công`        |
| 132  | Toast | Update Distance - Error   | `Không thể cập nhật khoảng cách vận chuyển`         |
| 133  | Toast | Update Distance - Error   | `Có lỗi xảy ra khi cập nhật khoảng cách vận chuyển` |
| 134  | Toast | Delete Distance - Success | `Xóa khoảng cách vận chuyển thành công`             |
| 135  | Toast | Delete Distance - Error   | `Không thể xóa khoảng cách vận chuyển`              |
| 136  | Toast | Delete Distance - Error   | `Có lỗi xảy ra khi xóa khoảng cách vận chuyển`      |

### File: `src/hooks/useShippingFee.ts`

| Code | Type  | Context               | Content                                 |
| ---- | ----- | --------------------- | --------------------------------------- |
| 137  | Toast | Calculate Fee - Error | `Có lỗi xảy ra khi tính phí vận chuyển` |

### File: `src/hooks/useShippingCalculator.ts`

| Code | Type  | Context           | Content                                 |
| ---- | ----- | ----------------- | --------------------------------------- |
| 138  | Toast | Calculate - Error | `Có lỗi xảy ra khi tính phí vận chuyển` |

---

## 9. Promotion Messages

### File: `src/hooks/usePromotion.ts`

| Code | Type  | Context                    | Content                                 |
| ---- | ----- | -------------------------- | --------------------------------------- |
| 139  | Toast | Create Promotion - Success | `Tạo khuyến mãi thành công!`            |
| 140  | Toast | Create Promotion - Error   | `Tạo khuyến mãi thất bại`               |
| 141  | Toast | Create Promotion - Error   | `Có lỗi xảy ra khi tạo khuyến mãi`      |
| 142  | Toast | Update Promotion - Success | `Cập nhật khuyến mãi thành công!`       |
| 143  | Toast | Update Promotion - Error   | `Cập nhật khuyến mãi thất bại`          |
| 144  | Toast | Update Promotion - Error   | `Có lỗi xảy ra khi cập nhật khuyến mãi` |
| 145  | Toast | Delete Promotion - Success | `Xóa khuyến mãi thành công!`            |
| 146  | Toast | Delete Promotion - Error   | `Xóa khuyến mãi thất bại`               |
| 147  | Toast | Delete Promotion - Error   | `Có lỗi xảy ra khi xóa khuyến mãi`      |

---

## 10. Incident Messages

### File: `src/hooks/useIncidentType.ts`

| Code | Type  | Context                        | Content                                 |
| ---- | ----- | ------------------------------ | --------------------------------------- |
| 148  | Toast | Create Incident Type - Success | `Tạo loại sự cố thành công`             |
| 149  | Toast | Create Incident Type - Error   | `Có lỗi xảy ra khi tạo loại sự cố`      |
| 150  | Toast | Update Incident Type - Success | `Cập nhật loại sự cố thành công`        |
| 151  | Toast | Update Incident Type - Error   | `Có lỗi xảy ra khi cập nhật loại sự cố` |
| 152  | Toast | Delete Incident Type - Success | `Xóa loại sự cố thành công`             |
| 153  | Toast | Delete Incident Type - Error   | `Có lỗi xảy ra khi xóa loại sự cố`      |

---

## 11. Customer Address Messages

### File: `src/hooks/useCustomerAddress.ts`

| Code | Type  | Context                  | Content                                  |
| ---- | ----- | ------------------------ | ---------------------------------------- |
| 154  | Toast | Add Address - Success    | `Thêm địa chỉ thành công`                |
| 155  | Toast | Add Address - Error      | `Có lỗi xảy ra khi thêm địa chỉ`         |
| 156  | Toast | Update Address - Success | `Cập nhật địa chỉ thành công`            |
| 157  | Toast | Update Address - Error   | `Có lỗi xảy ra khi cập nhật địa chỉ`     |
| 158  | Toast | Delete Address - Success | `Xóa địa chỉ thành công`                 |
| 159  | Toast | Delete Address - Error   | `Có lỗi xảy ra khi xóa địa chỉ`          |
| 160  | Toast | Set Default - Success    | `Đặt địa chỉ mặc định thành công`        |
| 161  | Toast | Set Default - Error      | `Có lỗi xảy ra khi đặt địa chỉ mặc định` |

---

## 12. Map & Location Messages

### File: `src/components/dialogs/MapPicker.tsx`

| Code | Type  | Context                            | Content                                            |
| ---- | ----- | ---------------------------------- | -------------------------------------------------- |
| 162  | Toast | Geolocation - Error                | `Trình duyệt của bạn không hỗ trợ vị trí hiện tại` |
| 163  | Toast | Get Location - Success             | `Đã lấy vị trí hiện tại`                           |
| 164  | Toast | Get Location - Error (Permission)  | `Vui lòng cấp quyền truy cập vị trí`               |
| 165  | Toast | Get Location - Error (Unavailable) | `Không thể lấy vị trí hiện tại`                    |
| 166  | Toast | Get Location - Error (Timeout)     | `Timeout khi lấy vị trí`                           |
| 167  | Toast | Get Location - Error (Generic)     | `Lỗi khi lấy vị trí hiện tại`                      |
| 168  | Toast | Search Address - Success           | `Tìm thấy: {address}`                              |
| 169  | Toast | Search Address - Error             | `Không tìm thấy địa chỉ này`                       |
| 170  | Toast | Search Address - Error             | `Lỗi khi tìm kiếm địa chỉ`                         |

---

## 13. Water Parameter Messages

### File: `src/hooks/useWaterParameterThreshold.ts`

| Code | Type  | Context                    | Content                                     |
| ---- | ----- | -------------------------- | ------------------------------------------- |
| 171  | Toast | Create Threshold - Success | `Tạo ngưỡng thành công`                     |
| 172  | Toast | Create Threshold - Error   | `Có lỗi xảy ra khi tạo ngưỡng`              |
| 173  | Toast | Update Threshold - Success | `Cập nhật ngưỡng thành công`                |
| 174  | Toast | Update Threshold - Error   | `Có lỗi xảy ra khi cập nhật ngưỡng`         |
| 175  | Toast | Delete Threshold - Success | `Xóa ngưỡng thành công`                     |
| 176  | Toast | Delete Threshold - Error   | `Có lỗi xảy ra khi xóa ngưỡng`              |
| 177  | Toast | Batch Create - Success     | `Tạo {count} thông số nước thành công`      |
| 178  | Toast | Batch Create - Error       | `Có {count} lỗi khi tạo thông số nước`      |
| 179  | Toast | Batch Update - Success     | `Cập nhật {count} thông số nước thành công` |
| 180  | Toast | Batch Update - Error       | `Có {count} lỗi khi cập nhật thông số nước` |

---

## 14. Form Validation Messages

### File: `src/app/(auth)/login/page.tsx`

| Code | Type  | Context                | Content                             |
| ---- | ----- | ---------------------- | ----------------------------------- |
| 181  | Error | Login - Username/Email | `Vui lòng nhập email hoặc username` |
| 182  | Error | Login - Password       | `Mật khẩu phải có ít nhất 6 ký tự`  |

### File: `src/app/(auth)/register/page.tsx`

| Code | Type  | Context                     | Content                                               |
| ---- | ----- | --------------------------- | ----------------------------------------------------- |
| 183  | Error | Register - Email            | `Email không hợp lệ`                                  |
| 184  | Error | Register - Username         | `Tên người dùng phải có ít nhất 3 ký tự`              |
| 185  | Error | Register - Password         | `Mật khẩu phải có ít nhất 6 ký tự`                    |
| 186  | Error | Register - Confirm Password | `Mật khẩu xác nhận không khớp`                        |
| 187  | Error | Register - Full Name        | `Họ và tên phải có ít nhất 3 ký tự`                   |
| 188  | Error | Register - Phone            | `Số điện thoại không hợp lệ`                          |
| 189  | Toast | Register - Error            | `Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.` |

### File: `src/app/(auth)/forgot-password/page.tsx`

| Code | Type  | Context                 | Content              |
| ---- | ----- | ----------------------- | -------------------- |
| 190  | Error | Forgot Password - Email | `Email không hợp lệ` |

---

## 📊 Message Summary

| Type            | Count    | Description          |
| --------------- | -------- | -------------------- |
| Toast Success   | ~70      | Thông báo thành công |
| Toast Error     | ~95      | Thông báo lỗi        |
| Form Validation | ~10      | Lỗi validation form  |
| **Total**       | **~190** | Tổng số messages     |

---

## 📝 Naming Convention

### Success Messages

```
{Action} + {Object} + thành công
Ví dụ: "Tạo khu vực thành công"
```

### Error Messages

```
Có lỗi xảy ra khi + {Action} + {Object}
Ví dụ: "Có lỗi xảy ra khi tạo khu vực"
```

hoặc

```
Không thể + {Action} + {Object}
Ví dụ: "Không thể tạo khoảng cách vận chuyển"
```

hoặc

```
{Action} + {Object} + thất bại
Ví dụ: "Đăng nhập thất bại"
```

---

## 🔧 Implementation

### Toast Library

```typescript
// Using react-hot-toast
import toast from "react-hot-toast";

// Success
toast.success("Tạo thành công");

// Error
toast.error("Có lỗi xảy ra");
```

### Form Validation

```typescript
// Using zod + react-hook-form
const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

// Display error
{errors.email && (
  <span className="text-red-500 text-sm">{errors.email.message}</span>
)}
```

---

_Last updated: December 2025_
