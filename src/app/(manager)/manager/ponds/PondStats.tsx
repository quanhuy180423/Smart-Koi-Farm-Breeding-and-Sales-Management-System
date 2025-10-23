import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Building2, CircleX, Droplets } from "lucide-react";

interface PondStatsProps {
  totalCount: number;
  totalFish: number;
  activePondsCount: number;
  maintenancePondsCount: number;
}

const PondStats = ({
  totalCount,
  totalFish,
  activePondsCount,
  maintenancePondsCount,
}: PondStatsProps) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Tổng số hồ</CardTitle>
        <Building2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalCount}</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Tổng cá nuôi (Giả lập)
        </CardTitle>
        <Droplets className="h-4 w-4 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalFish}</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
        <Activity className="h-4 w-4 text-green-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{activePondsCount}</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Đang bảo trì</CardTitle>
        <CircleX className="h-4 w-4 text-orange-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{maintenancePondsCount}</div>
      </CardContent>
    </Card>
  </div>
);

export default PondStats;
