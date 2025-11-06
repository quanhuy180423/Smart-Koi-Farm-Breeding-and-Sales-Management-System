import apiService, { BaseResponse } from "../apiClient";

export interface UploadResponse {
  publicId: string;
  url: string;
}

const baseUrl = "/api/upload";

export const uploadService = {
  uploadImage: async (file: File): Promise<BaseResponse<UploadResponse>> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiService.post<
      BaseResponse<UploadResponse>,
      FormData
    >(`${baseUrl}/upload-image`, formData);
    return response.data;
  },
  // uploadImage endpoint dùng được cho cả ảnh lẫn video
  uploadVideo: async (file: File): Promise<BaseResponse<UploadResponse>> => {
    return uploadService.uploadImage(file);
  },
};

export default uploadService;
