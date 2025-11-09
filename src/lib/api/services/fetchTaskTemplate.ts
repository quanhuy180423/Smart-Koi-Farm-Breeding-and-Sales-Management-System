import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";

export interface TaskTemplateResponse {
  id: number;
  taskName: string;
  description: string;
  defaultDuration: number;
  notesTask: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface TaskTemplateRequest {
  taskName: string;
  description: string;
  defaultDuration: number;
  notesTask: string | null;
}

export interface TaskTemplatePagedRequest extends PagingRequest {
  search?: string;
  isDeleted?: boolean;
}

const baseUrl = "/api/TaskTemplate";

export const taskTemplateService = {
  getTaskTemplates: async (
    request: TaskTemplatePagedRequest,
  ): Promise<BaseResponse<PagedResponse<TaskTemplateResponse>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<TaskTemplateResponse>>
    >(`${baseUrl}`, { ...filter });
    return response.data;
  },

  getTaskTemplateById: async (
    id: number,
  ): Promise<BaseResponse<TaskTemplateResponse>> => {
    const response = await apiService.get<BaseResponse<TaskTemplateResponse>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },

  addTaskTemplate: async (
    request: TaskTemplateRequest,
  ): Promise<BaseResponse<TaskTemplateResponse>> => {
    const response = await apiService.post<
      BaseResponse<TaskTemplateResponse>,
      TaskTemplateRequest
    >(`${baseUrl}`, request);
    return response.data;
  },

  updateTaskTemplate: async (
    id: number,
    request: Partial<TaskTemplateRequest>,
  ): Promise<BaseResponse<TaskTemplateResponse>> => {
    const response = await apiService.put<
      BaseResponse<TaskTemplateResponse>,
      Partial<TaskTemplateRequest>
    >(`${baseUrl}/${id}`, request);
    return response.data;
  },

  deleteTaskTemplate: async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await apiService.delete<BaseResponse<boolean>>(
      `${baseUrl}/${id}`,
    );
    return response.data;
  },
};

export default taskTemplateService;
