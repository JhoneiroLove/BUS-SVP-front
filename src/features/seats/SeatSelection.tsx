import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Clock, MapPin, CreditCard } from 'lucide-react';
import { useAuth } from '../../shared/contexts/AuthContext';
import { Route, Schedule, Company } from '../../shared/types';

interface SeatSelectionProps {
  routeId: string;
  onBack: () => void;
  onConfirm: (seatNumber: number, scheduleId: string) => void;
}

export function SeatSelection({ routeId, onBack, onConfirm }: SeatSelectionProps) {
  const { user } = useAuth();
  const [route, setRoute] = useState<Route | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simular datos de asientos (en una implementación real, esto vendría de la API)
  const generateSeats = (totalCapacity: number) => {
    const seats = [];
    for (let i = 1; i <= totalCapacity; i++) {
      seats.push({
        number: i,
        available: Math.random() > 0.3, // 70% de probabilidad de estar disponible
        occupied: Math.random() > 0.7 // 30% de probabilidad de estar ocupado
      });
    }
    return seats;
  };

  const [seats, setSeats] = useState<Array<{number: number, available: boolean, occupied: boolean}>>([]);

  useEffect(() => {
    if (selectedSchedule) {
      const seatsData = generateSeats(selectedSchedule.total_capacity);
      setSeats(seatsData);
    }
  }, [selectedSchedule]);

  const handleSeatSelect = (seatNumber: number) => {
    const seat = seats.find(s => s.number === seatNumber);
    if (seat && seat.available && !seat.occupied) {
      setSelectedSeat(seatNumber);
    }
  };

  const handleConfirm = () => {
    if (selectedSeat && selectedSchedule) {
      onConfirm(selectedSeat, selectedSchedule.id);
    }
  };

  const getSeatStatus = (seat: {number: number, available: boolean, occupied: boolean}) => {
    if (seat.occupied) return 'occupied';
    if (seat.number === selectedSeat) return 'selected';
    if (seat.available) return 'available';
    return 'unavailable';
  };

  const getSeatClass = (status: string) => {
    const baseClass = "w-8 h-8 rounded border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-colors";
    
    switch (status) {
      case 'selected':
        return `${baseClass} bg-orange-600 text-white border-orange-600`;
      case 'available':
        return `${baseClass} bg-green-100 text-green-800 border-green-300 hover:bg-green-200`;
      case 'occupied':
        return `${baseClass} bg-red-100 text-red-800 border-red-300 cursor-not-allowed`;
      case 'unavailable':
        return `${baseClass} bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed`;
      default:
        return baseClass;
    }
  };

  // Simular datos de ruta (en una implementación real, esto vendría de la API)
  useEffect(() => {
    const mockRoute: Route = {
      id: routeId,
      company_id: '1',
      origin: 'Lima',
      destination: 'Cusco',
      price: 80,
      duration: '22h',
      status: 'active',
      distance_km: 1100,
      description: 'Viaje directo Lima - Cusco',
      total_bookings: 150,
      popularity_score: 4.5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const mockCompany: Company = {
      id: '1',
      name: 'TransAndina',
      phone: '+51 999 888 777',
      email: 'info@transandina.com',
      address: 'Av. Javier Prado 123, Lima',
      description: 'Empresa líder en transporte interprovincial',
      status: 'active',
      rating: 4.5,
      total_trips: 500,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const mockSchedules: Schedule[] = [
      {
        id: '1',
        route_id: routeId,
        bus_id: '1',
        departure_time: '20:00',
        arrival_time: '18:00',
        date: '2025-01-15',
        available_seats: 35,
        total_capacity: 40,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        route_id: routeId,
        bus_id: '2',
        departure_time: '22:00',
        arrival_time: '20:00',
        date: '2025-01-15',
        available_seats: 28,
        total_capacity: 40,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    setRoute(mockRoute);
    setCompany(mockCompany);
    setSchedules(mockSchedules);
  }, [routeId]);

  if (!route || !company) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando información del viaje...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-600 transition-colors hover:bg-gray-100 rounded-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Seleccionar Asiento</h2>
      </div>

      {/* Información del viaje */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {route.origin} → {route.destination}
            </h3>
            <p className="text-gray-600">{company.name}</p>
            {route.description && (
              <p className="text-sm text-gray-500 mt-1">{route.description}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">
              S/ {route.price}
            </div>
            <div className="text-sm text-gray-500">
              {route.distance_km} km
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{route.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{route.total_bookings} reservas realizadas</span>
          </div>
        </div>
      </div>

      {/* Selección de horario */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Seleccionar Horario</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {schedules.map((schedule) => (
            <button
              key={schedule.id}
              onClick={() => setSelectedSchedule(schedule)}
              className={`p-4 text-left border-2 rounded-md transition-colors ${
                selectedSchedule?.id === schedule.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    {schedule.departure_time} - {schedule.arrival_time}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(schedule.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {schedule.available_seats} asientos disponibles
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selección de asientos */}
      {selectedSchedule && (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Seleccionar Asiento</h3>
          
          {/* Leyenda */}
          <div className="flex items-center space-x-6 mb-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-600 rounded"></div>
              <span>Seleccionado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>Ocupado</span>
            </div>
          </div>

          {/* Mapa de asientos */}
          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
            {seats.map((seat) => {
              const status = getSeatStatus(seat);
              return (
                <button
                  key={seat.number}
                  onClick={() => handleSeatSelect(seat.number)}
                  disabled={status === 'occupied' || status === 'unavailable'}
                  className={getSeatClass(status)}
                >
                  {seat.number}
                </button>
              );
            })}
          </div>

          {selectedSeat && (
            <div className="mt-6 p-4 bg-orange-50 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Asiento seleccionado: {selectedSeat}
                  </p>
                  <p className="text-sm text-gray-600">
                    Horario: {selectedSchedule.departure_time} - {selectedSchedule.arrival_time}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-orange-600">
                    S/ {route.price}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-700 transition-colors bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Volver
        </button>
        
        {selectedSeat && selectedSchedule && (
          <button
            onClick={handleConfirm}
            className="flex items-center px-6 py-2 space-x-2 text-white transition-colors bg-orange-600 rounded-md hover:bg-orange-700"
          >
            <CreditCard className="w-5 h-5" />
            <span>Confirmar Reserva</span>
          </button>
        )}
      </div>
    </div>
  );
}