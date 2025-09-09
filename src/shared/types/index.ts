export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Company {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Bus {
  id: string;
  companyId: string;
  plateNumber: string;
  capacity: number;
  model: string;
}

export interface Route {
  id: string;
  companyId: string;
  origin: string;
  destination: string;
  price: number;
  duration: string;
}

export interface Schedule {
  id: string;
  routeId: string;
  busId: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  availableSeats: number;
}

export interface Reservation {
  id: string;
  userId: string;
  scheduleId: string;
  seatNumber: number;
  status: 'active' | 'cancelled';
  createdAt: string;
}