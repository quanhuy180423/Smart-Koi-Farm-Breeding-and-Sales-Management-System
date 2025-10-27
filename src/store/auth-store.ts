import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiService from "@/lib/api/apiClient";
import fetchAuth, { SignOutRequest } from "@/lib/api/services/fetchAuth";

export enum UserRole {
  MANAGER = "manager",
  FARM_STAFF = "farm-staff",
  SALE_STAFF = "sale-staff",
  CUSTOMER = "customer",
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
  login: (user: User) => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
  setToken: (token: string | null) => void;
  logout: (refreshToken?: string) => Promise<void>;
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
        set({ user, isAuthenticated: true, isLoading: false });

        if (typeof window !== "undefined") {
          document.cookie = `user-role=${user.role}; path=/; max-age=86400`;
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

          if (userData.role && userData.role !== currentUser.role) {
            if (typeof window !== "undefined") {
              document.cookie = `user-role=${userData.role}; path=/; max-age=86400`;
            }
          }
        }
      },

      setToken: (token: string | null) => {
        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          if (typeof window !== "undefined") {
            document.cookie =
              "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }
          try {
            apiService.setAuthToken("");
          } catch {}
          return;
        }

        try {
          const base64UrlToJson = (b64Url: string) => {
            let s = b64Url.replace(/-/g, "+").replace(/_/g, "/");
            while (s.length % 4) s += "=";
            if (
              typeof window !== "undefined" &&
              typeof window.atob === "function"
            ) {
              const decoded = window.atob(s);
              const pct = Array.prototype.map
                .call(decoded, (c: string) => {
                  return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("");
              return decodeURIComponent(pct);
            }
            const buff = Buffer.from(s, "base64");
            return buff.toString("utf-8");
          };

          const parts = token.split(".");
          if (parts.length < 2) throw new Error("invalid token");
          const payloadJson = base64UrlToJson(parts[1]);
          const payload = JSON.parse(payloadJson) as Record<string, unknown>;

          const rawRoleValue =
            (payload["Role"] as unknown) ||
            (payload[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] as unknown) ||
            (payload["role"] as unknown) ||
            "Guest";

          const rawRole = String(rawRoleValue ?? "Guest");

          const mapRole = (r: string): UserRole => {
            const rr = (r || "").toLowerCase();
            if (rr.includes("manager")) return UserRole.MANAGER;
            if (rr.includes("farm")) return UserRole.FARM_STAFF;
            if (rr.includes("sale")) return UserRole.SALE_STAFF;
            if (rr.includes("customer") || rr.includes("cust"))
              return UserRole.CUSTOMER;
            return UserRole.GUEST;
          };

          const role = mapRole(rawRole);

          const idVal = payload["Id"] ?? payload["id"] ?? "";
          const emailVal = payload["Email"] ?? payload["email"] ?? "";
          const nameVal = payload["Name"] ?? payload["name"] ?? undefined;

          const user: User = {
            id: String(idVal || ""),
            email: String(emailVal || ""),
            username: nameVal
              ? String(nameVal)
              : String(emailVal || "").split("@")[0] || "",
            role,
            name: nameVal ? String(nameVal) : undefined,
          };

          try {
            apiService.setAuthToken(token);
          } catch {}

          set({ user, isAuthenticated: true, isLoading: false });
          if (typeof window !== "undefined") {
            document.cookie = `user-role=${role}; path=/; max-age=86400`;
          }
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      logout: async (refreshToken?: string) => {
        const readCookie = (name: string) => {
          if (typeof window === "undefined") return null;
          const match = document.cookie
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith(name + "="));
          if (!match) return null;
          return decodeURIComponent(match.split("=")[1] || "");
        };

        try {
          set({ user: null, isAuthenticated: false, isLoading: false });

          if (typeof window !== "undefined") {
            document.cookie =
              "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            document.cookie =
              "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            document.cookie =
              "refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }

          const tokenToSend = refreshToken ?? readCookie("refresh-token");
          if (tokenToSend) {
            const req: SignOutRequest = { refreshToken: tokenToSend };
            try {
              await fetchAuth.signOut(req);
            } catch {}
          }

          try {
            apiService.setAuthToken("");
          } catch {}
        } catch {}
      },

      getUserRole: () => {
        return get().user?.role || UserRole.GUEST;
      },

      hasRole: (role: UserRole) => {
        return get().user?.role === role;
      },

      canAccessRoute: (route: string) => {
        const userRole = get().getUserRole();

        const routePermissions: Record<string, UserRole[]> = {
          "/manager": [UserRole.MANAGER],
          "/sale": [UserRole.SALE_STAFF],
          "/": [UserRole.CUSTOMER, UserRole.GUEST],
        };

        for (const [protectedRoute, allowedRoles] of Object.entries(
          routePermissions
        )) {
          if (route.startsWith(protectedRoute)) {
            return allowedRoles.includes(userRole);
          }
        }

        return true;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper functions for authentication
export const authHelpers = {
  // Initialize auth state from cookies (call this on app start)
  initializeAuth: () => {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split(";");
      const roleCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("user-role=")
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
      if (email.includes("manager") || email.includes("admin")) {
        user = {
          id: "1",
          email,
          username: "manager",
          role: UserRole.MANAGER,
          name: "Manager User",
        };
      } else if (email.includes("farm")) {
        user = {
          id: "2",
          email,
          username: "farm-staff",
          role: UserRole.FARM_STAFF,
          name: "Farm Staff",
        };
      } else if (email.includes("sale")) {
        user = {
          id: "3",
          email,
          username: "sale-staff",
          role: UserRole.SALE_STAFF,
          name: "Sale Staff",
        };
      } else {
        user = {
          id: "4",
          email,
          username: "customer",
          role: UserRole.CUSTOMER,
          name: "Customer",
        };
      }

      // use _password to avoid unused param lint (placeholder until real API)
      void _password;
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

      // use _password to avoid unused param lint (placeholder until real API)
      void _password;
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

// Listen to global logout events dispatched by the API client (e.g. on 401).
// This lets the auth store control cookie clearing and backend sign-out in one place.
if (typeof window !== "undefined") {
  const handleGlobalLogout = async () => {
    try {
      // Try a graceful sign out which will call backend if refresh-token exists
      await useAuthStore.getState().logout();
      // If signOut returned false, fallback to local logout to ensure UI clears
      useAuthStore.getState().logout();
    } catch {
      // Always fallback to clearing local state
      useAuthStore.getState().logout();
    }
  };

  window.addEventListener("logout", handleGlobalLogout);

  // Optionally remove listener when the page unloads
  window.addEventListener("beforeunload", () => {
    window.removeEventListener("logout", handleGlobalLogout);
  });
}
