import apiService, { BaseResponse } from "../apiClient";

export enum AffectedStatus {
  HEALTHY = "Healthy",
  WEAK = "Weak",
  SICK = "Sick",
}

export interface KoiIncidentHistory {
  id: number;
  incidentId: number;
  koiFishId: number;
  koiFishRFID: string;
  affectedStatus: AffectedStatus;
  specificSymptoms: string;
  requiresTreatment: boolean;
  isIsolated: boolean;
  affectedFrom: string;
  recoveredAt: string | null;
  treatmentNotes: string;
}

const baseUrl = "/api/KoiIncident";

export const koiIncidentService = {
  getKoiIncidentHistory: async (
    koiFishId: number,
  ): Promise<BaseResponse<KoiIncidentHistory[]>> => {
    const response = await apiService.get<BaseResponse<KoiIncidentHistory[]>>(
      `${baseUrl}/koi/${koiFishId}/history`,
    );
    return response.data;
  },
};

export default koiIncidentService;
