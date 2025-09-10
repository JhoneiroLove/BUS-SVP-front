import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, Clock, Bus, Route } from 'lucide-react';
import { schedulesService } from '../../shared/services/schedules';
import { routesService } from '../../shared/services/routes';
import { busesService } from '../../shared/services/buses';
import { Schedule, Route as RouteType, Bus as BusType } from '../../shared/types';

export function ScheduleManagement() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [buses, setBuses] = useState<BusType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    route_id: '',
    bus_id: '',
    departure_time: '',
    arrival_time: '',
    date: '',
    available_seats: ''
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [schedulesData, routesData, busesData] = await Promise.all([
        schedulesService.getAllSchedules(),
        routesService.getAllRoutes(),
        busesService.getAllBuses()
      ]);
      setSchedules(schedulesData);
      setRoutes(routesData);
      setBuses(busesData);
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
      
      const scheduleData = {
        ...formData,
        available_seats: parseInt(formData.available_seats),
        total_capacity: parseInt(formData.available_seats),
        status: 'active',
        occupied_seats: 0,
        reserved_seats: 0
      };
      
      if (editingSchedule) {
        await schedulesService.updateSchedule(editingSchedule.id, scheduleData);
      } else {
        await schedulesService.createSchedule(scheduleData);
      }
      
      await loadData(); // Recargar la lista
      resetForm();
    } catch (err) {
      setError('Error al guardar el horario');
      console.error('Error saving schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      try {
        setLoading(true);
        setError(null);
        await schedulesService.deleteSchedule(id);
        await loadData(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar el horario');
        console.error('Error deleting schedule:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      route_id: '', 
      bus_id: '', 
      departure_time: '', 
      arrival_time: '', 
      date: '', 
      available_seats: '' 
    });
    setShowForm(false);
    setEditingSchedule(null);
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      route_id: schedule.route_id,
      bus_id: schedule.bus_id,
      departure_time: schedule.departure_time,
      arrival_time: schedule.arrival_time,
      date: schedule.date,
      available_seats: schedule.available_seats.toString()
    });
    setShowForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
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
      case 'completed':
        return 'Completado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Configurar Horarios</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-orange-600 rounded-md hover:bg-orange-700"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Horario</span>
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
            {editingSchedule ? 'Editar Horario' : 'Nuevo Horario'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Ruta *
                </label>
                <select
                  value={formData.route_id}
                  onChange={(e) => setFormData({ ...formData, route_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">Seleccionar ruta</option>
                  {routes.map(route => (
                    <option key={route.id} value={route.id}>
                      {route.origin} → {route.destination}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Bus *
                </label>
                <select
                  value={formData.bus_id}
                  onChange={(e) => setFormData({ ...formData, bus_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">Seleccionar bus</option>
                  {buses.map(bus => (
                    <option key={bus.id} value={bus.id}>
                      {bus.model} - {bus.plate_number} ({bus.capacity} asientos)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Hora de Salida *
                </label>
                <input
                  type="time"
                  value={formData.departure_time}
                  onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Hora de Llegada *
                </label>
                <input
                  type="time"
                  value={formData.arrival_time}
                  onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Asientos Disponibles *
                </label>
                <input
                  type="number"
                  value={formData.available_seats}
                  onChange={(e) => setFormData({ ...formData, available_seats: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
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
                {loading ? 'Guardando...' : editingSchedule ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Lista de Horarios</h3>
        </div>

        {loading && !showForm ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando horarios...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {schedules.map((schedule) => {
              const route = routes.find(r => r.id === schedule.route_id);
              const bus = buses.find(b => b.id === schedule.bus_id);
              return (
                <div key={schedule.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-6 h-6 text-orange-600" />
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {route ? `${route.origin} → ${route.destination}` : 'Ruta no encontrada'}
                          </h4>
                          <p className="text-gray-600">
                            {bus ? `${bus.model} - ${bus.plate_number}` : 'Bus no encontrado'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2 mt-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Salida: {schedule.departure_time}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Llegada: {schedule.arrival_time}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Fecha: {schedule.date}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Bus className="w-4 h-4" />
                            <span>Asientos: {schedule.available_seats}/{schedule.total_capacity}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(schedule.status)}`}>
                              {getStatusLabel(schedule.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="p-2 text-orange-600 transition-colors hover:bg-orange-50 rounded-md"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
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

        {!loading && schedules.length === 0 && (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No hay horarios</h3>
            <p className="text-gray-600">Comienza agregando un nuevo horario</p>
          </div>
        )}
      </div>
    </div>
  );
}