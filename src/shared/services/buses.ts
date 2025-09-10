import api from './api';
import { Bus } from '../types';

export const busesService = {
  // Obtener todos los buses
  async getAllBuses(companyId?: string): Promise<Bus[]> {
    try {
      const params = companyId ? { company_id: companyId } : {};
      const response = await api.get('/buses/public', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching buses:', error);
      throw error;
    }
  },

  // Crear nuevo bus
  async createBus(busData: Omit<Bus, 'id' | 'created_at' | 'updated_at'>): Promise<Bus> {
    try {
      const response = await api.post('/buses/public', busData);
      return response.data;
    } catch (error) {
      console.error('Error creating bus:', error);
      throw error;
    }
  },

  // Actualizar bus
  async updateBus(id: string, busData: Partial<Bus>): Promise<Bus> {
    try {
      const response = await api.put(`/buses/public/${id}`, busData);
      return response.data;
    } catch (error) {
      console.error('Error updating bus:', error);
      throw error;
    }
  },

  // Eliminar bus
  async deleteBus(id: string): Promise<void> {
    try {
      await api.delete(`/buses/public/${id}`);
    } catch (error) {
      console.error('Error deleting bus:', error);
      throw error;
    }
  }
};
