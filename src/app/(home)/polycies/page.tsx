import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Truck, RotateCcw, CreditCard, Phone, Mail } from "lucide-react"

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Chính sách</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tìm hiểu về các chính sách và điều khoản của KoiFarm để có trải nghiệm mua sắm tốt nhất
            </p>
          </div>

          <div className="space-y-8">
            {/* Privacy Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Chính sách bảo mật thông tin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Thu thập thông tin</h3>
                  <p className="text-gray-600">
                    Chúng tôi thu thập thông tin cá nhân khi bạn đăng ký tài khoản, đặt hàng, hoặc liên hệ với chúng
                    tôi. Thông tin bao gồm: họ tên, email, số điện thoại, địa chỉ giao hàng.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Sử dụng thông tin</h3>
                  <p className="text-gray-600">
                    Thông tin của bạn được sử dụng để xử lý đơn hàng, giao hàng, hỗ trợ khách hàng và cải thiện dịch vụ.
                    Chúng tôi cam kết không chia sẻ thông tin với bên thứ ba không liên quan.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Bảo mật dữ liệu</h3>
                  <p className="text-gray-600">
                    Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin cá nhân của bạn khỏi truy cập
                    trái phép, thay đổi, tiết lộ hoặc phá hủy.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-green-600" />
                  Chính sách vận chuyển
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Khu vực giao hàng</h3>
                  <p className="text-gray-600">
                    Chúng tôi giao hàng toàn quốc với các mức phí khác nhau tùy theo khoảng cách và kích thước đơn hàng.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Thời gian giao hàng</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Nội thành TP.HCM: 1-2 ngày làm việc</li>
                    <li>• Các tỉnh thành lân cận: 2-3 ngày làm việc</li>
                    <li>• Toàn quốc: 3-7 ngày làm việc</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Đóng gói chuyên nghiệp</h3>
                  <p className="text-gray-600">
                    Cá Koi được đóng gói trong túi oxy chuyên dụng, hộp xốp cách nhiệt để đảm bảo an toàn trong quá
                    trình vận chuyển.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Return Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-orange-600" />
                  Chính sách đổi trả
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Điều kiện đổi trả</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Cá bị chết trong vòng 24h sau khi nhận hàng (do lỗi vận chuyển)</li>
                    <li>• Cá không đúng mô tả hoặc kích thước</li>
                    <li>• Cá có dấu hiệu bệnh tật rõ ràng khi nhận hàng</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Quy trình đổi trả</h3>
                  <ol className="text-gray-600 space-y-1">
                    <li>1. Liên hệ hotline trong vòng 24h sau khi nhận hàng</li>
                    <li>2. Cung cấp video/hình ảnh làm bằng chứng</li>
                    <li>3. Chúng tôi sẽ xác nhận và hỗ trợ đổi trả trong 48h</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Bồi thường</h3>
                  <p className="text-gray-600">
                    Trong trường hợp cá chết do lỗi của chúng tôi, khách hàng sẽ được hoàn tiền 100% hoặc đổi cá mới
                    cùng loại.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  Chính sách thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Phương thức thanh toán</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Thanh toán khi nhận hàng (COD)</li>
                    <li>• Chuyển khoản ngân hàng</li>
                    <li>• Ví điện tử (MoMo, ZaloPay, VNPay)</li>
                    <li>• Thẻ tín dụng/ghi nợ</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Chính sách giá</h3>
                  <p className="text-gray-600">
                    Giá cả được niêm yết rõ ràng, không phát sinh chi phí ẩn. Giá có thể thay đổi tùy theo thời điểm và
                    chương trình khuyến mãi.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Hóa đơn VAT</h3>
                  <p className="text-gray-600">
                    Khách hàng có thể yêu cầu xuất hóa đơn VAT khi đặt hàng. Vui lòng cung cấp đầy đủ thông tin công ty.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Terms of Service */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  Điều khoản sử dụng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Quyền và nghĩa vụ của khách hàng</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Cung cấp thông tin chính xác khi đặt hàng</li>
                    <li>• Thanh toán đúng hạn theo phương thức đã chọn</li>
                    <li>• Kiểm tra hàng hóa ngay khi nhận</li>
                    <li>• Tuân thủ các quy định về nuôi cá Koi</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Quyền và nghĩa vụ của KoiFarm</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Cung cấp cá Koi chất lượng, đúng mô tả</li>
                    <li>• Đóng gói và vận chuyển an toàn</li>
                    <li>• Hỗ trợ khách hàng 24/7</li>
                    <li>• Bảo mật thông tin khách hàng</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Giải quyết tranh chấp</h3>
                  <p className="text-gray-600">
                    Mọi tranh chấp sẽ được giải quyết thông qua thương lượng. Nếu không thể thỏa thuận, sẽ đưa ra cơ
                    quan có thẩm quyền theo quy định của pháp luật Việt Nam.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Trụ sở chính</h3>
                    <div className="space-y-2 text-gray-600">
                      <p>123 Đường Cá Koi, Quận 1, TP.HCM</p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Hotline: 1900-KOIFARM
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email: support@koifarm.vn
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Giờ làm việc</h3>
                    <div className="space-y-2 text-gray-600">
                      <p>Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                      <p>Thứ 7 - Chủ nhật: 8:00 - 17:00</p>
                      <p>Hỗ trợ online: 24/7</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
