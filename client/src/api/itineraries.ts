import apiClient from './client';
import type { Itinerary, ItinerarySummary, ApiResponse } from '@/types';

export const itinerariesApi = {
  generate: (documentId: string) =>
    apiClient.post<ApiResponse<{ itinerary: Itinerary }>>('/itineraries/generate', { documentId }),

  list: () =>
    apiClient.get<ApiResponse<{ itineraries: ItinerarySummary[] }>>('/itineraries'),

  getById: (id: string) =>
    apiClient.get<ApiResponse<{ itinerary: Itinerary }>>(`/itineraries/${id}`),

  update: (id: string, payload: { title?: string; itinerary?: string }) =>
    apiClient.patch<ApiResponse<{ itinerary: Itinerary }>>(`/itineraries/${id}`, payload),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/itineraries/${id}`),

  share: (id: string) =>
    apiClient.post<ApiResponse<{ shareUrl: string; shareId: string }>>(`/itineraries/${id}/share`),

  getShared: (shareId: string) =>
    apiClient.get<ApiResponse<{ itinerary: Itinerary }>>(`/itineraries/share/${shareId}`),
};
