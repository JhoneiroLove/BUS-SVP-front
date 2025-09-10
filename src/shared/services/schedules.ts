import api from './api';
import { Schedule } from '../types';

export const schedulesService = {
  // Obtener todos los horarios
  async getAllSchedules(): Promise<Schedule[]> {
    try {
      const response = await api.get('/schedules/public');
      return response.data;
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  },

  // Crear nuevo horario
  async createSchedule(scheduleData: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>): Promise<Schedule> {
    try {
      const response = await api.post('/schedules/public', scheduleData);
      return response.data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },

  // Actualizar horario
  async updateSchedule(id: string, scheduleData: Partial<Schedule>): Promise<Schedule> {
    try {
      const response = await api.put(`/schedules/public/${id}`, scheduleData);
      return response.data;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },

  // Eliminar horario
  async deleteSchedule(id: string): Promise<void> {
    try {
      await api.delete(`/schedules/public/${id}`);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  }
};
