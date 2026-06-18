import { useEffect, useRef } from 'react';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

/**
 * Validates the persisted JWT on initial app load by calling GET /api/auth/me.
 * - If the token is valid → refreshes the user object in the store
 * - If the token is expired/invalid → clears auth state (forces re-login)
 *
 * Must be called once near the root of the app (inside QueryClientProvider).
 */
export const useAuthInit = () => {
  const { token, setUser, logout } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    // Only run once per mount, and only if we have a stored token
    if (initialized.current || !token) return;
    initialized.current = true;

    authApi
      .getMe()
      .then((res) => {
        const freshUser = res.data.data?.user;
        if (freshUser) {
          setUser(freshUser);
        }
      })
      .catch(() => {
        // Token is invalid or expired — purge local state
        logout();
      });
  }, [token, setUser, logout]);
};
