import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Clock, DollarSign, Route } from 'lucide-react';
import { routesService } from '../../shared/services/routes';
import { companiesService } from '../../shared/services/companies';
import { Route as RouteType, Company } from '../../shared/types';

export function RouteManagement() {
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company_id: '',
    origin: '',
    destination: '',
    price: '',
    duration: '',
    distance_km: '',
    description: '',
    status: 'active'
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [routesData, companiesData] = await Promise.all([
        routesService.getAllRoutes(),
        companiesService.getAllCompanies()
      ]);
      setRoutes(routesData);
      setCompanies(companiesData);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const routeData = {
        ...formData,
        price: parseFloat(formData.price),
        distance_km: parseFloat(formData.distance_km)
      };

      if (editingRoute) {
        await routesService.updateRoute(editingRoute.id, routeData);
      } else {
        await routesService.createRoute(routeData);
      }

      await loadData(); // Recargar la lista
      resetForm();
    } catch (err) {
      setError('Error al guardar la ruta');
      console.error('Error saving route:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta ruta?')) {
      try {
        setLoading(true);
        setError(null);
        await routesService.deleteRoute(id);
        await loadData(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar la ruta');
        console.error('Error deleting route:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      company_id: '',
      origin: '',
      destination: '',
      price: '',
      duration: '',
      distance_km: '',
      description: '',
      status: 'active'
    });
    setShowForm(false);
    setEditingRoute(null);
  };

  const handleEdit = (route: RouteType) => {
    setEditingRoute(route);
    setFormData({
      company_id: route.company_id,
      origin: route.origin,
      destination: route.destination,
      price: route.price.toString(),
      duration: route.duration,
      distance_km: route.distance_km?.toString() || '',
      description: route.description || '',
      status: route.status
    });
    setShowForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'inactive':
        return 'Inactiva';
      case 'maintenance':
        return 'En Mantenimiento';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Rutas</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-orange-600 rounded-md hover:bg-orange-700"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Ruta</span>
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
            {editingRoute ? 'Editar Ruta' : 'Nueva Ruta'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Empresa *
                </label>
                <select
                  value={formData.company_id}
                  onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">Seleccionar empresa</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
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
                  <option value="maintenance">En Mantenimiento</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Origen *
                </label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Destino *
                </label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Precio (S/) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Duración *
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="Ej: 8h, 22h, 1d 2h"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Distancia (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.distance_km}
                  onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Descripción de la ruta, características especiales, etc."
              />
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
                {loading ? 'Guardando...' : editingRoute ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Lista de Rutas</h3>
        </div>

        {loading && !showForm ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando rutas...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {routes.map((route) => {
              const company = companies.find(c => c.id === route.company_id);
              return (
                <div key={route.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-6 h-6 text-orange-600" />
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {route.origin} → {route.destination}
                          </h4>
                          <p className="text-gray-600">{company?.name}</p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 mt-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Duración: {route.duration}</span>
                          </div>
                          {route.distance_km && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Route className="w-4 h-4" />
                              <span>Distancia: {route.distance_km} km</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(route.status)}`}>
                              {getStatusLabel(route.status)}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center justify-end space-x-1 text-lg font-semibold text-orange-600">
                            <DollarSign className="w-5 h-5" />
                            <span>S/ {route.price}</span>
                          </div>
                          {route.total_bookings && (
                            <div className="text-sm text-gray-500 mt-1">
                              {route.total_bookings} reservas realizadas
                            </div>
                          )}
                        </div>
                      </div>

                      {route.description && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-600">{route.description}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(route)}
                        className="p-2 text-orange-600 transition-colors hover:bg-orange-50 rounded-md"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(route.id)}
                        className="p-2 text-red-600 transition-colors hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && routes.length === 0 && (
          <div className="p-8 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No hay rutas</h3>
            <p className="text-gray-600">Comienza agregando una nueva ruta</p>
          </div>
        )}
      </div>
    </div>
  );
}