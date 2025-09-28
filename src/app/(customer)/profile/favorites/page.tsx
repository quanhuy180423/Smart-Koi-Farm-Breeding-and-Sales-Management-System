"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, Share2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CustomerLayout from "@/components/customer/CustomerLayout";
import formatCurrency from "@/lib/utils/numbers";
import { useCartStore } from "@/store/cart-store";

// Mock data for favorite koi
const favoriteKoi = [
  {
    id: 1,
    name: "Kohaku Premium",
    variety: "Kohaku",
    size: "35cm",
    age: "2 năm",
    gender: "Cái",
    origin: "Nhật Bản",
    price: 15000000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg",
    status: "Có sẵn",
  },
  {
    id: 2,
    name: "Sanke Champion",
    variety: "Sanke",
    size: "40cm",
    age: "3 năm",
    gender: "Đực",
    origin: "Nhật Bản",
    price: 25000000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-red-and-white-kohaku-koi-fish-shXq5nIYD8xv7a5mdkJBQJJ0llXM2v.jpg",
    status: "Hết hàng",
  },
  {
    id: 3,
    name: "Showa Elite",
    variety: "Showa",
    size: "38cm",
    age: "2.5 năm",
    gender: "Cái",
    origin: "Nhật Bản",
    price: 18000000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-platinum-ogon-koi-fish-metallic-silver-bNZw5PNFEYXbZMPAY0Zxrvlscb335x.jpg",
    status: "Có sẵn",
  },
  {
    id: 4,
    name: "Platinum Ogon",
    variety: "Ogon",
    size: "38cm",
    age: "2 năm",
    gender: "Cái",
    origin: "Nhật Bản",
    price: 8000000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg",
    status: "Có sẵn",
  },
];

export default function FavoritesPage() {
  const { addItem } = useCartStore();

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Cá Koi yêu thích</h1>
            <p className="text-muted-foreground">
              Danh sách các con cá Koi bạn quan tâm
            </p>
          </div>
        </div>

        {favoriteKoi.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Chưa có cá Koi yêu thích
              </h3>
              <p className="text-muted-foreground mb-4">
                Khám phá bộ sưu tập và thêm những con cá Koi bạn yêu thích
              </p>
              <Link href="/catalog">
                <Button>Khám phá ngay</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteKoi.map((koi) => (
              <Card
                key={koi.id}
                className="overflow-hidden hover:shadow-lg transition-shadow py-0"
              >
                <div className="relative">
                  <div className="aspect-square bg-muted">
                    <Image
                      src={koi.image}
                      alt={koi.name}
                      className="w-full h-full object-cover"
                      width={400}
                      height={400}
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/80 hover:bg-white"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge
                    className="absolute top-2 left-2"
                    variant={koi.status === "Có sẵn" ? "default" : "secondary"}
                  >
                    {koi.status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{koi.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {koi.variety}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(koi.price)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <span>Kích thước: {koi.size}</span>
                      <span>Tuổi: {koi.age}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <span>Giới tính: {koi.gender}</span>
                      <span>Xuất xứ: {koi.origin}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/koi/${koi.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        addItem({
                          id: koi.id.toString(),
                          name: koi.name,
                          variety: koi.variety,
                          price: koi.price,
                          size: koi.size,
                          age: koi.age,
                          image: koi.image,
                        })
                      }
                      disabled={koi.status !== "Có sẵn"}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {koi.status === "Có sẵn" ? "Thêm giỏ hàng" : "Hết hàng"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
