import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Mail, Phone, Shield, CheckCircle, XCircle } from 'lucide-react';
import { usersService } from '../../shared/services/users';
import { User } from '../../shared/types';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    is_active: true,
    email_verified: false
  });

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await usersService.getAllUsers();
      setUsers(usersData);
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (editingUser) {
        await usersService.updateUser(editingUser.id, formData);
      }
      
      await loadUsers(); // Recargar la lista
      resetForm();
    } catch (err) {
      setError('Error al guardar el usuario');
      console.error('Error saving user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        setLoading(true);
        setError(null);
        await usersService.deleteUser(id);
        await loadUsers(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar el usuario');
        console.error('Error deleting user:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      role: 'user', 
      is_active: true, 
      email_verified: false 
    });
    setShowForm(false);
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      is_active: user.is_active,
      email_verified: user.email_verified
    });
    setShowForm(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'user':
        return 'Usuario';
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-orange-600 rounded-md hover:bg-orange-700"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Rol
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Usuario Activo</span>
                </label>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.email_verified}
                    onChange={(e) => setFormData({ ...formData, email_verified: e.target.checked })}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email Verificado</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 transition-colors bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-white transition-colors bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : editingUser ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Lista de Usuarios</h3>
        </div>

        {loading && !showForm ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando usuarios...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <div key={user.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Users className="w-6 h-6 text-orange-600" />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {user.name}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                          <div className="flex items-center space-x-1">
                            {user.is_active ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm text-gray-600">
                              {user.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {user.email_verified ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm text-gray-600">
                              {user.email_verified ? 'Email Verificado' : 'Email No Verificado'}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Creado: {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 text-orange-600 transition-colors hover:bg-orange-50 rounded-md"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-red-600 transition-colors hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No hay usuarios</h3>
            <p className="text-gray-600">Comienza agregando un nuevo usuario</p>
          </div>
        )}
      </div>
    </div>
  );
}