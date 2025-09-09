import React from 'react';
import { Users, Bus, MapPin, Calendar, Building } from 'lucide-react';
import { useData } from '../../shared/contexts/DataContext';

export function AdminDashboard() {
  const { companies, buses, routes, schedules, reservations } = useData();

  const stats = [
    {
      name: 'Empresas',
      value: companies.length.toString(),
      icon: Building,
      color: 'bg-blue-500'
    },
    {
      name: 'Buses',
      value: buses.length.toString(),
      icon: Bus,
      color: 'bg-green-500'
    },
    {
      name: 'Rutas',
      value: routes.length.toString(),
      icon: MapPin,
      color: 'bg-orange-500'
    },
    {
      name: 'Horarios',
      value: schedules.length.toString(),
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      name: 'Reservas',
      value: reservations.length.toString(),
      icon: Users,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Panel de Administración</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acceso Rápido</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
            <Building className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Gestionar Empresas</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
            <Bus className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Gestionar Buses</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
            <MapPin className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Gestionar Rutas</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
            <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Configurar Horarios</p>
          </div>
        </div>
      </div>
    </div>
  );
}