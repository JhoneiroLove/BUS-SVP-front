import api from './api';
import { Company } from '../types';

export const companiesService = {
  // Obtener todas las empresas publicas
  async getAllCompanies(): Promise<Company[]> {
    try {
      const response = await api.get('/companies/public');
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  // Crear nueva empresa (admin)
  async createCompany(companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> {
    try {
      const response = await api.post('/companies/', companyData);
      return response.data;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  },

  // Actualizar empresa (admin)
  async updateCompany(id: string, companyData: Partial<Company>): Promise<Company> {
    try {
      const response = await api.put(`/companies/${id}`, companyData);
      return response.data;
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  },

  // Eliminar empresa (admin)
  async deleteCompany(id: string): Promise<void> {
    try {
      await api.delete(`/companies/${id}`);
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }
};
