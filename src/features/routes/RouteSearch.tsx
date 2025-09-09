import React, { useState, useMemo } from 'react';
import { Search, MapPin, Clock, DollarSign, Calendar } from 'lucide-react';
import { useData } from '../../shared/contexts/DataContext';

interface RouteSearchProps {
  onSelectSchedule: (scheduleId: string) => void;
}

export function RouteSearch({ onSelectSchedule }: RouteSearchProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { routes, schedules, companies } = useData();

  // Filtrar rutas basado en los criterios de búsqueda
  const filteredResults = useMemo(() => {
    if (!showResults && !origin && !destination && !date) {
      return routes; // Mostrar todas las rutas si no hay búsqueda activa
    }

    return routes.filter(route => {
      const matchesOrigin = !origin || route.origin.toLowerCase().includes(origin.toLowerCase());
      const matchesDestination = !destination || route.destination.toLowerCase().includes(destination.toLowerCase());
      
      // Si hay filtro de fecha, verificar que existan horarios para esa fecha
      const matchesDate = !date || schedules.some(schedule => 
        schedule.routeId === route.id && schedule.date === date
      );
      
      return matchesOrigin && matchesDestination && matchesDate;
    });
  }, [routes, schedules, origin, destination, date, showResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const clearSearch = () => {
    setOrigin('');
    setDestination('');
    setDate('');
    setShowResults(false);
  };

  // Obtener horarios filtrados por fecha si se especifica
  const getFilteredSchedules = (routeId: string) => {
    const routeSchedules = schedules.filter(s => s.routeId === routeId);
    
    if (date) {
      return routeSchedules.filter(s => s.date === date);
    }
    
    return routeSchedules;
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Buscar Rutas</h2>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Origen
              </label>
              <div className="relative">
                <MapPin className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ciudad de origen"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Destino
              </label>
              <div className="relative">
                <MapPin className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ciudad de destino"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Fecha de Viaje
              </label>
              <div className="relative">
                <Calendar className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex items-end space-x-2">
              <button
                type="submit"
                className="flex items-center justify-center flex-1 px-4 py-2 space-x-2 text-white transition-colors bg-orange-600 rounded-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <Search className="w-5 h-5" />
                <span>Buscar</span>
              </button>
              
              {showResults && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-4 py-2 text-gray-700 transition-colors bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </form>

        {showResults && (
          <div className="p-4 mt-4 rounded-md bg-orange-50">
            <p className="text-sm text-orange-800">
              Mostrando {filteredResults.length} resultado(s) 
              {origin && ` desde ${origin}`}
              {destination && ` hacia ${destination}`}
              {date && ` para el ${date}`}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredResults.map(route => {
          const company = companies.find(c => c.id === route.companyId);
          const routeSchedules = getFilteredSchedules(route.id);
          
          // No mostrar rutas sin horarios disponibles si se filtró por fecha
          if (date && routeSchedules.length === 0) {
            return null;
          }
          
          return (
            <div key={route.id} className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {route.origin} → {route.destination}
                  </h3>
                  <p className="text-gray-600">{company?.name}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-1 text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center font-semibold text-orange-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>${route.price}</span>
                  </div>
                </div>
              </div>

              {routeSchedules.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {routeSchedules.map(schedule => (
                    <div
                      key={schedule.id}
                      className="p-3 transition-colors border border-gray-200 rounded-md hover:border-orange-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{schedule.departureTime}</span>
                        <span className="text-sm text-gray-600">→ {schedule.arrivalTime}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">{schedule.date}</span>
                        <span className="text-sm text-gray-600">
                          {schedule.availableSeats} asientos
                        </span>
                      </div>
                      <button
                        onClick={() => onSelectSchedule(schedule.id)}
                        disabled={schedule.availableSeats === 0}
                        className={`w-full px-3 py-1 rounded text-sm transition-colors ${
                          schedule.availableSeats === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-orange-600 text-white hover:bg-orange-700'
                        }`}
                      >
                        {schedule.availableSeats === 0 ? 'Sin asientos' : 'Seleccionar'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-gray-500">
                  <p>No hay horarios disponibles para esta ruta</p>
                  {date && <p className="text-sm">Intenta con otra fecha</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredResults.length === 0 && showResults && (
        <div className="p-12 text-center bg-white rounded-lg shadow-md">
          <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No se encontraron rutas</h3>
          <p className="text-gray-600">
            No hay rutas disponibles con los criterios de búsqueda especificados
          </p>
          <button
            onClick={clearSearch}
            className="mt-4 font-medium text-orange-600 hover:text-orange-700"
          >
            Ver todas las rutas disponibles
          </button>
        </div>
      )}

      {!showResults && filteredResults.length === 0 && (
        <div className="p-12 text-center bg-white rounded-lg shadow-md">
          <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">Busca tu viaje ideal</h3>
          <p className="text-gray-600">
            Completa los campos de búsqueda para encontrar las mejores rutas
          </p>
        </div>
      )}
    </div>
  );
}