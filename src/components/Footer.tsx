
import Image from "next/image";
import Logo from "@/assets/images/ZenKoi.png";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <Image
                src={Logo}
                alt="ZenKoi Logo"
                width={48}
                height={48}
                className="sm:w-16 sm:h-16"
              />
              <span className="text-xl sm:text-2xl font-bold text-primary">
                ZenKoi
              </span>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Trại cá Koi hàng đầu với công nghệ tiên tiến và chất lượng vượt
              trội.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Sản phẩm</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-muted-foreground text-sm sm:text-base">
              <li>
                <Link
                  href="/catalog"
                  className="hover:text-foreground transition-colors"
                >
                  Cá Koi Nhật Bản
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="hover:text-foreground transition-colors"
                >
                  Gói cá giống
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="hover:text-foreground transition-colors"
                >
                  Cá giống
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Dịch vụ</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-muted-foreground text-sm sm:text-base">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  Tư vấn chọn cá
                </Link>
              </li>
              <li>
                <Link
                  href="/polycies"
                  className="hover:text-foreground transition-colors"
                >
                  Chính sách
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  Bảo hành
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Liên hệ</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-muted-foreground text-sm sm:text-base">
              <li>Hotline: 0123 456 789</li>
              <li>Email: info@zenkoi.vn</li>
              <li>Địa chỉ: TP. Hồ Chí Minh</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 sm:mt-10 pt-4 text-center text-muted-foreground">
          <p className="text-sm sm:text-base">&copy; 2024 ZenKoi. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}