import apiService, { BaseResponse } from "../apiClient";

export enum DayOfWeekEnum {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
}

export interface TaskTemplateInfo {
  id: number;
  taskName: string;
  description: string;
  defaultDuration: number;
  isRecurring: boolean;
  recurrenceRule: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface TemplateItem {
  id: number;
  taskTemplateId: number;
  taskTemplate: TaskTemplateInfo;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface WeeklyScheduleTemplate {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  templateItems: TemplateItem[];
}

export interface TemplateItemRequest {
  taskTemplateId: number;
  dayOfWeek: DayOfWeekEnum;
  startTime: string;
  endTime: string;
}

export interface WeeklyScheduleTemplateRequest {
  name: string;
  description: string;
  templateItems: TemplateItemRequest[];
}

const baseUrl = "/api/WeeklyScheduleTemplate";

export const weeklyScheduleTemplateService = {
  getWeeklyScheduleTemplates: async (): Promise<
    BaseResponse<WeeklyScheduleTemplate[]>
  > => {
    const response = await apiService.get<
      BaseResponse<WeeklyScheduleTemplate[]>
    >(`${baseUrl}`);
    return response.data;
  },

  getWeeklyScheduleTemplateById: async (
    id: number,
  ): Promise<BaseResponse<WeeklyScheduleTemplate>> => {
    const response = await apiService.get<BaseResponse<WeeklyScheduleTemplate>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },

  addWeeklyScheduleTemplate: async (
    request: Partial<WeeklyScheduleTemplateRequest>,
  ): Promise<BaseResponse<WeeklyScheduleTemplate>> => {
    const response = await apiService.post<
      BaseResponse<WeeklyScheduleTemplate>,
      Partial<WeeklyScheduleTemplateRequest>
    >(`${baseUrl}`, request);
    return response.data;
  },

  updateWeeklyScheduleTemplate: async (
    id: number,
    request: Partial<WeeklyScheduleTemplateRequest>,
  ): Promise<BaseResponse<WeeklyScheduleTemplate>> => {
    const response = await apiService.put<
      BaseResponse<WeeklyScheduleTemplate>,
      Partial<WeeklyScheduleTemplateRequest>
    >(`${baseUrl}/${id}`, request);
    return response.data;
  },

  deleteWeeklyScheduleTemplate: async (
    id: number,
  ): Promise<BaseResponse<string>> => {
    const response = await apiService.delete<BaseResponse<string>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },
};

export default weeklyScheduleTemplateService;
