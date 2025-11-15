"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WaterAlertList } from "@/components/manager/WaterAlertList";

export default function NotificationsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cảnh báo hệ thống</h1>
        <p className="text-muted-foreground">
          Theo dõi các cảnh báo chất lượng nước trong trang trại
        </p>
      </div>

      {/* Water Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Cảnh báo chất lượng nước</CardTitle>
          <CardDescription>
            Quản lý và theo dõi các cảnh báo liên quan đến chất lượng nước trong
            các hồ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WaterAlertList />
        </CardContent>
      </Card>
    </div>
  );
}
