import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define user roles (same as middleware)
export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  SALE_STAFF = "sale-staff",
  GUEST = "guest",
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  name?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<User>) => void;

  // Computed values
  getUserRole: () => UserRole;
  hasRole: (role: UserRole) => boolean;
  canAccessRoute: (route: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user: User) => {
        // Set user in store
        set({ user, isAuthenticated: true, isLoading: false });

        // Set cookie for middleware (client-side)
        if (typeof window !== "undefined") {
          document.cookie = `user-role=${user.role}; path=/; max-age=86400`; // 24 hours
        }
      },

      logout: () => {
        // Clear user from store
        set({ user: null, isAuthenticated: false, isLoading: false });

        // Clear cookie
        if (typeof window !== "undefined") {
          document.cookie =
            "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          set({ user: updatedUser });

          // Update cookie if role changed
          if (userData.role && userData.role !== currentUser.role) {
            if (typeof window !== "undefined") {
              document.cookie = `user-role=${userData.role}; path=/; max-age=86400`;
            }
          }
        }
      },

      getUserRole: () => {
        return get().user?.role || UserRole.GUEST;
      },

      hasRole: (role: UserRole) => {
        return get().user?.role === role;
      },

      canAccessRoute: (route: string) => {
        const userRole = get().getUserRole();

        // Define route permissions (same as middleware)
        const routePermissions: Record<string, UserRole[]> = {
          "/admin": [UserRole.ADMIN],
          "/customer": [UserRole.CUSTOMER],
          "/sale-staff": [UserRole.SALE_STAFF],
        };

        // Check if route requires specific role
        for (const [protectedRoute, allowedRoles] of Object.entries(
          routePermissions,
        )) {
          if (route.startsWith(protectedRoute)) {
            return allowedRoles.includes(userRole);
          }
        }

        // Public routes or routes not in protection list
        return true;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Don't persist isLoading
      }),
    },
  ),
);

// Helper functions for authentication
export const authHelpers = {
  // Initialize auth state from cookies (call this on app start)
  initializeAuth: () => {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split(";");
      const roleCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("user-role="),
      );

      if (roleCookie) {
        const role = roleCookie.split("=")[1] as UserRole;
        if (role && role !== UserRole.GUEST) {
          // You might want to fetch user data from API here
          // For now, create a basic user object
          const user: User = {
            id: "temp-id",
            email: "temp@email.com",
            username: "temp-user",
            role: role,
            name: "User",
          };
          useAuthStore.getState().login(user);
        }
      }
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return useAuthStore.getState().isAuthenticated;
  },

  // Get current user
  getCurrentUser: () => {
    return useAuthStore.getState().user;
  },

  // Get user role
  getUserRole: () => {
    return useAuthStore.getState().getUserRole();
  },

  // Check if user has specific role
  hasRole: (role: UserRole) => {
    return useAuthStore.getState().hasRole(role);
  },

  // Login helper
  login: async (email: string, _password: string) => {
    // TODO: Use password for actual API authentication
    try {
      useAuthStore.getState().setLoading(true);

      // TODO: Replace with actual API call
      // const response = await api.login({ email, password });

      // Mock login response based on email
      let user: User;
      if (email.includes("admin")) {
        user = {
          id: "1",
          email,
          username: "admin",
          role: UserRole.ADMIN,
          name: "Admin User",
        };
      } else if (email.includes("sale")) {
        user = {
          id: "2",
          email,
          username: "sale-staff",
          role: UserRole.SALE_STAFF,
          name: "Sale Staff",
        };
      } else {
        user = {
          id: "3",
          email,
          username: "customer",
          role: UserRole.CUSTOMER,
          name: "Customer",
        };
      }

      useAuthStore.getState().login(user);
      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed" };
    } finally {
      useAuthStore.getState().setLoading(false);
    }
  },

  // Register helper
  register: async (email: string, username: string, _password: string) => {
    // TODO: Use password for actual API registration
    try {
      useAuthStore.getState().setLoading(true);

      // TODO: Replace with actual API call
      // const response = await api.register({ email, username, password });

      // Mock register response - always create customer account
      const user: User = {
        id: Date.now().toString(),
        email,
        username,
        role: UserRole.CUSTOMER,
        name: username,
      };

      useAuthStore.getState().login(user);
      return { success: true, user };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: "Registration failed" };
    } finally {
      useAuthStore.getState().setLoading(false);
    }
  },
};
