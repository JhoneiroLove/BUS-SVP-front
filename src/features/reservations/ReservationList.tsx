import React from "react";
import { Calendar, MapPin, Clock, X } from "lucide-react";
import { useData } from "../../shared/contexts/DataContext";
import { useAuth } from "../../shared/contexts/AuthContext";
import { TicketPDF } from "./TicketPDF";

export function ReservationList() {
  const {
    reservations,
    schedules,
    routes,
    companies,
    buses,
    cancelReservation,
  } = useData();
  const { user } = useAuth();

  const userReservations = reservations.filter((r) => r.userId === user?.id);

  interface Reservation {
    id: string;
    userId: string;
    scheduleId: string;
    status: string;
    seatNumber: number;
    // Add other fields if needed
  }

  const getReservationDetails = (reservation: Reservation) => {
    const schedule = schedules.find((s) => s.id === reservation.scheduleId);
    const route = routes.find((r) => r.id === schedule?.routeId);
    const company = companies.find((c) => c.id === route?.companyId);
    const bus = buses.find((b) => b.id === schedule?.busId);
    return { schedule, route, company, bus };
  };

  if (userReservations.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-lg shadow-md">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No tienes reservas
        </h3>
        <p className="text-gray-600">
          Cuando realices una reserva, aparecerá aquí
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Mis Reservas</h2>

      <div className="grid gap-6">
        {userReservations.map((reservation) => {
          const { schedule, route, company, bus } =
            getReservationDetails(reservation);

          if (!schedule || !route || !company || !bus || !user) return null;

          return (
            <div
              key={reservation.id}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                reservation.status === "active"
                  ? "border-green-500"
                  : "border-red-500"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        reservation.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {reservation.status === "active" ? "Activa" : "Cancelada"}
                    </div>

                    {reservation.status === "active" && (
                      <TicketPDF
                        reservation={reservation}
                        schedule={schedule}
                        route={route}
                        company={company}
                        bus={bus}
                        user={user}
                      />
                    )}
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {route.origin} → {route.destination}
                  </h3>

                  <div className="grid gap-4 text-sm text-gray-600 md:grid-cols-2">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{company.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{schedule.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        {schedule.departureTime} - {schedule.arrivalTime}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">
                        Asiento #{reservation.seatNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="mb-2 text-xl font-bold text-orange-600">
                    ${route.price}
                  </div>
                  {reservation.status === "active" && (
                    <button
                      onClick={() => cancelReservation(reservation.id)}
                      className="flex items-center text-sm text-red-600 transition-colors hover:text-red-700"
                    >
                      <X className="w-4 h-4 mr-1" />
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