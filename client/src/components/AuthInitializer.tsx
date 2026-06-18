import { useAuthInit } from '@/hooks/useAuth';

/**
 * Headless component that runs once on mount to validate the
 * persisted JWT token against the server (GET /api/auth/me).
 *
 * Place it inside <QueryClientProvider> but outside <BrowserRouter>
 * so it fires before any route rendering decisions are made.
 */
export const AuthInitializer = () => {
  useAuthInit();
  return null;
};
