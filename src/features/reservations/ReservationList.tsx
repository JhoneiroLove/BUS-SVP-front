import React from 'react';
import { Calendar, MapPin, Clock, X } from 'lucide-react';
import { useData } from '../../shared/contexts/DataContext';
import { useAuth } from '../../shared/contexts/AuthContext';

export function ReservationList() {
  const { reservations, schedules, routes, companies, cancelReservation } = useData();
  const { user } = useAuth();

  const userReservations = reservations.filter(r => r.userId === user?.id);

  const getReservationDetails = (reservation: any) => {
    const schedule = schedules.find(s => s.id === reservation.scheduleId);
    const route = routes.find(r => r.id === schedule?.routeId);
    const company = companies.find(c => c.id === route?.companyId);
    return { schedule, route, company };
  };

  if (userReservations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes reservas</h3>
        <p className="text-gray-600">Cuando realices una reserva, aparecerá aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Mis Reservas</h2>
      
      <div className="grid gap-6">
        {userReservations.map(reservation => {
          const { schedule, route, company } = getReservationDetails(reservation);
          
          if (!schedule || !route || !company) return null;

          return (
            <div
              key={reservation.id}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                reservation.status === 'active' ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reservation.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {reservation.status === 'active' ? 'Activa' : 'Cancelada'}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {route.origin} → {route.destination}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{company.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{schedule.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{schedule.departureTime} - {schedule.arrivalTime}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Asiento #{reservation.seatNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold text-orange-600 mb-2">
                    ${route.price}
                  </div>
                  {reservation.status === 'active' && (
                    <button
                      onClick={() => cancelReservation(reservation.id)}
                      className="flex items-center text-red-600 hover:text-red-700 transition-colors text-sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}