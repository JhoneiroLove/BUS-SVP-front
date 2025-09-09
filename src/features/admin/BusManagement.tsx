import React, { useState } from 'react';
import { Bus, Plus, Edit, Trash2, Users } from 'lucide-react';
import { useData } from '../../shared/contexts/DataContext';

export function BusManagement() {
  const { buses, companies, addBus, updateBus, deleteBus } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState<any>(null);
  const [formData, setFormData] = useState({
    companyId: '',
    plateNumber: '',
    capacity: '',
    model: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const busData = {
      ...formData,
      capacity: parseInt(formData.capacity)
    };
    
    if (editingBus) {
      updateBus(editingBus.id, busData);
    } else {
      addBus(busData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ companyId: '', plateNumber: '', capacity: '', model: '' });
    setShowForm(false);
    setEditingBus(null);
  };

  const handleEdit = (bus: any) => {
    setEditingBus(bus);
    setFormData({
      companyId: bus.companyId,
      plateNumber: bus.plateNumber,
      capacity: bus.capacity.toString(),
      model: bus.model
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestionar Buses</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nuevo Bus</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingBus ? 'Editar Bus' : 'Nuevo Bus'}
          </h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa
              </label>
              <select
                value={formData.companyId}
                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Placa
              </label>
              <input
                type="text"
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="ABC-123"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidad
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                min="1"
                max="60"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Mercedes Benz"
                required
              />
            </div>
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
              >
                {editingBus ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {buses.map(bus => {
          const company = companies.find(c => c.id === bus.companyId);
          return (
            <div key={bus.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Bus className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{bus.plateNumber}</h3>
                    <p className="text-gray-600">{company?.name}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>{bus.model}</span>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{bus.capacity} asientos</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(bus)}
                    className="text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteBus(bus.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}