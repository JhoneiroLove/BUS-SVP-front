import React, { useState } from 'react';
import { Search, MapPin, Clock, DollarSign } from 'lucide-react';
import { useData } from '../../shared/contexts/DataContext';

interface RouteSearchProps {
  onSelectSchedule: (scheduleId: string) => void;
}

export function RouteSearch({ onSelectSchedule }: RouteSearchProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const { routes, schedules, companies } = useData();

  const searchResults = routes.filter(route => 
    (!origin || route.origin.toLowerCase().includes(origin.toLowerCase())) &&
    (!destination || route.destination.toLowerCase().includes(destination.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Buscar Rutas</h2>
        
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Origen
            </label>
            <div className="relative">
              <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ciudad de origen"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destino
            </label>
            <div className="relative">
              <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ciudad de destino"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="flex items-end">
            <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Buscar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {searchResults.map(route => {
          const company = companies.find(c => c.id === route.companyId);
          const routeSchedules = schedules.filter(s => s.routeId === route.id);
          
          return (
            <div key={route.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {route.origin} → {route.destination}
                  </h3>
                  <p className="text-gray-600">{company?.name}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center text-orange-600 font-semibold">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>${route.price}</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {routeSchedules.map(schedule => (
                  <div
                    key={schedule.id}
                    className="border border-gray-200 rounded-md p-3 hover:border-orange-300 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{schedule.departureTime}</span>
                      <span className="text-sm text-gray-600">→ {schedule.arrivalTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {schedule.availableSeats} asientos
                      </span>
                      <button
                        onClick={() => onSelectSchedule(schedule.id)}
                        className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
                      >
                        Seleccionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {searchResults.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay rutas disponibles</h3>
          <p className="text-gray-600">Intenta con diferentes ciudades o fechas</p>
        </div>
      )}
    </div>
  );
}