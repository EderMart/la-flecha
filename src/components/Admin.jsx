import React, { useState, useEffect } from 'react';
import { Edit3, Save, X, Upload, Eye, EyeOff, Plus, Trash2, Search, Download, RotateCcw, AlertCircle, BarChart3, Database, RefreshCw } from 'lucide-react';
import { useProducts } from './ProductContext';

const Admin = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('anillos');
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [importData, setImportData] = useState('');
  const [notification, setNotification] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'
  
  // Usar el contexto de productos
  const { 
    productos, 
    isLoading,
    updateProduct, 
    deleteProduct, 
    addProduct, 
    getNextId, 
    resetProducts, 
    exportProducts, 
    importProducts,
    clearLocalStorage,
    getStats,
    markLastUpdated
  } = useProducts();

  //mostrar notificaciones
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = () => {
    if (password === 'admin123') {
      setShowAdmin(true);
      setPassword('');
      showNotification('Sesión iniciada correctamente');
    } else {
      showNotification('Contraseña incorrecta', 'error');
    }
  };

  const handleLogout = () => {
    setShowAdmin(false);
    setEditingProduct(null);
    showNotification('Sesión cerrada');
  };

  const handleEdit = (categoria, producto) => {
    setEditingProduct({ categoria, ...producto });
  };

  const handleSave = () => {
    if (editingProduct) {
      const updatedProduct = {
        id: editingProduct.id,
        titulo: editingProduct.titulo,
        precio: editingProduct.precio,
        descripcion: editingProduct.descripcion,
        imagen: editingProduct.imagen
      };
      
      updateProduct(editingProduct.categoria, updatedProduct);
      markLastUpdated();
      showNotification('Producto actualizado correctamente');
    }
    setEditingProduct(null);
  };

  const handleDelete = (categoria, id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteProduct(categoria, id);
      markLastUpdated();
      showNotification('Producto eliminado correctamente', 'warning');
    }
  };

  const handleAddNew = () => {
    const newId = getNextId();
    setEditingProduct({
      categoria: activeCategory,
      id: newId,
      titulo: '',
      precio: '',
      descripcion: '',
      imagen: ''
    });
  };

  const handleAddNewProduct = () => {
    if (editingProduct && editingProduct.titulo && editingProduct.precio) {
      const newProduct = {
        id: editingProduct.id,
        titulo: editingProduct.titulo,
        precio: editingProduct.precio,
        descripcion: editingProduct.descripcion,
        imagen: editingProduct.imagen || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop'
      };
      
      addProduct(editingProduct.categoria, newProduct);
      markLastUpdated();
      setEditingProduct(null);
      showNotification('Producto agregado correctamente');
    } else {
      showNotification('Por favor completa al menos el título y el precio', 'error');
    }
  };

  const handleExportData = () => {
    const data = exportProducts();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laflecha-productos-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Backup exportado correctamente');
  };

  const handleImportData = () => {
    if (importData.trim()) {
      const success = importProducts(importData);
      if (success) {
        setImportData('');
        setShowBackupModal(false);
        markLastUpdated();
        showNotification('Datos importados correctamente');
      } else {
        showNotification('Error: Formato de datos inválido', 'error');
      }
    } else {
      showNotification('Por favor pega los datos JSON para importar', 'error');
    }
  };

  const handleResetData = () => {
    if (confirm('¿Estás seguro de que quieres restaurar todos los productos a los valores iniciales? Esta acción no se puede deshacer.')) {
      resetProducts();
      markLastUpdated();
      showNotification('Productos restaurados a valores iniciales', 'warning');
    }
  };

  const handleClearLocalStorage = () => {
    if (confirm('¿Estás seguro de que quieres limpiar completamente el almacenamiento local? Esto restaurará los datos iniciales.')) {
      clearLocalStorage();
      showNotification('Almacenamiento local limpiado', 'warning');
    }
  };

  const filteredProducts = productos[activeCategory]?.filter(producto =>
    producto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const categories = [
    { key: 'anillos', name: 'Anillos' },
    { key: 'collares', name: 'Collares' },
    { key: 'aretes', name: 'Aretes' },
    { key: 'pulseras', name: 'Pulseras' }
  ];

  // Componente de notificación
  const Notification = ({ notification }) => {
    if (!notification) return null;

    const bgColor = notification.type === 'success' ? 'bg-green-500' : 
                   notification.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500';

    return (
      <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`}>
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{notification.message}</span>
        </div>
      </div>
    );
  };

  // Componente de estadísticas
  const StatsModal = () => {
    const stats = getStats();
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Estadísticas del Sistema</h2>
              <button
                onClick={() => setShowStatsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total de Productos</p>
                    <p className="text-3xl font-bold text-blue-800">{stats.totalProducts}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Categorías Activas</p>
                    <p className="text-3xl font-bold text-green-800">{categories.length}</p>
                  </div>
                  <Database className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Productos por Categoría</h3>
              <div className="space-y-3">
                {stats.categoriesCount.map(({ category, count }) => {
                  const categoryName = categories.find(cat => cat.key === category)?.name || category;
                  const percentage = (count / stats.totalProducts) * 100;
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">{categoryName}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-600 text-sm w-12 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Última actualización:</span>{' '}
                {stats.lastUpdated !== 'Nunca' ? new Date(stats.lastUpdated).toLocaleString('es-ES') : 'Nunca'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Pantalla de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  // Pantalla de login
  if (!showAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">LF</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel de Admin</h1>
            <p className="text-gray-600">La Flecha Joyería</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña de Administrador
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Ingresa la contraseña"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Acceder al Panel
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Contraseña de prueba: <code className="bg-gray-100 px-2 py-1 rounded">admin123</code></p>
          </div>
        </div>

        <Notification notification={notification} />
      </div>
    );
  }

  // Panel de administración
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Admin */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12  flex items-center justify-center">
                <img src="/Logolaflecha.svg" alt="logo la flecha" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
                <p className="text-gray-600">La Flecha Joyería</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowStatsModal(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Estadísticas</span>
              </button>
              <button
                onClick={() => setShowBackupModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Backup</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controles principales */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Categorías */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    activeCategory === category.key
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({productos[category.key]?.length || 0})
                </button>
              ))}
            </div>

            {/* Controles de vista y acciones */}
            <div className="flex space-x-4">
              {/* Selector de vista */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-md transition-colors duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Lista
                </button>
              </div>

              {/* Buscador */}
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 w-64"
                />
              </div>

              {/* Botón agregar */}
              <button
                onClick={handleAddNew}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lista de productos */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((producto) => (
              <div key={producto.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                <div className="relative h-48">
                  <img
                    src={producto.imagen}
                    alt={producto.titulo}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop';
                    }}
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(activeCategory, producto)}
                      className="bg-blue-500 hover:bg-blue-600 text-black p-2 rounded-full transition-colors duration-200"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(activeCategory, producto.id)}
                      className="bg-red-500 hover:bg-red-600 text-black p-2 rounded-full transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{producto.titulo}</h3>
                    <span className="text-xl font-bold text-amber-600 ml-2">{producto.precio}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">{producto.descripcion}</p>
                  <div className="mt-3 text-xs text-gray-400">
                    ID: {producto.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((producto) => (
                    <tr key={producto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{producto.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={producto.imagen}
                          alt={producto.titulo}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop';
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{producto.titulo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-amber-600">{producto.precio}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">{producto.descripcion}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(activeCategory, producto)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(activeCategory, producto.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">No se encontraron productos</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Agrega algunos productos para comenzar'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingProduct.titulo ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                </h2>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                  <input
                    type="text"
                    value={editingProduct.titulo}
                    onChange={(e) => setEditingProduct({...editingProduct, titulo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Nombre del producto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio *</label>
                  <input
                    type="text"
                    value={editingProduct.precio}
                    onChange={(e) => setEditingProduct({...editingProduct, precio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Ej: $1,500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={editingProduct.descripcion}
                    onChange={(e) => setEditingProduct({...editingProduct, descripcion: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Descripción detallada del producto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL de la Imagen</label>
                  <input
                    type="url"
                    value={editingProduct.imagen}
                    onChange={(e) => setEditingProduct({...editingProduct, imagen: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {editingProduct.imagen && (
                    <div className="mt-2">
                      <img
                        src={editingProduct.imagen}
                        alt="Vista previa"
                        className="w-32 h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Categoría:</span> {categories.find(cat => cat.key === editingProduct.categoria)?.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">ID:</span> {editingProduct.id}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={editingProduct.titulo && !editingProduct.id ? handleAddNewProduct : handleSave}
                  disabled={!editingProduct.titulo || !editingProduct.precio}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-lg transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct.titulo && editingProduct.id ? 'Guardar Cambios' : 'Agregar Producto'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Backup */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Datos</h2>
                <button
                  onClick={() => setShowBackupModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Exportar datos */}
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Exportar Datos</h3>
                  <p className="text-green-700 mb-4 text-sm">
                    Descarga una copia de seguridad de todos los productos en formato JSON.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Backup</span>
                  </button>
                </div>

                {/* Importar datos */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Importar Datos</h3>
                  <p className="text-blue-700 mb-4 text-sm">
                    Restaura los productos desde un archivo de respaldo JSON. Esto reemplazará todos los datos actuales.
                  </p>
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                    placeholder="Pega aquí el contenido JSON del archivo de respaldo..."
                  />
                  <button
                    onClick={handleImportData}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Importar Datos</span>
                  </button>
                </div>

                {/* Restaurar datos iniciales */}
                <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">Restaurar Datos Iniciales</h3>
                  <p className="text-yellow-700 mb-4 text-sm">
                    Restaura todos los productos a los valores iniciales del sistema. Esta acción no se puede deshacer.
                  </p>
                  <button
                    onClick={handleResetData}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restaurar Iniciales</span>
                  </button>
                </div>

                {/* Limpiar almacenamiento */}
                <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">Limpiar Almacenamiento</h3>
                  <p className="text-red-700 mb-4 text-sm">
                    Elimina completamente todos los datos almacenados y restaura los valores iniciales. Usar solo para solucionar problemas.
                  </p>
                  <button
                    onClick={handleClearLocalStorage}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Limpiar Todo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de estadísticas */}
      {showStatsModal && <StatsModal />}

      {/* Notificaciones */}
      <Notification notification={notification} />
    </div>
  );
};

export default Admin;