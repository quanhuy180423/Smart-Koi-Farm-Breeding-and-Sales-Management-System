import { useQuery } from "@tanstack/react-query";
import {
  koiIncidentService,
  KoiIncidentHistory,
} from "@/lib/api/services/fetchKoiIncident";

export const useKoiIncident = (koiFishId: number, enabled: boolean = true) => {
  return useQuery<KoiIncidentHistory[]>({
    queryKey: ["koiIncidentHistory", koiFishId],
    queryFn: async () => {
      const response =
        await koiIncidentService.getKoiIncidentHistory(koiFishId);
      return response.result || [];
    },
    enabled: enabled && !!koiFishId,
  });
};

export default useKoiIncident;
