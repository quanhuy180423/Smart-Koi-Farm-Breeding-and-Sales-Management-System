import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại trang chủ
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Điều Khoản và Điều Kiện</h1>
              <p className="text-muted-foreground">
                ZenKoi - Chuyên cung cấp cá Koi chất lượng cao
              </p>
            </div>
          </div>

          {/* Terms Content */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Điều Khoản Sử Dụng Dịch Vụ
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* 1. Giới thiệu */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-primary">
                  1. Giới Thiệu
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Chào mừng bạn đến với ZenKoi - hệ thống quản lý và bán lẻ cá
                    Koi chuyên nghiệp. Bằng việc truy cập và sử dụng website của
                    chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện
                    được nêu dưới đây.
                  </p>
                  <p>
                    ZenKoi cam kết cung cấp các sản phẩm cá Koi chất lượng cao,
                    dịch vụ chăm sóc chuyên nghiệp và tư vấn tận tình cho khách
                    hàng.
                  </p>
                </div>
              </section>

              <Separator />

              {/* 2. Định nghĩa */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-primary">
                  2. Định Nghĩa
                </h2>
                <div className="space-y-2 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>
                        &ldquo;Chúng tôi&rdquo;, &ldquo;ZenKoi&rdquo;
                      </strong>
                      : Công ty TNHH ZenKoi và các đơn vị liên quan
                    </li>
                    <li>
                      <strong>
                        &ldquo;Khách hàng&rdquo;, &ldquo;Bạn&rdquo;
                      </strong>
                      : Người sử dụng dịch vụ của ZenKoi
                    </li>
                    <li>
                      <strong>&ldquo;Sản phẩm&rdquo;</strong>: Các loại cá Koi,
                      phụ kiện và dịch vụ liên quan
                    </li>
                    <li>
                      <strong>&ldquo;Đơn hàng&rdquo;</strong>: Yêu cầu mua hàng
                      được xác nhận bởi khách hàng
                    </li>
                    <li>
                      <strong>&ldquo;Website&rdquo;</strong>: Trang web
                      zenkoi.com và các ứng dụng liên quan
                    </li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* 3. Điều kiện sử dụng */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-primary">
                  3. Điều Kiện Sử Dụng
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <h3 className="font-medium text-foreground">
                    3.1 Tuổi tác và năng lực
                  </h3>
                  <p>
                    Để sử dụng dịch vụ của chúng tôi, bạn phải từ đủ 18 tuổi trở
                    lên hoặc có sự đồng ý của phụ huynh/người giám hộ hợp pháp.
                  </p>

                  <h3 className="font-medium text-foreground">3.2 Tài khoản</h3>
                  <p>
                    Bạn có trách nhiệm bảo mật thông tin tài khoản và mật khẩu.
                    Mọi hoạt động xảy ra dưới tài khoản của bạn sẽ được coi là
                    do bạn thực hiện.
                  </p>

                  <h3 className="font-medium text-foreground">
                    3.3 Thông tin chính xác
                  </h3>
                  <p>
                    Bạn cam kết cung cấp thông tin chính xác, đầy đủ khi đăng ký
                    tài khoản hoặc đặt hàng.
                  </p>
                </div>
              </section>

              <Separator />

              {/* 4. Chính sách đặt hàng */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-primary">
                  4. Chính Sách Đặt Hàng
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <h3 className="font-medium text-foreground">
                    4.1 Quy trình đặt hàng
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Chọn sản phẩm và thêm vào giỏ hàng</li>
                    <li>Cung cấp thông tin giao hàng chính xác</li>
                    <li>Chọn phương thức thanh toán</li>
                    <li>Xác nhận đơn hàng</li>
                  </ul>

                  <h3 className="font-medium text-foreground">
                    4.2 Xác nhận đơn hàng
                  </h3>
                  <p>
                    Đơn hàng sẽ được xác nhận trong vòng 24 giờ làm việc. Chúng
                    tôi sẽ liên hệ với bạn để xác nhận thông tin trước khi xử
                    lý.
                  </p>

                  <h3 className="font-medium text-foreground">
                    4.3 Thay đổi đơn hàng
                  </h3>
                  <p>
                    Bạn có thể thay đổi đơn hàng trong vòng 2 giờ sau khi đặt.
                    Sau thời gian này, đơn hàng sẽ được xử lý và không thể thay
                    đổi.
                  </p>
                </div>
              </section>

              <Separator />

              {/* 5. Chính sách giá cả */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-primary">
                  5. Chính Sách Giá Cả
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <h3 className="font-medium text-foreground">
                    5.1 Giá niêm yết
                  </h3>
                  <p>
                    Tất cả giá cả được niêm yết trên website là giá bán lẻ cuối
                    cùng, đã bao gồm thuế VAT (nếu có).
                  </p>

                  <h3 className="font-medium text-foreground">
                    5.2 Thay đổi giá
                  </h3>
                  <p>
                    Chúng tôi có quyền thay đổi giá cả mà không cần thông báo
                    trước. Giá áp dụng là giá tại thời điểm đặt hàng.
                  </p>

                  <h3 className="font-medium text-foreground">
                    5.3 Khuyến mãi
                  </h3>
                  <p>
                    Các chương trình khuyến mãi có thời hạn sử dụng cụ thể. Mỗi
                    khách hàng chỉ được áp dụng một chương trình khuyến mãi cho
                    mỗi đơn hàng.
                  </p>
                </div>
              </section>

              <Separator />

              {/* 6. Chính sách giao hàng */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-primary">
                  6. Chính Sách Giao Hàng
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <h3 className="font-medium text-foreground">
                    6.1 Phạm vi giao hàng
                  </h3>
                  <p>
                    Chúng tôi giao hàng trên toàn quốc. Phí giao hàng sẽ được
                    tính dựa trên khoảng cách và trọng lượng đơn hàng.
                  </p>

                  <h3 className="font-medium text-foreground">
                    6.2 Thời gian giao hàng
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Nội thành: 1-2 ngày làm việc</li>
                    <li>Ngoại thành: 2-5 ngày làm việc</li>
                    <li>Các tỉnh miền núi: 3-7 ngày làm việc</li>
                  </ul>

                  <h3 className="font-medium text-foreground">
                    6.3 Điều kiện giao hàng
                  </h3>
                  <p>
                    Khách hàng phải có mặt tại địa chỉ giao hàng trong giờ hành
                    chính. Trường hợp vắng mặt, đơn hàng sẽ được giao lại hoặc
                    hoàn trả.
                  </p>

                  <h3 className="font-medium text-foreground">
                    6.4 Bảo quản cá Koi
                  </h3>
                  <p>
                    Chúng tôi sử dụng hệ thống vận chuyển chuyên dụng cho cá Koi
                    với:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Hệ thống lọc oxy tự động</li>
                    <li>Nhiệt độ nước được kiểm soát</li>
                    <li>Đóng gói chuyên nghiệp chống sốc</li>
                    <li>Theo dõi nhiệt độ 24/7</li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* 7. Chính sách thanh toán */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-primary">
                  7. Chính Sách Thanh Toán
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <h3 className="font-medium text-foreground">
                    7.1 Phương thức thanh toán
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Thanh toán khi nhận hàng (COD)</li>
                    <li>Chuyển khoản ngân hàng</li>
                    <li>
                      Thanh toán qua ví điện tử (Momo, ZaloPay, ViettelPay)
                    </li>
                    <li>Thanh toán bằng thẻ tín dụng/ghi nợ</li>
                  </ul>

                  <h3 className="font-medium text-foreground">
                    7.2 Xác nhận thanh toán
                  </h3>
                  <p>
                    Đơn hàng sẽ được xử lý sau khi thanh toán thành công. Chúng
                    tôi sẽ gửi xác nhận thanh toán qua email/SMS.
                  </p>

                  <h3 className="font-medium text-foreground">7.3 Hoàn tiền</h3>
                  <p>
                    Trường hợp hoàn tiền, chúng tôi sẽ xử lý trong vòng 3-5 ngày
                    làm việc kể từ khi nhận được yêu cầu hợp lệ.
                  </p>
                </div>
              </section>

              <Separator />

              {/* 8. Chính sách đổi trả */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-primary">
                  8. Chính Sách Đổi Trả
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <h3 className="font-medium text-foreground">
                    8.1 Điều kiện đổi trả
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Sản phẩm còn nguyên vẹn, chưa qua sử dụng</li>
                    <li>Còn đầy đủ tem mác, bao bì gốc</li>
                    <li>Còn hóa đơn mua hàng</li>
                    <li>Trong thời hạn 7 ngày kể từ ngày nhận hàng</li>
                  </ul>

                  <h3 className="font-medium text-foreground">
                    8.2 Trường hợp không đổi trả
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Cá Koi đã chết do lỗi của khách hàng</li>
                    <li>Sản phẩm đã qua sử dụng hoặc hư hỏng do khách hàng</li>
                    <li>Quá thời hạn đổi trả</li>
                    <li>Không có hóa đơn hoặc phiếu bảo hành</li>
                  </ul>

                  <h3 className="font-medium text-foreground">
                    8.3 Quy trình đổi trả
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Liên hệ bộ phận chăm sóc khách hàng</li>
                    <li>Cung cấp thông tin đơn hàng và lý do đổi trả</li>
                    <li>Gửi sản phẩm về kho (miễn phí vận chuyển)</li>
                    <li>Nhận sản phẩm mới hoặc hoàn tiền trong 3-5 ngày</li>
                  </ol>
                </div>
              </section>

              <Separator />

              {/* 9. Bảo hành */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-primary">
                  9. Chính Sách Bảo Hành
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <h3 className="font-medium text-foreground">
                    9.1 Thời hạn bảo hành
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Cá Koi giống: 30 ngày kể từ ngày nhận hàng</li>
                    <li>Phụ kiện hồ cá: 6 tháng - 1 năm tùy sản phẩm</li>
                    <li>Thiết bị lọc: 12 tháng</li>
                  </ul>

                  <h3 className="font-medium text-foreground">
                    9.2 Điều kiện bảo hành
                  </h3>
                  <p>
                    Bảo hành chỉ áp dụng khi có lỗi từ nhà sản xuất. Khách hàng
                    phải tuân thủ hướng dẫn sử dụng và bảo quản đúng cách.
                  </p>

                  <h3 className="font-medium text-foreground">
                    9.3 Quy trình bảo hành
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Liên hệ hotline 1900-xxxx</li>
                    <li>Mô tả tình trạng lỗi và cung cấp hình ảnh</li>
                    <li>Đưa ra phương án sửa chữa/thay thế</li>
                    <li>Gửi kỹ thuật viên hoặc hướng dẫn sửa chữa</li>
                  </ol>
                </div>
              </section>

              <Separator />

              {/* 10. Quyền và nghĩa vụ */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-primary">
                  10. Quyền và Nghĩa Vụ
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <h3 className="font-medium text-foreground">
                    10.1 Quyền của khách hàng
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Nhận sản phẩm chất lượng đúng như mô tả</li>
                    <li>Được tư vấn và hỗ trợ kỹ thuật</li>
                    <li>Đổi trả sản phẩm theo chính sách</li>
                    <li>Bảo mật thông tin cá nhân</li>
                  </ul>

                  <h3 className="font-medium text-foreground">
                    10.2 Nghĩa vụ của khách hàng
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Cung cấp thông tin chính xác khi đặt hàng</li>
                    <li>Thanh toán đúng và đầy đủ</li>
                    <li>Tuân thủ hướng dẫn sử dụng và bảo quản</li>
                    <li>Thông báo kịp thời về vấn đề phát sinh</li>
                  </ul>

                  <h3 className="font-medium text-foreground">
                    10.3 Quyền của ZenKoi
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Từ chối đơn hàng không hợp lệ</li>
                    <li>Thay đổi chính sách mà không cần thông báo trước</li>
                    <li>Yêu cầu xác minh thông tin khách hàng</li>
                    <li>Tạm ngừng dịch vụ để bảo trì hệ thống</li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* 11. Bảo mật thông tin */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-primary">
                  11. Bảo Mật Thông Tin
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Chúng tôi cam kết bảo mật thông tin cá nhân của khách hàng
                    theo quy định của pháp luật Việt Nam và các tiêu chuẩn quốc
                    tế.
                  </p>
                  <p>Thông tin của bạn sẽ được sử dụng để:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Xử lý đơn hàng và giao hàng</li>
                    <li>Cung cấp dịch vụ chăm sóc khách hàng</li>
                    <li>Gửi thông tin khuyến mãi (nếu bạn đồng ý)</li>
                    <li>Cải thiện chất lượng dịch vụ</li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* 12. Giải quyết tranh chấp */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-primary">
                  12. Giải Quyết Tranh Chấp
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương
                    lượng. Trường hợp không thể thương lượng, tranh chấp sẽ được
                    đưa ra tòa án có thẩm quyền tại Việt Nam giải quyết.
                  </p>
                  <p>
                    Chúng tôi khuyến khích khách hàng liên hệ bộ phận chăm sóc
                    khách hàng để được hỗ trợ kịp thời.
                  </p>
                </div>
              </section>

              <Separator />

              {/* 13. Điều khoản cuối cùng */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-primary">
                  13. Điều Khoản Cuối Cùng
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Các điều khoản này có thể được cập nhật mà không cần thông
                    báo trước. Phiên bản mới nhất sẽ được đăng tải trên website.
                  </p>
                  <p>
                    Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa
                    với việc bạn chấp nhận các điều khoản mới.
                  </p>
                  <p className="font-medium">
                    Nếu bạn có bất kỳ câu hỏi nào về điều khoản này, vui lòng
                    liên hệ:
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p>
                      <strong>ZenKoi Support</strong>
                    </p>
                    <p>Email: support@zenkoi.com</p>
                    <p>Hotline: 1900-XXXX</p>
                    <p>Website: www.zenkoi.com</p>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-muted-foreground">
            <p>&copy; 2025 ZenKoi. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
