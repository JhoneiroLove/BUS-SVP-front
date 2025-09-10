import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Clock, DollarSign, Calendar } from 'lucide-react';
import { routesService, RouteSearchParams } from '../../shared/services/routes';
import { companiesService } from '../../shared/services/companies';
import { Route, Company } from '../../shared/types';

interface RouteSearchProps {
  onSelectSchedule: (scheduleId: string) => void;
}

export function RouteSearch({ onSelectSchedule }: RouteSearchProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [routesData, companiesData] = await Promise.all([
          routesService.getAllRoutes(),
          companiesService.getAllCompanies()
        ]);
        setRoutes(routesData);
        setCompanies(companiesData);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('Error loading initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Filtrar rutas basado en los criterios de búsqueda
  const filteredResults = useMemo(() => {
    if (!showResults && !origin && !destination && !date) {
      return routes; // Mostrar todas las rutas si no hay búsqueda activa
    }

    return routes.filter(route => {
      const matchesOrigin = !origin || route.origin.toLowerCase().includes(origin.toLowerCase());
      const matchesDestination = !destination || route.destination.toLowerCase().includes(destination.toLowerCase());
      
      return matchesOrigin && matchesDestination;
    });
  }, [routes, origin, destination, date, showResults]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const searchParams: RouteSearchParams = {
        origin: origin || undefined,
        destination: destination || undefined,
        date: date || undefined,
        min_seats: 1
      };
      
      const searchResults = await routesService.searchRoutes(searchParams);
      setRoutes(searchResults);
      setShowResults(true);
    } catch (err) {
      setError('Error al buscar rutas');
      console.error('Error searching routes:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = async () => {
    setOrigin('');
    setDestination('');
    setDate('');
    setShowResults(false);
    setError(null);
    
    // Recargar todas las rutas
    try {
      setLoading(true);
      const routesData = await routesService.getAllRoutes();
      setRoutes(routesData);
    } catch (err) {
      setError('Error al cargar las rutas');
      console.error('Error loading routes:', err);
    } finally {
      setLoading(false);
    }
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
                disabled={loading}
                className="flex items-center justify-center flex-1 px-4 py-2 space-x-2 text-white transition-colors bg-orange-600 rounded-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="w-5 h-5" />
                <span>{loading ? 'Buscando...' : 'Buscar'}</span>
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

        {error && (
          <div className="p-4 mt-4 rounded-md bg-red-50">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {showResults && !error && (
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
          const company = companies.find(c => c.id === route.company_id);
          
          return (
            <div key={route.id} className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {route.origin} → {route.destination}
                  </h3>
                  <p className="text-gray-600">{company?.name}</p>
                  {route.description && (
                    <p className="text-sm text-gray-500 mt-1">{route.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-1 text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center font-semibold text-orange-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>S/ {route.price}</span>
                  </div>
                  {route.distance_km && (
                    <div className="text-sm text-gray-500 mt-1">
                      {route.distance_km} km
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{route.total_bookings}</span> reservas realizadas
                </div>
                <button
                  onClick={() => onSelectSchedule(route.id)}
                  className="px-6 py-2 text-white transition-colors bg-orange-600 rounded-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Ver Horarios
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="p-12 text-center bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">Cargando rutas...</h3>
          <p className="text-gray-600">Por favor espera mientras buscamos las mejores opciones</p>
        </div>
      )}

      {!loading && filteredResults.length === 0 && showResults && (
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

      {!loading && !showResults && filteredResults.length === 0 && (
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