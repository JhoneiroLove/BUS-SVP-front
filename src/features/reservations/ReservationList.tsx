import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, X, ArrowLeft } from "lucide-react";
import { useAuth } from "../../shared/contexts/AuthContext";
import { reservationsService } from "../../shared/services/reservations";
import { Reservation } from "../../shared/types";

export function ReservationList() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar reservas del usuario
  useEffect(() => {
    const loadReservations = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        const userReservations = await reservationsService.getUserReservations(user.id);
        setReservations(userReservations);
      } catch (err) {
        setError('Error al cargar las reservas');
        console.error('Error loading reservations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, [user?.id]);

  const handleCancelReservation = async (reservationId: string) => {
    if (window.confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
      try {
        setLoading(true);
        setError(null);
        await reservationsService.cancelReservation(reservationId);
        
        // Recargar la lista de reservas
        if (user?.id) {
          const updatedReservations = await reservationsService.getUserReservations(user.id);
          setReservations(updatedReservations);
        }
        
        alert('Reserva cancelada exitosamente');
      } catch (err) {
        setError('Error al cancelar la reserva');
        console.error('Error canceling reservation:', err);
        alert('Error al cancelar la reserva. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'cancelled':
        return 'Cancelada';
      case 'completed':
        return 'Completada';
      case 'expired':
        return 'Expirada';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando reservas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="p-4 rounded-md bg-red-50">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold text-gray-900">Mis Reservas</h2>
      </div>

      {reservations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg shadow-md">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No tienes reservas</h3>
          <p className="text-gray-600">Cuando hagas una reserva, aparecerá aquí</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Reserva #{reservation.reservation_code}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(reservation.status)}`}>
                      {getStatusLabel(reservation.status)}
                    </span>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span>Ruta: {reservation.route?.origin} → {reservation.route?.destination}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                        <Clock className="w-4 h-4" />
                        <span>Asiento: {reservation.seat_number}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Fecha: {new Date(reservation.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-semibold text-orange-600">
                        S/ {reservation.price}
                      </div>
                      {reservation.cancelled_at && (
                        <div className="text-sm text-gray-500">
                          Cancelada: {new Date(reservation.cancelled_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {reservation.status === 'active' && (
                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      className="p-2 text-red-600 transition-colors hover:bg-red-50 rounded-md"
                      disabled={loading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {reservation.cancellation_reason && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Motivo de cancelación:</strong> {reservation.cancellation_reason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}