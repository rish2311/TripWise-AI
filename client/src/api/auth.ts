import apiClient from './client';
import type { User, ApiResponse } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponseData {
  token: string;
  user: User;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', payload),

  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', payload),

  getMe: () =>
    apiClient.get<ApiResponse<{ user: User }>>('/auth/me'),
};
