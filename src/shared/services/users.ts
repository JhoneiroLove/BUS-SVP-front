import api from './api';
import { User } from '../types';

export const usersService = {
  // Obtener todos los usuarios publicos
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get('/users/public');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Obtener usuario por ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Actualizar usuario (admin)
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Eliminar usuario (admin)
  async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};
