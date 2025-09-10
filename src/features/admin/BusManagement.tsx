import React, { useState, useEffect } from 'react';
import { Bus, Plus, Edit, Trash2, Users, Wrench, Calendar } from 'lucide-react';
import { busesService } from '../../shared/services/buses';
import { companiesService } from '../../shared/services/companies';
import { Bus as BusType, Company } from '../../shared/types';

export function BusManagement() {
  const [buses, setBuses] = useState<BusType[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState<BusType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company_id: '',
    plate_number: '',
    capacity: '',
    model: '',
    year: '',
    features: [] as string[],
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
      const [busesData, companiesData] = await Promise.all([
        busesService.getAllBuses(),
        companiesService.getAllCompanies()
      ]);
      setBuses(busesData);
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
      
      const busData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        year: formData.year ? parseInt(formData.year) : undefined,
        features: formData.features.filter(f => f.trim() !== '')
      };
      
      if (editingBus) {
        await busesService.updateBus(editingBus.id, busData);
      } else {
        await busesService.createBus(busData);
      }
      
      await loadData(); // Recargar la lista
      resetForm();
    } catch (err) {
      setError('Error al guardar el bus');
      console.error('Error saving bus:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este bus?')) {
      try {
        setLoading(true);
        setError(null);
        await busesService.deleteBus(id);
        await loadData(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar el bus');
        console.error('Error deleting bus:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      company_id: '', 
      plate_number: '', 
      capacity: '', 
      model: '', 
      year: '', 
      features: [], 
      status: 'active' 
    });
    setShowForm(false);
    setEditingBus(null);
  };

  const handleEdit = (bus: BusType) => {
    setEditingBus(bus);
    setFormData({
      company_id: bus.company_id,
      plate_number: bus.plate_number,
      capacity: bus.capacity.toString(),
      model: bus.model,
      year: bus.year?.toString() || '',
      features: bus.features || [],
      status: bus.status
    });
    setShowForm(true);
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
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
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'maintenance':
        return 'En Mantenimiento';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Buses</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-orange-600 rounded-md hover:bg-orange-700"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Bus</span>
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
            {editingBus ? 'Editar Bus' : 'Nuevo Bus'}
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
                  Placa *
                </label>
                <input
                  type="text"
                  value={formData.plate_number}
                  onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Capacidad *
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Modelo *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Año
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="maintenance">En Mantenimiento</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Características
              </label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Ej: Aire acondicionado, WiFi, etc."
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-3 py-2 text-red-600 transition-colors hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-3 py-2 text-orange-600 transition-colors hover:bg-orange-50 rounded-md"
                >
                  + Agregar característica
                </button>
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
                {loading ? 'Guardando...' : editingBus ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Lista de Buses</h3>
        </div>

        {loading && !showForm ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando buses...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {buses.map((bus) => {
              const company = companies.find(c => c.id === bus.company_id);
              return (
                <div key={bus.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Bus className="w-6 h-6 text-orange-600" />
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {bus.model} - {bus.plate_number}
                          </h4>
                          <p className="text-gray-600">{company?.name}</p>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2 mt-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>Capacidad: {bus.capacity} asientos</span>
                          </div>
                          {bus.year && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>Año: {bus.year}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Wrench className="w-4 h-4" />
                            <span>Estado: {getStatusLabel(bus.status)}</span>
                          </div>
                        </div>
                        
                        <div>
                          {bus.features && bus.features.length > 0 && (
                            <div className="text-sm text-gray-600">
                              <strong>Características:</strong>
                              <ul className="mt-1 list-disc list-inside">
                                {bus.features.map((feature, index) => (
                                  <li key={index}>{feature}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(bus)}
                        className="p-2 text-orange-600 transition-colors hover:bg-orange-50 rounded-md"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(bus.id)}
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

        {!loading && buses.length === 0 && (
          <div className="p-8 text-center">
            <Bus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No hay buses</h3>
            <p className="text-gray-600">Comienza agregando un nuevo bus</p>
          </div>
        )}
      </div>
    </div>
  );
}