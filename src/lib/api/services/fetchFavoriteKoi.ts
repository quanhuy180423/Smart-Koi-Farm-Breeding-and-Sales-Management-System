import apiService, { BaseResponse } from "../apiClient";

const baseUrl = "/api/KoiFavorite";

export const favoriteKoiService = {
  // Thêm cá vào danh sách yêu thích
  addFavorite: async (
    koiFishId: number,
  ): Promise<BaseResponse<{ isFavorite: boolean }>> => {
    const response = await apiService.post<
      BaseResponse<{ isFavorite: boolean }>
    >(`${baseUrl}`, { koiFishId: koiFishId });
    return response.data;
  },

  // Xóa cá khỏi danh sách yêu thích
  removeFavorite: async (
    koiFishId: number,
  ): Promise<BaseResponse<{ isFavorite: boolean }>> => {
    const response = await apiService.delete<
      BaseResponse<{ isFavorite: boolean }>
    >(`${baseUrl}/${koiFishId}`);
    return response.data;
  },

  // Kiểm tra cá có trong danh sách yêu thích không
  checkFavorite: async (
    koiFishId: number,
  ): Promise<BaseResponse<{ isFavorite: boolean }>> => {
    const response = await apiService.get<
      BaseResponse<{ isFavorite: boolean }>
    >(`${baseUrl}/check/${koiFishId}`);
    return response.data;
  },
};

export default favoriteKoiService;
