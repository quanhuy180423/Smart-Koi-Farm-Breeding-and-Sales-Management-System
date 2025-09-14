// import { create } from 'zustand';
// import { getCookie, setCookie, deleteCookie } from 'cookies-next';
// import apiService from '@/lib/api/core';
// import { User } from '../api/services/fetchUser';
// import { getAuthCookieConfig } from '@/lib/utils/cookieConfig';

// interface AuthState {
//   token: string | null;
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;

//   // Actions
//   setToken: (token: string | null) => void;
//   setUser: (user: User | null) => void;
//   login: (token: string, user: User) => void;
//   logout: () => void;
//   syncAuthState: () => void;
// }

// export const useAuthStore = create<AuthState>((set, _get) => ({
//   token: null,
//   user: null,
//   isAuthenticated: false,
//   isLoading: false,

//   setToken: token => {
//     if (token) {
//       setCookie('auth-token', token, getAuthCookieConfig());
//       apiService.setAuthToken(token);
//     } else {
//       // Use same config for deletion as for setting
//       const cookieConfig = getAuthCookieConfig();
//       deleteCookie('auth-token', {
//         path: cookieConfig.path,
//         domain: cookieConfig.domain,
//         secure: cookieConfig.secure,
//       });
//       apiService.setAuthToken(null);
//     }

//     set({ token, isAuthenticated: !!token });
//   },

//   setUser: user => set({ user }),

//   login: (token, user) => {
//     setCookie('auth-token', token, getAuthCookieConfig());
//     apiService.setAuthToken(token);

//     set({
//       token,
//       user,
//       isAuthenticated: true,
//     });
//   },

//   logout: () => {
//     // Use same config for deletion as for setting
//     const cookieConfig = getAuthCookieConfig();
//     deleteCookie('auth-token', {
//       path: cookieConfig.path,
//       domain: cookieConfig.domain,
//       secure: cookieConfig.secure,
//     });
//     apiService.setAuthToken(null);
//     localStorage.removeItem('roommate-form-data');

//     set({
//       token: null,
//       user: null,
//       isAuthenticated: false,
//     });
//   },

//   syncAuthState: () => {
//     if (typeof window !== 'undefined') {
//       const cookieToken = getCookie('auth-token');
//       set(state => {
//         const storeHasToken = !!state.token;
//         const cookieHasToken = !!cookieToken;

//         if (storeHasToken !== cookieHasToken) {
//           if (cookieHasToken) {
//             // Set the API token immediately when syncing from cookie
//             apiService.setAuthToken(cookieToken as string);
//             return {
//               token: cookieToken as string,
//               isAuthenticated: true,
//             };
//           } else {
//             // Clear API token when no cookie
//             apiService.setAuthToken(null);
//             return {
//               token: null,
//               isAuthenticated: false,
//             };
//           }
//         }

//         // Ensure API service has the token even if store state doesn't change
//         if (storeHasToken && state.token) {
//           apiService.setAuthToken(state.token);
//         }

//         return {
//           isAuthenticated: storeHasToken,
//         };
//       });
//     }
//   },
// }));

// // Initialize auth state from storage with better SSR handling
// const initializeAuth = () => {
//   if (typeof window !== 'undefined') {
//     const state = useAuthStore.getState();
//     const cookieToken = getCookie('auth-token');

//     console.log('[AuthStore] Initializing auth:', {
//       cookieToken: cookieToken ? 'present' : 'missing',
//       storeToken: state.token ? 'present' : 'missing',
//       isAuthenticated: state.isAuthenticated,
//     });

//     // Primary logic: Cookie is the source of truth
//     if (cookieToken) {
//       // Cookie exists - ensure store is in sync
//       if (!state.token || state.token !== cookieToken) {
//         console.log('[AuthStore] Syncing store from cookie');
//         apiService.setAuthToken(cookieToken as string);
//         state.setToken(cookieToken as string);
//       } else {
//         // Store already has correct token, just ensure API service has it
//         apiService.setAuthToken(cookieToken as string);
//       }
//     } else {
//       // No cookie - clear everything
//       if (state.token || state.isAuthenticated) {
//         console.log('[AuthStore] No cookie found, clearing auth state');
//         state.logout();
//       }
//     }

//     // Listen for logout events from API service
//     const handleLogout = () => {
//       console.log('[AuthStore] Logout event received');
//       state.logout();
//     };

//     window.addEventListener('logout', handleLogout);

//     // Cleanup listener on page unload
//     window.addEventListener('beforeunload', () => {
//       window.removeEventListener('logout', handleLogout);
//     });
//   }
// };

// // Use multiple initialization strategies for better reliability
// if (typeof window !== 'undefined') {
//   // Immediate initialization for client-side
//   if (document.readyState === 'complete') {
//     initializeAuth();
//   } else {
//     // Wait for DOM ready
//     document.addEventListener('DOMContentLoaded', initializeAuth);
//     // Also use setTimeout as fallback
//     setTimeout(initializeAuth, 0);
//   }
// }
