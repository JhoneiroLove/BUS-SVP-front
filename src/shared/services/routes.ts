import api from './api';
import { Route, Schedule } from '../types';

export interface RouteSearchParams {
  origin?: string;
  destination?: string;
  date?: string;
  min_seats?: number;
}

export const routesService = {
  // Buscar rutas con filtros
  async searchRoutes(params: RouteSearchParams): Promise<Route[]> {
    try {
      const response = await api.get('/routes/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching routes:', error);
      throw error;
    }
  },

  // Obtener todas las rutas
  async getAllRoutes(): Promise<Route[]> {
    try {
      const response = await api.get('/routes/');
      return response.data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  },

  // Crear nueva ruta (admin)
  async createRoute(routeData: Omit<Route, 'id' | 'created_at' | 'updated_at'>): Promise<Route> {
    try {
      const response = await api.post('/routes/', routeData);
      return response.data;
    } catch (error) {
      console.error('Error creating route:', error);
      throw error;
    }
  },

  // Actualizar ruta (admin)
  async updateRoute(id: string, routeData: Partial<Route>): Promise<Route> {
    try {
      const response = await api.put(`/routes/${id}`, routeData);
      return response.data;
    } catch (error) {
      console.error('Error updating route:', error);
      throw error;
    }
  },

  // Eliminar ruta (admin)
  async deleteRoute(id: string): Promise<void> {
    try {
      await api.delete(`/routes/${id}`);
    } catch (error) {
      console.error('Error deleting route:', error);
      throw error;
    }
  }
};
