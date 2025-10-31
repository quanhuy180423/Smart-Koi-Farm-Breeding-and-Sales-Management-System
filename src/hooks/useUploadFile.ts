import { useMutation } from "@tanstack/react-query";
import uploadService, { UploadResponse } from "@/lib/api/services/fetchUpload";
import toast from "react-hot-toast";

export interface UseUploadFileParams {
  onSuccess?: (data: UploadResponse) => void;
  onError?: (error: Error) => void;
}

export function useUploadImage() {
  return useMutation({
    mutationFn: async (params: {
      file: File;
      options?: UseUploadFileParams;
    }) => {
      const data = await uploadService.uploadImage(params.file);
      if (data.isSuccess && data.result) {
        toast.success(data.message || "Tải ảnh thành công");
        params.options?.onSuccess?.(data.result);
        return data.result;
      } else {
        toast.error(data.message || "Tải ảnh thất bại");
        throw new Error(data.message || "Tải ảnh thất bại");
      }
    },
    onError: (error: Error) => {
      const message = error.message || "Có lỗi xảy ra khi tải ảnh";
      if (!message.includes("Tải ảnh thất bại")) {
        toast.error(message);
      }
    },
  });
}

export function useUploadVideo() {
  return useMutation({
    mutationFn: async (params: {
      file: File;
      options?: UseUploadFileParams;
    }) => {
      const data = await uploadService.uploadVideo(params.file);
      if (data.isSuccess && data.result) {
        toast.success(data.message || "Tải video thành công");
        params.options?.onSuccess?.(data.result);
        return data.result;
      } else {
        toast.error(data.message || "Tải video thất bại");
        throw new Error(data.message || "Tải video thất bại");
      }
    },
    onError: (error: Error) => {
      const message = error.message || "Có lỗi xảy ra khi tải video";
      if (!message.includes("Tải video thất bại")) {
        toast.error(message);
      }
    },
  });
}
