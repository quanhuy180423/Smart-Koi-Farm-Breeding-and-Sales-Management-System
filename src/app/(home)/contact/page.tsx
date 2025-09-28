import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Fish,
  Truck,
  Clipboard,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ - ZenKoi",
  description:
    "Liên hệ với ZenKoi để được tư vấn về cá Koi Nhật Bản chất lượng cao. Chúng tôi luôn sẵn sàng hỗ trợ bạn.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-foreground border-primary/20"
            >
              Hỗ trợ 24/7
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-xl text-muted-foreground">
              Đội ngũ chuyên gia ZenKoi luôn sẵn sàng tư vấn và hỗ trợ bạn tìm
              được những con cá Koi hoàn hảo
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Gửi tin nhắn cho chúng tôi
                </CardTitle>
                <CardDescription>
                  Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại với bạn
                  trong vòng 24h
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      placeholder="Nhập họ và tên của bạn"
                      className="border-border focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0xxx xxx xxx"
                      className="border-border focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="border-border focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Chủ đề</Label>
                  <select
                    id="subject"
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Chọn chủ đề</option>
                    <option value="buy-koi">Mua cá Koi</option>
                    <option value="consultation">Tư vấn chọn cá</option>
                    <option value="breeding">Dịch vụ phối giống</option>
                    <option value="care">Hướng dẫn chăm sóc</option>
                    <option value="transport">Vận chuyển</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Nội dung tin nhắn *</Label>
                  <Textarea
                    id="message"
                    placeholder="Mô tả chi tiết nhu cầu của bạn, loại cá Koi quan tâm, ngân sách dự kiến..."
                    className="min-h-[120px] border-border focus:border-primary"
                  />
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Gửi tin nhắn
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Địa chỉ</h3>
                    <p className="text-muted-foreground text-sm">
                      123 Đường Nguyễn Văn Linh
                      <br />
                      Phường An Phú, Quận 2<br />
                      TP. Hồ Chí Minh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Điện thoại</h3>
                    <p className="text-muted-foreground text-sm">
                      Hotline:{" "}
                      <a href="tel:0123456789" className="hover:text-primary">
                        0123 456 789
                      </a>
                      <br />
                      Zalo:{" "}
                      <a href="tel:0987654321" className="hover:text-primary">
                        0987 654 321
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Email</h3>
                    <p className="text-muted-foreground text-sm">
                      Tổng đài:{" "}
                      <a
                        href="mailto:info@zenkoi.vn"
                        className="hover:text-primary"
                      >
                        info@zenkoi.vn
                      </a>
                      <br />
                      Tư vấn:{" "}
                      <a
                        href="mailto:tuvan@zenkoi.vn"
                        className="hover:text-primary"
                      >
                        tuvan@zenkoi.vn
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Giờ làm việc
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Thứ 2 - Thứ 6: 8:00 - 18:00
                      <br />
                      Thứ 7 - Chủ nhật: 8:00 - 17:00
                      <br />
                      <span className="text-primary font-medium">
                        Tư vấn 24/7 qua hotline
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Kết nối với chúng tôi</CardTitle>
                <CardDescription>
                  Theo dõi để cập nhật những con cá Koi mới nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-blue-50 hover:border-blue-200"
                  >
                    <Facebook className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-pink-50 hover:border-pink-200"
                  >
                    <Instagram className="h-4 w-4 text-pink-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-red-50 hover:border-red-200"
                  >
                    <Youtube className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Services */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Dịch vụ nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Phone className="mr-2 h-4 w-4" /> Đặt lịch thăm trại
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Fish className="mr-2 h-4 w-4" /> Tư vấn chọn cá Koi
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Truck className="mr-2 h-4 w-4" /> Báo giá vận chuyển
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Clipboard className="mr-2 h-4 w-4" /> Hướng dẫn chăm sóc
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Bản đồ vị trí</CardTitle>
              <CardDescription>
                Ghé thăm trại cá ZenKoi để trực tiếp chọn lựa những con cá Koi
                ưng ý
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    Bản đồ Google Maps sẽ được tích hợp tại đây
                  </p>
                  <p className="text-sm text-muted-foreground">
                    123 Đường Nguyễn Văn Linh, Phường An Phú, Quận 2, TP.HCM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Câu hỏi thường gặp
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Một số câu hỏi khách hàng thường quan tâm
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">
                  Làm sao để chọn cá Koi phù hợp?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Chúng tôi sẽ tư vấn dựa trên mục đích nuôi (cảnh/thi đấu),
                  không gian hồ, ngân sách và sở thích cá nhân của bạn. Đội ngũ
                  chuyên gia có 15+ năm kinh nghiệm.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">
                  Có dịch vụ vận chuyển không?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Có, chúng tôi vận chuyển toàn quốc với hệ thống bảo ôn chuyên
                  dụng. Cam kết cá đến tay khách hàng trong tình trạng khỏe mạnh
                  100%.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">
                  Có chế độ bảo hành không?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tất cả cá Koi đều có chế độ bảo hành rõ ràng. Hỗ trợ tư vấn
                  chăm sóc miễn phí trong suốt quá trình nuôi.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">
                  Có thể thăm trại trực tiếp không?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Chúng tôi luôn chào đón khách hàng đến thăm trại. Vui lòng đặt
                  lịch trước để được hướng dẫn và tư vấn tốt nhất.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
