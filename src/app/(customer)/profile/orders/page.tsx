"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Search,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  X,
  ArrowLeft,
  Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Type definitions
interface OrderItem {
  id: string;
  name: string;
  variety: string;
  size: string;
  age: string;
  price: number;
  quantity: number;
  image: string;
}

interface Shipping {
  method: string;
  address: string;
  trackingNumber: string | null;
}

interface Payment {
  method: string;
  status: "paid" | "pending" | "cancelled";
}

type OrderStatus = "processing" | "shipping" | "delivered" | "cancelled";

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  shipping: Shipping;
  payment: Payment;
}

// Mock order data
const mockOrders: Order[] = [
  {
    id: "KOI001234",
    date: "2024-01-15",
    status: "delivered",
    total: 25000000,
    items: [
      {
        id: "1",
        name: "Sanke Jumbo",
        variety: "Sanke",
        size: "45cm",
        age: "3 năm",
        price: 25000000,
        quantity: 1,
        image: "/beautiful-sanke-koi-fish-with-red-white-black-patt.jpg",
      },
    ],
    shipping: {
      method: "Giao hàng tận nơi",
      address: "123 Đường ABC, Phường 1, Quận 1, TP.HCM",
      trackingNumber: "VN123456789",
    },
    payment: {
      method: "Thanh toán khi nhận hàng",
      status: "paid",
    },
  },
  {
    id: "KOI001235",
    date: "2024-01-20",
    status: "shipping",
    total: 35000000,
    items: [
      {
        id: "2",
        name: "Kohaku Premium",
        variety: "Kohaku",
        size: "35cm",
        age: "2 năm",
        price: 15000000,
        quantity: 1,
        image: "/beautiful-red-and-white-kohaku-koi-fish.jpg",
      },
      {
        id: "3",
        name: "Showa Champion",
        variety: "Showa",
        size: "40cm",
        age: "2.5 năm",
        price: 20000000,
        quantity: 1,
        image: "/beautiful-showa-koi-fish-black-red-white-pattern.jpg",
      },
    ],
    shipping: {
      method: "Giao hàng tận nơi",
      address: "123 Đường ABC, Phường 1, Quận 1, TP.HCM",
      trackingNumber: "VN123456790",
    },
    payment: {
      method: "Chuyển khoản ngân hàng",
      status: "paid",
    },
  },
  {
    id: "KOI001236",
    date: "2024-01-25",
    status: "processing",
    total: 12000000,
    items: [
      {
        id: "4",
        name: "Tancho Goshiki",
        variety: "Tancho",
        size: "30cm",
        age: "1.5 năm",
        price: 12000000,
        quantity: 1,
        image: "/beautiful-tancho-koi-fish-with-red-circle-on-head.jpg",
      },
    ],
    shipping: {
      method: "Giao hàng tận nơi",
      address: "123 Đường ABC, Phường 1, Quận 1, TP.HCM",
      trackingNumber: null,
    },
    payment: {
      method: "Thanh toán khi nhận hàng",
      status: "pending",
    },
  },
  {
    id: "KOI001237",
    date: "2024-01-28",
    status: "cancelled",
    total: 8000000,
    items: [
      {
        id: "5",
        name: "Ogon Platinum",
        variety: "Ogon",
        size: "38cm",
        age: "2 năm",
        price: 8000000,
        quantity: 1,
        image: "/beautiful-platinum-ogon-koi-fish-metallic-silver.jpg",
      },
    ],
    shipping: {
      method: "Giao hàng tận nơi",
      address: "123 Đường ABC, Phường 1, Quận 1, TP.HCM",
      trackingNumber: null,
    },
    payment: {
      method: "Thanh toán khi nhận hàng",
      status: "cancelled",
    },
  },
];

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  processing: {
    label: "Đang xử lý",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  shipping: {
    label: "Đang giao hàng",
    color: "bg-blue-100 text-blue-800",
    icon: Truck,
  },
  delivered: {
    label: "Đã giao hàng",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800", icon: X },
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = order.id
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getOrdersByStatus = (status: OrderStatus) => {
    return mockOrders.filter((order) => order.status === status);
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const StatusIcon = statusConfig[order.status].icon;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Đơn hàng #{order.id}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatDate(order.date)}
              </p>
            </div>
            <Badge className={statusConfig[order.status].color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig[order.status].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-md overflow-hidden">
              <Image
                src={order.items[0].image || "/placeholder.svg"}
                alt={order.items[0].name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">{order.items[0].name}</p>
              <p className="text-sm text-muted-foreground">
                {order.items.length > 1
                  ? `và ${order.items.length - 1} sản phẩm khác`
                  : order.items[0].variety}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Tổng tiền</p>
              <p className="font-bold text-primary">
                {formatPrice(order.total)}
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Chi tiết
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-3xl max-h-[80vh] overflow-y-auto ">
                  <DialogHeader>
                    <DialogTitle>Chi tiết đơn hàng #{order.id}</DialogTitle>
                  </DialogHeader>
                  {selectedOrder && <OrderDetails order={selectedOrder} />}
                </DialogContent>
              </Dialog>
              {order.status === "delivered" && (
                <Button size="sm">
                  <Star className="w-4 h-4 mr-1" />
                  Đánh giá
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const OrderDetails = ({ order }: { order: Order }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Ngày đặt hàng</p>
          <p className="font-medium">{formatDate(order.date)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Trạng thái</p>
          <Badge className={statusConfig[order.status].color}>
            {statusConfig[order.status].label}
          </Badge>
        </div>
        <div>
          <p className="text-muted-foreground">Phương thức thanh toán</p>
          <p className="font-medium">{order.payment.method}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Mã vận đơn</p>
          <p className="font-medium">
            {order.shipping.trackingNumber || "Chưa có"}
          </p>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-semibold mb-3">Sản phẩm đã đặt</h4>
        <div className="space-y-3">
          {order.items.map((item: OrderItem) => (
            <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
              <div className="relative w-16 h-16 rounded-md overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.variety}</p>
                <p className="text-sm text-muted-foreground">
                  {item.size} • {item.age}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">Số lượng: {item.quantity}</span>
                  <span className="font-semibold">
                    {formatPrice(item.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-semibold mb-3">Địa chỉ giao hàng</h4>
        <p className="text-sm">{order.shipping.address}</p>
      </div>

      <Separator />

      <div className="flex justify-between items-center font-bold text-lg">
        <span>Tổng cộng:</span>
        <span className="text-primary">{formatPrice(order.total)}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="ghost" size="sm">
              <Link href="/profile">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại hồ sơ
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>
              <p className="text-muted-foreground">
                Theo dõi và quản lý các đơn hàng
              </p>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                Tất cả ({mockOrders.length})
              </TabsTrigger>
              <TabsTrigger value="processing">
                Đang xử lý ({getOrdersByStatus("processing").length})
              </TabsTrigger>
              <TabsTrigger value="shipping">
                Đang giao ({getOrdersByStatus("shipping").length})
              </TabsTrigger>
              <TabsTrigger value="delivered">
                Đã giao ({getOrdersByStatus("delivered").length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Đã hủy ({getOrdersByStatus("cancelled").length})
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo mã đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="processing">Đang xử lý</SelectItem>
                  <SelectItem value="shipping">Đang giao hàng</SelectItem>
                  <SelectItem value="delivered">Đã giao hàng</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="all" className="space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Không tìm thấy đơn hàng nào
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="processing" className="space-y-4">
              {getOrdersByStatus("processing").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </TabsContent>

            <TabsContent value="shipping" className="space-y-4">
              {getOrdersByStatus("shipping").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </TabsContent>

            <TabsContent value="delivered" className="space-y-4">
              {getOrdersByStatus("delivered").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {getOrdersByStatus("cancelled").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
