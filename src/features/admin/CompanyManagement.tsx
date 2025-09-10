import React, { useState, useEffect } from 'react';
import { Building, Plus, Edit, Trash2, Phone, Mail, Star, MapPin } from 'lucide-react';
import { companiesService } from '../../shared/services/companies';
import { Company } from '../../shared/types';

export function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    description: '',
    status: 'active',
    rating: 0,
    total_trips: 0
  });

  // Cargar empresas al montar el componente
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const companiesData = await companiesService.getAllCompanies();
      setCompanies(companiesData);
    } catch (err) {
      setError('Error al cargar las empresas');
      console.error('Error loading companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (editingCompany) {
        await companiesService.updateCompany(editingCompany.id, formData);
      } else {
        await companiesService.createCompany(formData);
      }
      
      await loadCompanies(); // Recargar la lista
      resetForm();
    } catch (err) {
      setError('Error al guardar la empresa');
      console.error('Error saving company:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta empresa?')) {
      try {
        setLoading(true);
        setError(null);
        await companiesService.deleteCompany(id);
        await loadCompanies(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar la empresa');
        console.error('Error deleting company:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      phone: '', 
      email: '', 
      address: '', 
      description: '', 
      status: 'active', 
      rating: 0, 
      total_trips: 0 
    });
    setShowForm(false);
    setEditingCompany(null);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      phone: company.phone,
      email: company.email,
      address: company.address || '',
      description: company.description || '',
      status: company.status,
      rating: company.rating,
      total_trips: company.total_trips
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Empresas</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-orange-600 rounded-md hover:bg-orange-700"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Empresa</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            {editingCompany ? 'Editar Empresa' : 'Nueva Empresa'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Nombre de la Empresa *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="active">Activa</option>
                  <option value="inactive">Inactiva</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 transition-colors bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-white transition-colors bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : editingCompany ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Lista de Empresas</h3>
        </div>

        {loading && !showForm ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando empresas...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {companies.map((company) => (
              <div key={company.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Building className="w-6 h-6 text-orange-600" />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {company.name}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{company.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{company.email}</span>
                          </div>
                          {company.address && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{company.address}</span>
                            </div>
                          )}
                        </div>
                        {company.description && (
                          <p className="mt-2 text-sm text-gray-600">{company.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">{company.rating}/5</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {company.total_trips} viajes realizados
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            company.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {company.status === 'active' ? 'Activa' : 'Inactiva'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(company)}
                      className="p-2 text-orange-600 transition-colors hover:bg-orange-50 rounded-md"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(company.id)}
                      className="p-2 text-red-600 transition-colors hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && companies.length === 0 && (
          <div className="p-8 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No hay empresas</h3>
            <p className="text-gray-600">Comienza agregando una nueva empresa</p>
          </div>
        )}
      </div>
    </div>
  );
}