import { create } from "zustand";

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

interface ApiState {
  isLoading: boolean;
  error: ApiError | null;
  pendingRequests: number;

  // Actions
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: ApiError | null) => void;
  incrementPendingRequests: () => void;
  decrementPendingRequests: () => void;
  resetError: () => void;
}

export const useApiStore = create<ApiState>((set) => ({
  isLoading: false,
  error: null,
  pendingRequests: 0,

  startLoading: () => set({ isLoading: true }),

  stopLoading: () => set({ isLoading: false }),

  setError: (error) => set({ error }),

  resetError: () => set({ error: null }),

  incrementPendingRequests: () =>
    set((state) => ({
      pendingRequests: state.pendingRequests + 1,
      isLoading: true,
    })),

  decrementPendingRequests: () =>
    set((state) => {
      const newCount = Math.max(0, state.pendingRequests - 1);
      return {
        pendingRequests: newCount,
        isLoading: newCount > 0,
      };
    }),
}));
