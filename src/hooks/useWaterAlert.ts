import { useQuery } from "@tanstack/react-query";
import {
  waterAlertService,
  WaterAlertSearchParams,
} from "@/lib/api/services/fetchWaterAlert";

export const useGetWaterAlerts = (params: WaterAlertSearchParams) => {
  return useQuery({
    queryKey: ["waterAlerts", params],
    queryFn: async () => {
      const response = await waterAlertService.getWaterAlerts(params);
      return response.result;
    },
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

export default useGetWaterAlerts;
