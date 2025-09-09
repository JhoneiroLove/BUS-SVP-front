import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useData } from '../../shared/contexts/DataContext';
import { useAuth } from '../../shared/contexts/AuthContext';

interface SeatSelectionProps {
  scheduleId: string;
  onBack: () => void;
  onComplete: () => void;
}

export function SeatSelection({ scheduleId, onBack, onComplete }: SeatSelectionProps) {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const { schedules, routes, companies, buses, addReservation } = useData();
  const { user } = useAuth();

  const schedule = schedules.find(s => s.id === scheduleId);
  const route = routes.find(r => r.id === schedule?.routeId);
  const company = companies.find(c => c.id === route?.companyId);
  const bus = buses.find(b => b.id === schedule?.busId);

  if (!schedule || !route || !company || !bus) {
    return <div>Error: No se encontró la información del viaje</div>;
  }

  const totalSeats = bus.capacity;
  const occupiedSeats = [5, 12, 18, 23]; // Mock occupied seats

  const handleConfirmReservation = () => {
    if (selectedSeat && user) {
      addReservation({
        userId: user.id,
        scheduleId: schedule.id,
        seatNumber: selectedSeat,
        status: 'active'
      });
      onComplete();
    }
  };

  const renderSeat = (seatNumber: number) => {
    const isOccupied = occupiedSeats.includes(seatNumber);
    const isSelected = selectedSeat === seatNumber;

    return (
      <button
        key={seatNumber}
        onClick={() => !isOccupied && setSelectedSeat(seatNumber)}
        disabled={isOccupied}
        className={`
          w-8 h-8 rounded-md border-2 text-xs font-medium transition-all
          ${isOccupied 
            ? 'bg-red-100 border-red-300 text-red-600 cursor-not-allowed' 
            : isSelected
            ? 'bg-orange-600 border-orange-600 text-white'
            : 'bg-white border-gray-300 text-gray-600 hover:border-orange-300 hover:bg-orange-50'
          }
        `}
      >
        {seatNumber}
      </button>
    );
  };

  const seatsPerRow = 4;
  const rows = Math.ceil(totalSeats / seatsPerRow);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver a rutas
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Seleccionar Asiento</h2>
          <div className="text-gray-600">
            <p>{route.origin} → {route.destination}</p>
            <p>{company.name} • {schedule.departureTime} • {schedule.date}</p>
            <p>Bus: {bus.plateNumber} ({bus.model})</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-100 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="bg-gray-800 text-white px-4 py-2 rounded-md inline-block mb-2">
                  Conductor
                </div>
              </div>
              
              <div className="space-y-2">
                {Array.from({ length: rows }, (_, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center space-x-2">
                    <div className="flex space-x-1">
                      {Array.from({ length: 2 }, (_, seatInRow) => {
                        const seatNumber = rowIndex * seatsPerRow + seatInRow + 1;
                        return seatNumber <= totalSeats ? renderSeat(seatNumber) : null;
                      })}
                    </div>
                    <div className="w-4"></div>
                    <div className="flex space-x-1">
                      {Array.from({ length: 2 }, (_, seatInRow) => {
                        const seatNumber = rowIndex * seatsPerRow + seatInRow + 3;
                        return seatNumber <= totalSeats ? renderSeat(seatNumber) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-6 mt-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded mr-2"></div>
                <span>Disponible</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-600 border-2 border-orange-600 rounded mr-2"></div>
                <span>Seleccionado</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded mr-2"></div>
                <span>Ocupado</span>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de la Reserva</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ruta:</span>
                  <span className="font-medium">{route.origin} → {route.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">{schedule.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horario:</span>
                  <span className="font-medium">{schedule.departureTime} - {schedule.arrivalTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Asiento:</span>
                  <span className="font-medium">{selectedSeat ? `#${selectedSeat}` : 'No seleccionado'}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-semibold text-orange-600">${route.price}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirmReservation}
                disabled={!selectedSeat}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Confirmar Reserva</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}