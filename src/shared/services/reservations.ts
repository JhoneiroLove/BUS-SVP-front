import api from './api';
import { Reservation } from '../types';

export interface CreateReservationData {
  user_id: string;
  schedule_id: string;
  seat_number: number;
}

export const reservationsService = {
  // Crear nueva reserva (endpoint público)
  async createReservation(reservationData: CreateReservationData): Promise<Reservation> {
    try {
      const response = await api.post('/reservations/public', reservationData);
      return response.data;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  // Obtener reservas del usuario (endpoint público)
  async getUserReservations(userId: string): Promise<Reservation[]> {
    try {
      const response = await api.get(`/reservations/public/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user reservations:', error);
      throw error;
    }
  },

  // Cancelar reserva (endpoint público)
  async cancelReservation(reservationId: string): Promise<Reservation> {
    try {
      const response = await api.delete(`/reservations/public/${reservationId}`);
      return response.data;
    } catch (error) {
      console.error('Error canceling reservation:', error);
      throw error;
    }
  },

  // Obtener reserva por ID
  async getReservationById(reservationId: string): Promise<Reservation> {
    try {
      const response = await api.get(`/reservations/${reservationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reservation:', error);
      throw error;
    }
  }
};