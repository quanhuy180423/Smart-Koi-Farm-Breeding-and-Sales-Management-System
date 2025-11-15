"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IncidentList } from "@/components/manager/IncidentList";

export default function IncidentsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý sự cố</h1>
        <p className="text-muted-foreground">
          Theo dõi và quản lý các sự cố tại trang trại
        </p>
      </div>

      {/* Incidents List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sự cố</CardTitle>
          <CardDescription>
            Xem và lọc các sự cố theo tiêu chí khác nhau
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IncidentList />
        </CardContent>
      </Card>
    </div>
  );
}
