export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  description?: string;
  status: string;
  rating: number;
  total_trips: number;
  created_at: string;
  updated_at: string;
}

export interface Bus {
  id: string;
  company_id: string;
  plate_number: string;
  capacity: number;
  model: string;
  status: string;
  features?: string[];
  year?: number;
  mileage: number;
  last_maintenance_date?: string;
  next_maintenance_due?: string;
  created_at: string;
  updated_at: string;
}

export interface Route {
  id: string;
  company_id: string;
  origin: string;
  destination: string;
  price: number;
  duration: string;
  status: string;
  distance_km?: number;
  description?: string;
  total_bookings: number;
  popularity_score: number;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  route_id: string;
  bus_id: string;
  departure_time: string;
  arrival_time: string;
  date: string;
  available_seats: number;
  total_capacity: number;
  status: string;
  occupied_seats?: number[];
  reserved_seats?: number[];
  actual_departure_time?: string;
  actual_arrival_time?: string;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  user_id: string;
  schedule_id: string;
  seat_number: number;
  price: number;
  status: 'active' | 'cancelled' | 'completed';
  reservation_code: string;
  cancellation_reason?: string;
  cancelled_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}