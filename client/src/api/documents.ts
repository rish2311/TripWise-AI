import apiClient from './client';
import type { TravelDocument, ApiResponse } from '@/types';

export const documentsApi = {
  upload: (formData: FormData, onUploadProgress?: (progress: number) => void) =>
    apiClient.post<ApiResponse<{ documentId: string; document: TravelDocument }>>('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (onUploadProgress && event.total) {
          onUploadProgress(Math.round((event.loaded * 100) / event.total));
        }
      },
    }),

  getDocument: (id: string) =>
    apiClient.get<ApiResponse<{ document: TravelDocument }>>(`/documents/${id}`),

  deleteDocument: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/documents/${id}`),
};
