import React, { ReactNode } from 'react';
import { Bus, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, logout, isAuthenticated } = useAuth();

  const menuItems = [
    { id: 'routes', label: 'Buscar Rutas', role: 'both' },
    { id: 'reservations', label: 'Mis Reservas', role: 'user' },
    ...(user?.role === 'admin' ? [
      { id: 'admin-dashboard', label: 'Dashboard', role: 'admin' },
      { id: 'admin-routes', label: 'Gestionar Rutas', role: 'admin' },
      { id: 'admin-buses', label: 'Gestionar Buses', role: 'admin' },
      { id: 'admin-companies', label: 'Gestionar Empresas', role: 'admin' },
      { id: 'admin-schedules', label: 'Configurar Horarios', role: 'admin' },
      { id: 'admin-users', label: 'Gestionar Usuarios', role: 'admin' }
    ] : [])
  ];

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-orange-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <nav className="bg-orange-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-white" />
              <span className="text-white text-xl font-bold">BusSystem</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`text-white hover:text-orange-200 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === item.id ? 'bg-orange-700' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-white" />
                <span className="text-white text-sm">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="text-white hover:text-orange-200 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}