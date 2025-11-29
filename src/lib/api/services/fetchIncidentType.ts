import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";
import { IncidentSeverity } from "./fetchIncident";

export interface IncidentType {
  id: number;
  name: string;
  description: string;
  defaultSeverity: IncidentSeverity;
  affectsBreeding: boolean;
}

export interface IncidentTypeSearchParams extends PagingRequest {
  search?: string;
  affectsBreeding?: boolean;
}

export interface IncidentTypeRequest {
  name: string;
  description: string;
  defaultSeverity: IncidentSeverity;
  affectsBreeding: boolean;
}

const baseUrl = "/api/IncidentType";

const incidentTypeService = {
  getIncidentTypes: async (
    request: IncidentTypeSearchParams,
  ): Promise<BaseResponse<PagedResponse<IncidentType>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<IncidentType>>
    >(`${baseUrl}`, { ...filter });
    return response.data;
  },

  createIncidentType: async (
    data: IncidentTypeRequest,
  ): Promise<BaseResponse<IncidentType>> => {
    const response = await apiService.post<
      BaseResponse<IncidentType>,
      IncidentTypeRequest
    >(`${baseUrl}`, data);
    return response.data;
  },

  updateIncidentType: async (
    id: number,
    data: IncidentTypeRequest,
  ): Promise<BaseResponse<IncidentType>> => {
    const response = await apiService.put<
      BaseResponse<IncidentType>,
      IncidentTypeRequest
    >(`${baseUrl}/${id}`, data);
    return response.data;
  },

  deleteIncidentType: async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await apiService.delete<BaseResponse<boolean>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },
};

export default incidentTypeService;
