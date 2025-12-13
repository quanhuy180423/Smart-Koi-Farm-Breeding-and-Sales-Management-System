import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";

export enum IncidentSeverity {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  URGENT = "Urgent",
}

export enum IncidentStatus {
  REPORTED = "Reported",
  INVESTIGATING = "Investigating",
  RESOLVED = "Resolved",
  CANCELLED = "Cancelled",
}

export enum AffectedStatus {
  HEALTHY = "Healthy",
  WARNING = "Warning",
  SICK = "Sick",
}

export interface KoiIncident {
  id: number;
  koiFishId: number;
  koiFishRFID: string;
  affectedStatus: AffectedStatus;
  specificSymptoms: string;
  requiresTreatment: boolean;
  isIsolated: boolean;
}

export interface PondIncident {
  id: number;
  pondId: number;
  pondName: string;
  environmentalChanges: string;
  requiresWaterChange: boolean;
  fishDiedCount: number;
}

export interface IncidentTypeResponse {
  id: number;
  name: string;
  description: string;
  defaultSeverity: IncidentSeverity;
  affectsBreeding: boolean;
}

export interface IncidentResponse {
  id: number;
  incidentType: IncidentTypeResponse;
  incidentTitle: string;
  description: string;
  status: IncidentStatus;
  occurredAt: string;
  createdAt: string;
  updatedAt: string | null;
  resolvedAt: string | null;
  reportedByUserId: number;
  reportedByUserName: string;
  resolvedByUserId: number | null;
  resolvedByUserName: string | null;
  resolutionNotes: string | null;
  reportImages: string[];
  resolutionImages: string[];
  koiIncidents: KoiIncident[];
  pondIncidents: PondIncident[];
}

export interface IncidentSearchParams extends PagingRequest {
  search?: string;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  occurredFrom?: string;
  occurredTo?: string;
  pondId?: number;
  koiFishId?: number;
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
  incident?: {
    id: number;
    incidentTypeId: number;
    incidentTypeName: string;
    incidentTitle: string;
    description: string;
    severity: string;
    status: string;
    occurredAt: string;
    createdAt: string;
    resolutionNotes: string | null;
  };
}

const baseUrl = "/api/Incident";

export const incidentService = {
  getIncidents: async (
    request: IncidentSearchParams,
  ): Promise<BaseResponse<PagedResponse<IncidentResponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<IncidentResponse>>
    >(`${baseUrl}`, { ...filter });
    return response.data;
  },
  getKoiIncidentHistory: async (
    koiFishId: number,
  ): Promise<BaseResponse<KoiIncidentHistory[]>> => {
    const response = await apiService.get<BaseResponse<KoiIncidentHistory[]>>(
      `${baseUrl}/koi/${koiFishId}/history`,
    );
    return response.data;
  },
};

export default incidentService;
