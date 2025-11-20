import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiService from "@/lib/api/apiClient";
import fetchAuth, { Roles, SignOutRequest } from "@/lib/api/services/fetchAuth";

export interface User {
  id: string;
  email: string;
  username: string;
  role: Roles;
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
  getUserRole: () => Roles;
  hasRole: (role: Roles) => boolean;
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

          const mapRole = (r: string): Roles => {
            const rr = (r || "").toLowerCase();
            if (rr.includes("manager")) return Roles.Manager;
            if (rr.includes("farm")) return Roles.FarmStaff;
            if (rr.includes("sale")) return Roles.SaleStaff;
            if (rr.includes("customer") || rr.includes("cust"))
              return Roles.Customer;
            return Roles.Customer;
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
        return get().user?.role || Roles.Customer;
      },

      hasRole: (role: Roles) => {
        return get().user?.role === role;
      },

      canAccessRoute: (route: string) => {
        const userRole = get().getUserRole();

        const routePermissions: Record<string, Roles[]> = {
          "/manager": [Roles.Manager],
          "/sale": [Roles.SaleStaff],
          "/": [Roles.Customer, Roles.Customer],
        };

        for (const [protectedRoute, allowedRoles] of Object.entries(
          routePermissions,
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
    },
  ),
);

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
