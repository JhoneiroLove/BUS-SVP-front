import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Company, Bus, Route, Schedule, Reservation, User } from '../types';

interface DataContextType {
  companies: Company[];
  buses: Bus[];
  routes: Route[];
  schedules: Schedule[];
  reservations: Reservation[];
  users: User[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  cancelReservation: (id: string) => void;
  addCompany: (company: Omit<Company, 'id'>) => void;
  updateCompany: (id: string, company: Omit<Company, 'id'>) => void;
  deleteCompany: (id: string) => void;
  addBus: (bus: Omit<Bus, 'id'>) => void;
  updateBus: (id: string, bus: Omit<Bus, 'id'>) => void;
  deleteBus: (id: string) => void;
  addRoute: (route: Omit<Route, 'id'>) => void;
  updateRoute: (id: string, route: Omit<Route, 'id'>) => void;
  deleteRoute: (id: string) => void;
  addSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  updateSchedule: (id: string, schedule: Omit<Schedule, 'id'>) => void;
  deleteSchedule: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialCompanies: Company[] = [
  { id: '1', name: 'TransAndina', phone: '+51 999 888 777', email: 'info@transandina.com' }
];

const initialBuses: Bus[] = [
  { id: '1', companyId: '1', plateNumber: 'ABC-123', capacity: 40, model: 'Mercedes Benz' }
];

const initialRoutes: Route[] = [
  { id: '1', companyId: '1', origin: 'Lima', destination: 'Cusco', price: 80, duration: '22h' }
];

const initialSchedules: Schedule[] = [
  { 
    id: '1', 
    routeId: '1', 
    busId: '1', 
    departureTime: '20:00', 
    arrivalTime: '18:00', 
    date: '2025-01-15', 
    availableSeats: 38 
  }
];

const initialUsers: User[] = [
  { id: '1', email: 'admin@bus.com', name: 'Admin', role: 'admin' },
  { id: '2', email: 'user@bus.com', name: 'Usuario', role: 'user' }
];
export function DataProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [buses, setBuses] = useState<Bus[]>(initialBuses);
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const addReservation = (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newReservation: Reservation = {
      ...reservation,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setReservations(prev => [...prev, newReservation]);
  };

  const cancelReservation = (id: string) => {
    setReservations(prev => 
      prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r)
    );
  };

  // Company management
  const addCompany = (company: Omit<Company, 'id'>) => {
    const newCompany: Company = { ...company, id: Date.now().toString() };
    setCompanies(prev => [...prev, newCompany]);
  };

  const updateCompany = (id: string, company: Omit<Company, 'id'>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...company, id } : c));
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
  };

  // Bus management
  const addBus = (bus: Omit<Bus, 'id'>) => {
    const newBus: Bus = { ...bus, id: Date.now().toString() };
    setBuses(prev => [...prev, newBus]);
  };

  const updateBus = (id: string, bus: Omit<Bus, 'id'>) => {
    setBuses(prev => prev.map(b => b.id === id ? { ...bus, id } : b));
  };

  const deleteBus = (id: string) => {
    setBuses(prev => prev.filter(b => b.id !== id));
  };

  // Route management
  const addRoute = (route: Omit<Route, 'id'>) => {
    const newRoute: Route = { ...route, id: Date.now().toString() };
    setRoutes(prev => [...prev, newRoute]);
  };

  const updateRoute = (id: string, route: Omit<Route, 'id'>) => {
    setRoutes(prev => prev.map(r => r.id === id ? { ...route, id } : r));
  };

  const deleteRoute = (id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id));
  };

  // Schedule management
  const addSchedule = (schedule: Omit<Schedule, 'id'>) => {
    const newSchedule: Schedule = { ...schedule, id: Date.now().toString() };
    setSchedules(prev => [...prev, newSchedule]);
  };

  const updateSchedule = (id: string, schedule: Omit<Schedule, 'id'>) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...schedule, id } : s));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  // User management
  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = { ...user, id: Date.now().toString() };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, user: Omit<User, 'id'>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...user, id } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <DataContext.Provider value={{
      companies,
      buses,
      routes,
      schedules,
      reservations,
      users,
      addReservation,
      cancelReservation,
      addCompany,
      updateCompany,
      deleteCompany,
      addBus,
      updateBus,
      deleteBus,
      addRoute,
      updateRoute,
      deleteRoute,
      addSchedule,
      updateSchedule,
      deleteSchedule,
      addUser,
      updateUser,
      deleteUser
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}