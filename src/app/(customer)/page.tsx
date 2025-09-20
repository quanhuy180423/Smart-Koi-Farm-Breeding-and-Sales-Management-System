import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Fish, Zap, Shield, Award, ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.jpg";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {/* <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src={logo} alt="Logo" width={60} height={60} />
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#catalog"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Danh mục cá
            </a>
            <a
              href="#technology"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Công nghệ
            </a>
            <a
              href="#about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Về chúng tôi
            </a>
            <a
              href="#contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Liên hệ
            </a>
          </nav>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Đăng nhập
          </Button>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-foreground border-primary/20"
                >
                  Công nghệ AI & RFID tiên tiến
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground text-balance">
                  Cá Koi Nhật Bản
                  <span className="text-primary block">Chất Lượng Cao</span>
                </h1>
                <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                  Trại cá Koi hàng đầu với hệ thống quản lý thông minh, đảm bảo
                  chất lượng và nguồn gốc rõ ràng cho từng con cá.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Khám phá cá Koi
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5 bg-transparent"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Xem video giới thiệu
                </Button>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">500+</div>
                  <div className="text-sm text-muted-foreground">
                    Cá Koi chất lượng
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">15+</div>
                  <div className="text-sm text-muted-foreground">
                    Năm kinh nghiệm
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    1000+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Khách hàng hài lòng
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 p-8">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg"
                  alt="Cá Koi Nhật Bản chất lượng cao"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    Theo dõi trực tiếp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Features */}
      <section id="technology" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-foreground border-primary/20"
            >
              Công nghệ tiên tiến
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
              Hệ thống quản lý thông minh
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Ứng dụng AI và RFID để đảm bảo chất lượng và truy xuất nguồn gốc
              hoàn hảo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Chip RFID</CardTitle>
                <CardDescription>
                  Mỗi con cá được gắn chip RFID để theo dõi và quản lý chính xác
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>AI Tư vấn</CardTitle>
                <CardDescription>
                  Hệ thống AI gợi ý cặp ghép tối ưu dựa trên dữ liệu di truyền
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Truy xuất nguồn gốc</CardTitle>
                <CardDescription>
                  Theo dõi hoàn chỉnh từ cá bố mẹ, ngày sinh đến quá trình nuôi
                  dưỡng
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Koi Catalog Preview */}
      <section id="catalog" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
              Bộ sưu tập cá Koi đặc biệt
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Khám phá những con cá Koi Nhật Bản thuần chủng với chất lượng vượt
              trội
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                id: 1,
                name: "Kohaku Premium",
                price: "15,000,000",
                age: "2 năm",
                size: "35cm",
              },
              {
                id: 2,
                name: "Sanke Đặc biệt",
                price: "22,000,000",
                age: "3 năm",
                size: "42cm",
              },
              {
                id: 3,
                name: "Showa Cao cấp",
                price: "18,000,000",
                age: "2.5 năm",
                size: "38cm",
              },
            ].map((koi, index) => (
              <Card
                key={index}
                className="border-border hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg"
                    alt={koi.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{koi.name}</CardTitle>
                      <CardDescription>
                        Tuổi: {koi.age} • Kích thước: {koi.size}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-foreground"
                    >
                      Có sẵn
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-2xl font-bold text-primary">
                      {koi.price}₫
                    </span>
                    <Link href={`/koi/${koi.id}`}>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                      >
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/catalog">
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5 bg-transparent"
              >
                Xem tất cả cá Koi
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
              Khách hàng nói gì về chúng tôi
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Anh Minh Tuấn",
                role: "Chủ hồ cá Koi",
                content:
                  "Chất lượng cá Koi tuyệt vời, hệ thống theo dõi rất chuyên nghiệp. Tôi rất hài lòng với dịch vụ.",
                rating: 5,
              },
              {
                name: "Chị Lan Anh",
                role: "Người sưu tầm",
                content:
                  "Công nghệ RFID giúp tôi yên tâm về nguồn gốc. Cá khỏe mạnh và đẹp như mô tả.",
                rating: 5,
              },
              {
                name: "Anh Đức Thành",
                role: "Chủ trang trại",
                content:
                  "Hệ thống AI tư vấn rất hữu ích cho việc chọn cá giống. Dịch vụ chuyên nghiệp.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-border">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 lg:p-16 text-center">
            <div className="space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
                Sẵn sàng sở hữu cá Koi chất lượng cao?
              </h2>
              <p className="text-xl text-muted-foreground text-pretty">
                Liên hệ với chúng tôi ngay hôm nay để được tư vấn và chọn lựa
                những con cá Koi phù hợp nhất
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Đặt hàng ngay
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5 bg-transparent"
                >
                  Tư vấn miễn phí
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Fish className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  KoiMaster
                </span>
              </div>
              <p className="text-muted-foreground">
                Trại cá Koi hàng đầu với công nghệ tiên tiến và chất lượng vượt
                trội.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Sản phẩm</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Cá Koi Nhật Bản
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Cá giống
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Phụ kiện hồ cá
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Dịch vụ</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Tư vấn chọn cá
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Vận chuyển
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Bảo hành
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Liên hệ</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Hotline: 0123 456 789</li>
                <li>Email: info@koimaster.vn</li>
                <li>Địa chỉ: TP. Hồ Chí Minh</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 KoiMaster. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
