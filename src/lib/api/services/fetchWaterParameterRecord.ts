import apiService, { BaseResponse, PagedResponse } from "../apiClient";
import toRequestParams from "@/lib/utils/params";

export interface WaterParameterRecord {
  id: number;
  pondId: number;
  pondName: string;
  phLevel: number;
  temperatureCelsius: number;
  oxygenLevel: number;
  ammoniaLevel: number;
  nitriteLevel: number;
  nitrateLevel: number;
  carbonHardness: number;
  waterLevelMeters: number;
  recordedAt: string;
  recordedByUserId: number;
  recordedByUserName: string;
  notes: string;
}

export interface WaterParameterRecordSearchParams {
  pondId?: number;
  fromDate?: string;
  toDate?: string;
  notesContains?: string;
  pageIndex?: number;
  pageSize?: number;
}

const baseUrl = "/api/WaterParameterRecord";

export const waterParameterRecordService = {
  getWaterParameterRecords: async (
    params: WaterParameterRecordSearchParams,
  ): Promise<BaseResponse<PagedResponse<WaterParameterRecord>>> => {
    const filter = toRequestParams({
      pondId: params.pondId,
      fromDate: params.fromDate,
      toDate: params.toDate,
      notesContains: params.notesContains,
      pageIndex: params.pageIndex || 1,
      pageSize: params.pageSize || 10,
    });
    const response = await apiService.get<
      BaseResponse<PagedResponse<WaterParameterRecord>>
    >(baseUrl, filter);
    return response.data;
  },
};

export default waterParameterRecordService;
