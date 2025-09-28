"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Fish,
  Target,
  Eye,
  Shield,
  Zap,
  Users,
  Award,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const features = [
    {
      icon: <Fish className="w-8 h-8 text-primary" />,
      title: "Quản lý đàn cá chuyên nghiệp",
      description:
        "Theo dõi sức khỏe, nguồn gốc và quá trình sinh sản của từng con cá Koi một cách chi tiết.",
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Theo dõi RFID",
      description:
        "Công nghệ RFID tiên tiến để theo dõi và quản lý cá Koi một cách chính xác và hiệu quả.",
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Hệ thống tư vấn AI",
      description:
        "Hệ thống tư vấn thông minh gợi ý cặp cá phù hợp để tối ưu hóa chất lượng đàn cá.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Phân tích & Báo cáo",
      description:
        "Báo cáo chi tiết về hiệu suất trang trại, doanh thu và xu hướng thị trường.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Quản lý bán hàng",
      description:
        "Quản lý bán hàng, khách hàng và đơn hàng một cách chuyên nghiệp và hiệu quả.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Hệ thống đa người dùng",
      description:
        "Hỗ trợ nhiều vai trò người dùng với quyền hạn và chức năng phù hợp.",
    },
  ];

  const stats = [
    { number: "500+", label: "Con cá Koi được quản lý" },
    { number: "50+", label: "Trang trại đối tác" },
    { number: "98%", label: "Độ chính xác dữ liệu" },
    { number: "24/7", label: "Hỗ trợ kỹ thuật" },
  ];

  const team = [
    {
      name: "Nguyễn Văn A",
      role: "CEO & Founder",
      image: "/api/placeholder/150/150",
      description:
        "Chuyên gia nuôi cá Koi với hơn 15 năm kinh nghiệm trong ngành.",
    },
    {
      name: "Trần Thị B",
      role: "Technical Director",
      image: "/api/placeholder/150/150",
      description:
        "Kỹ sư phần mềm với chuyên môn về IoT và AI trong nông nghiệp.",
    },
    {
      name: "Lê Văn C",
      role: "Operations Manager",
      image: "/api/placeholder/150/150",
      description:
        "Quản lý vận hành với kinh nghiệm quản lý trang trại quy mô lớn.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              <Star className="w-4 h-4 mr-2" />
              Hệ thống quản lý trang trại cá Koi hàng đầu Việt Nam
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Về <span className="text-primary">ZenKoi</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Chúng tôi cung cấp giải pháp công nghệ tiên tiến cho việc nuôi
              dưỡng và quản lý đàn cá Koi, kết hợp giữa truyền thống và công
              nghệ hiện đại.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-primary/20"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="bg-white/90 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-primary" />
                  <CardTitle className="text-2xl">Sứ mệnh</CardTitle>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  Mang đến giải pháp công nghệ tiên tiến giúp các trang trại cá
                  Koi nâng cao hiệu quả sản xuất, tối ưu hóa chất lượng đàn cá
                  và tăng trưởng bền vững. Chúng tôi cam kết đồng hành cùng nông
                  dân trong việc hiện đại hóa ngành nuôi cá Koi.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-8 h-8 text-primary" />
                  <CardTitle className="text-2xl">Tầm nhìn</CardTitle>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  Trở thành đơn vị dẫn đầu về công nghệ quản lý trang trại cá
                  Koi tại Việt Nam, góp phần đưa ngành nuôi cá Koi Việt Nam vươn
                  tầm quốc tế với chất lượng và hiệu quả vượt trội.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hệ thống của chúng tôi được thiết kế với các tính năng tiên tiến
              để đáp ứng mọi nhu cầu quản lý trang trại cá Koi hiện đại.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/90 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tại sao chọn ZenKoi?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:items-start">
            <div className="space-y-6 flex flex-col justify-between h-full">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Công nghệ tiên tiến
                  </h3>
                  <p className="text-muted-foreground">
                    Sử dụng RFID, AI và IoT để quản lý đàn cá một cách chính xác
                    và hiệu quả nhất.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Dễ sử dụng</h3>
                  <p className="text-muted-foreground">
                    Giao diện thân thiện, trực quan và dễ hiểu, phù hợp với mọi
                    đối tượng người dùng từ cơ bản đến chuyên nghiệp.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Hỗ trợ 24/7</h3>
                  <p className="text-muted-foreground">
                    Đội ngũ kỹ thuật chuyên nghiệp luôn sẵn sàng hỗ trợ khách
                    hàng mọi lúc, mọi nơi với chất lượng dịch vụ tốt nhất.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 flex flex-col justify-between h-full">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Bảo mật cao</h3>
                  <p className="text-muted-foreground">
                    Hệ thống bảo mật đa tầng với các tiêu chuẩn quốc tế, đảm bảo
                    an toàn tuyệt đối cho dữ liệu và thông tin khách hàng.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Cập nhật liên tục
                  </h3>
                  <p className="text-muted-foreground">
                    Luôn cập nhật các tính năng mới nhất theo xu hướng công nghệ
                    hiện đại và nhu cầu thực tế của người dùng.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Chi phí hợp lý</h3>
                  <p className="text-muted-foreground">
                    Giải pháp tối ưu về chi phí với mức đầu tư hợp lý, mang lại
                    lợi nhuận cao và hiệu quả kinh tế bền vững cho khách hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Đội ngũ của chúng tôi
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Đội ngũ chuyên gia giàu kinh nghiệm trong lĩnh vực nuôi cá Koi và
              công nghệ phần mềm, cam kết mang đến giải pháp tốt nhất cho khách
              hàng.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="bg-white/90 backdrop-blur-sm border-primary/20 text-center hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-12 h-12 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">
                Liên hệ với chúng tôi
              </CardTitle>
              <CardDescription className="text-lg">
                Có câu hỏi hoặc cần tư vấn? Hãy liên hệ với chúng tôi để được hỗ
                trợ tốt nhất.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Hotline</h3>
                  <p className="text-muted-foreground">1900-xxxx</p>
                  <p className="text-muted-foreground">24/7 hỗ trợ</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">support@zenkoi.vn</p>
                  <p className="text-muted-foreground">sales@zenkoi.vn</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Địa chỉ</h3>
                  <p className="text-muted-foreground">123 Đường ABC</p>
                  <p className="text-muted-foreground">Quận 1, TP.HCM</p>
                </div>
              </div>

              <Separator className="my-8" />

              <div className="text-center">
                <Button asChild size="lg" className="mr-4">
                  <Link href="#">
                    <Phone className="w-4 h-4 mr-2" />
                    Liên hệ ngay
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#">
                    <Award className="w-4 h-4 mr-2" />
                    Đăng ký
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
