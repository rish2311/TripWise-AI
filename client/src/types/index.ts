// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Documents ────────────────────────────────────────────────────────────────

export type FileType = 'flight' | 'hotel' | 'train' | 'bus' | 'visa' | 'other';

export interface TravelDocument {
  _id: string;
  userId: string;
  fileUrl: string;
  s3Key: string;
  originalName: string;
  fileType: FileType;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

// ─── Itinerary ────────────────────────────────────────────────────────────────

export interface FlightInfo {
  airline: string | null;
  flightNumber: string | null;
  departureCity: string | null;
  arrivalCity: string | null;
  departureTime: string | null;
  arrivalTime: string | null;
}

export interface HotelInfo {
  hotelName: string | null;
  checkIn: string | null;
  checkOut: string | null;
  location: string | null;
}

export interface TrainInfo {
  trainName: string | null;
  trainNumber: string | null;
  from: string | null;
  to: string | null;
  departureTime: string | null;
}

export interface ExtractedData {
  flights: FlightInfo[];
  hotels: HotelInfo[];
  trains: TrainInfo[];
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
  travelers: string | null;
  otherDetails?: Record<string, unknown>;
}

export interface Itinerary {
  _id: string;
  userId: string;
  documentId: string | TravelDocument;
  title: string;
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
  extractedData: ExtractedData;
  itinerary: string; // Markdown
  isEdited: boolean;
  shareId: string | null;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ItinerarySummary {
  _id: string;
  title: string;
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  isShared: boolean;
  shareId: string | null;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  data?: T;
  message?: string;
  results?: number;
}

export interface ApiError {
  status: 'fail' | 'error';
  message: string;
  errors?: Array<{ field: string; message: string }>;
}
