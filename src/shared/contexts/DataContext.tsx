import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Company, Bus, Route, Schedule, Reservation, User } from '../types';
import { companiesService } from '../services/companies';
import { routesService } from '../services/routes';
import { usersService } from '../services/users';
import { reservationsService } from '../services/reservations';

interface DataContextType {
  companies: Company[];
  buses: Bus[];
  routes: Route[];
  schedules: Schedule[];
  reservations: Reservation[];
  users: User[];
  loading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  addReservation: (reservation: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>) => void;
  cancelReservation: (id: string) => void;
  addCompany: (company: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => void;
  updateCompany: (id: string, company: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => void;
  deleteCompany: (id: string) => void;
  addBus: (bus: Omit<Bus, 'id' | 'created_at' | 'updated_at'>) => void;
  updateBus: (id: string, bus: Omit<Bus, 'id' | 'created_at' | 'updated_at'>) => void;
  deleteBus: (id: string) => void;
  addRoute: (route: Omit<Route, 'id' | 'created_at' | 'updated_at'>) => void;
  updateRoute: (id: string, route: Omit<Route, 'id' | 'created_at' | 'updated_at'>) => void;
  deleteRoute: (id: string) => void;
  addSchedule: (schedule: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>) => void;
  updateSchedule: (id: string, schedule: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>) => void;
  deleteSchedule: (id: string) => void;
  addUser: (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => void;
  updateUser: (id: string, user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => void;
  deleteUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [companiesData, routesData, usersData] = await Promise.all([
        companiesService.getAllCompanies(),
        routesService.getAllRoutes(),
        usersService.getAllUsers()
      ]);
      
      setCompanies(companiesData);
      setRoutes(routesData);
      setUsers(usersData);
      
      // Por ahora, buses, schedules y reservations se cargan por separado cuando se necesitan
      setBuses([]);
      setSchedules([]);
      setReservations([]);
      
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reservations
  const addReservation = (reservation: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>) => {
    // Esta función se maneja directamente en los componentes usando el servicio
    console.log('Reservation added:', reservation);
  };

  const cancelReservation = (id: string) => {
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  // Companies
  const addCompany = async (company: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newCompany = await companiesService.createCompany(company);
      setCompanies(prev => [...prev, newCompany]);
    } catch (err) {
      console.error('Error creating company:', err);
    }
  };

  const updateCompany = async (id: string, company: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const updatedCompany = await companiesService.updateCompany(id, company);
      setCompanies(prev => prev.map(c => c.id === id ? updatedCompany : c));
    } catch (err) {
      console.error('Error updating company:', err);
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      await companiesService.deleteCompany(id);
      setCompanies(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting company:', err);
    }
  };

  // Routes
  const addRoute = async (route: Omit<Route, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newRoute = await routesService.createRoute(route);
      setRoutes(prev => [...prev, newRoute]);
    } catch (err) {
      console.error('Error creating route:', err);
    }
  };

  const updateRoute = async (id: string, route: Omit<Route, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const updatedRoute = await routesService.updateRoute(id, route);
      setRoutes(prev => prev.map(r => r.id === id ? updatedRoute : r));
    } catch (err) {
      console.error('Error updating route:', err);
    }
  };

  const deleteRoute = async (id: string) => {
    try {
      await routesService.deleteRoute(id);
      setRoutes(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error deleting route:', err);
    }
  };

  // Users
  const addUser = (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    // Esta función se maneja directamente en los componentes usando el servicio
    console.log('User added:', user);
  };

  const updateUser = async (id: string, user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const updatedUser = await usersService.updateUser(id, user);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await usersService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // Buses, Schedules - Por ahora solo mock functions
  const addBus = (bus: Omit<Bus, 'id' | 'created_at' | 'updated_at'>) => {
    console.log('Bus added:', bus);
  };

  const updateBus = (id: string, bus: Omit<Bus, 'id' | 'created_at' | 'updated_at'>) => {
    console.log('Bus updated:', id, bus);
  };

  const deleteBus = (id: string) => {
    setBuses(prev => prev.filter(b => b.id !== id));
  };

  const addSchedule = (schedule: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>) => {
    console.log('Schedule added:', schedule);
  };

  const updateSchedule = (id: string, schedule: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>) => {
    console.log('Schedule updated:', id, schedule);
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const value: DataContextType = {
    companies,
    buses,
    routes,
    schedules,
    reservations,
    users,
    loading,
    error,
    loadData,
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
    deleteUser,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}