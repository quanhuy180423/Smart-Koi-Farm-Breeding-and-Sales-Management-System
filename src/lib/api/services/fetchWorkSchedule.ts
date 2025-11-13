import toRequestParams from "@/lib/utils/params";
import apiService, { BaseResponse } from "../apiClient";
import { TaskTemplateResponse } from "./fetchTaskTemplate";
import { Roles } from "./fetchAuth";

export enum WorkScheduleStatusEnum {
  Pending = "Pending",
  InProgress = "InProgress",
  Completed = "Completed",
  Incomplete = "Incomplete",
  Cancelled = "Cancelled",
}

export interface StaffAssignment {
  workScheduleId: number;
  staffId: number;
  staffName: string;
  role: Roles;
  completionNotes: string | null;
  completedAt: string | null;
}

export interface PondAssignment {
  workScheduleId: number;
  pondId: number;
  pondName: string;
}

export interface WorkSchedule {
  id: number;
  taskTemplateId: number;
  taskTemplateName: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  status: WorkScheduleStatusEnum;
  notes: string;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string | null;
  taskTemplate: TaskTemplateResponse;
  staffAssignments: StaffAssignment[];
  pondAssignments: PondAssignment[];
}

export interface WorkScheduleRequest {
  scheduledDateFrom: string;
  scheduledDateTo: string;
  pondId?: number;
}

export interface UpdateWorkScheduleRequest {
  taskTemplateId: number;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  notes: string;
  staffIds: number[];
  pondIds: number[];
}

const baseUrl = "/api/WorkSchedule";

export const workScheduleService = {
  getWorkSchedules: async (
    request: WorkScheduleRequest,
  ): Promise<BaseResponse<WorkSchedule[]>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<BaseResponse<WorkSchedule[]>>(
      `${baseUrl}`,
      filter,
    );
    return response.data;
  },
  createWorkSchedule: async (
    request: UpdateWorkScheduleRequest,
  ): Promise<BaseResponse<WorkSchedule>> => {
    const response = await apiService.post<
      BaseResponse<WorkSchedule>,
      UpdateWorkScheduleRequest
    >(`${baseUrl}`, request);
    return response.data;
  },
  updateWorkSchedule: async (
    id: number,
    request: UpdateWorkScheduleRequest,
  ): Promise<BaseResponse<WorkSchedule>> => {
    const response = await apiService.put<
      BaseResponse<WorkSchedule>,
      UpdateWorkScheduleRequest
    >(`${baseUrl}/${id}`, request);
    return response.data;
  },
  deleteWorkSchedule: async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await apiService.delete<BaseResponse<boolean>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },
};

export default workScheduleService;
