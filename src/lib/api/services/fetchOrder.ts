export interface OrderDetailResponse {
  id: number;
  orderId: number;
  koiFishId?: number;
  koiFishName?: string;
  packetFishId?: number;
  packetFishName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export enum OrderStatus {
  CREATED = "Created",
  CONFIRMED = "Confirmed",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
  COMPLETED = "Completed",
}

export interface OrderRespponse {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  createdAt: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  promotionId?: number;
  promotionName?: string;
  orderDetails: OrderDetailResponse[];
}
