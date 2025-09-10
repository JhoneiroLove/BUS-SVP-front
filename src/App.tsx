import React, { useState } from "react";
import { AuthProvider, useAuth } from "./shared/contexts/AuthContext";
import { DataProvider } from "./shared/contexts/DataContext";
import { NotificationProvider } from "./shared/components/NotificationContext";
import { Layout } from "./shared/components/Layout";
import { LoginForm } from "./features/auth/LoginForm";
import { RegisterForm } from "./features/auth/RegisterForm";
import { RouteSearch } from "./features/routes/RouteSearch";
import { SeatSelection } from "./features/seats/SeatSelection";
import { ReservationList } from "./features/reservations/ReservationList";
import { AdminDashboard } from "./features/admin/AdminDashboard";
import { CompanyManagement } from "./features/admin/CompanyManagement";
import { BusManagement } from "./features/admin/BusManagement";
import { RouteManagement } from "./features/admin/RouteManagement";
import { ScheduleManagement } from "./features/admin/ScheduleManagement";
import { UserManagement } from "./features/admin/UserManagement";
import { reservationsService } from "./shared/services/reservations";

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState("routes");
  const [showRegister, setShowRegister] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null
  );

  if (!isAuthenticated) {
    return showRegister ? (
      <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  const handleSelectSchedule = (scheduleId: string) => {
    setSelectedScheduleId(scheduleId);
    setCurrentPage("seat-selection");
  };

  const handleBackToRoutes = () => {
    setSelectedScheduleId(null);
    setCurrentPage("routes");
  };

  const handleReservationComplete = async (seatNumber: number, scheduleId: string) => {
    try {
      console.log(`Creando reserva: Asiento ${seatNumber}, Horario ${scheduleId}`);
      
      // Crear reserva real usando el servicio
      const reservationData = {
        user_id: user?.id || "1", // Usar el ID del usuario autenticado
        schedule_id: scheduleId,
        seat_number: seatNumber
      };
      
      const reservation = await reservationsService.createReservation(reservationData);
      
      alert(`¡Reserva confirmada!\nCódigo: ${reservation.reservation_code}\nAsiento: ${seatNumber}\nPrecio: S/ ${reservation.price}`);
      
      setSelectedScheduleId(null);
      setCurrentPage("reservations");
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Error al crear la reserva. Por favor, inténtalo de nuevo.');
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case "routes":
        return <RouteSearch onSelectSchedule={handleSelectSchedule} />;

      case "seat-selection":
        return selectedScheduleId ? (
          <SeatSelection
            routeId={selectedScheduleId}
            onBack={handleBackToRoutes}
            onConfirm={handleReservationComplete}
          />
        ) : (
          <RouteSearch onSelectSchedule={handleSelectSchedule} />
        );

      case "reservations":
        return <ReservationList />;

      case "admin-dashboard":
        return <AdminDashboard />;

      case "admin-routes":
        return <RouteManagement />;

      case "admin-buses":
        return <BusManagement />;

      case "admin-companies":
        return <CompanyManagement />;

      case "admin-schedules":
        return <ScheduleManagement />;

      case "admin-users":
        return <UserManagement />;

      default:
        return <RouteSearch onSelectSchedule={handleSelectSchedule} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderContent()}
    </Layout>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
