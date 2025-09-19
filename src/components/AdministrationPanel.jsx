// AdministrationPanel.jsx - ACTUALIZADO con Productos Terminados y Disponibles
import React, { useState, useEffect } from 'react';

import { Edit3, Save, X, Upload, Eye, EyeOff, Plus, Trash2, Search, Download, RotateCcw, AlertCircle, BarChart3, Database, RefreshCw, Mail, Lock, LogOut } from 'lucide-react';

import { useProducts } from './ProductContext';
import { loginAdmin, logoutAdmin, useAuthState, isAdminUser } from '../../auth';

const formatPrice = (p) => {
  const n = Number(p);
  if (!Number.isFinite(n)) return p ? String(p) : '';
  return n.toLocaleString('es-CO'); // fuerza puntos como separador de miles
};


const AdministrationPanel = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('anillos');
  const [productType, setProductType] = useState('terminados'); // 'terminados' o 'disponibles'
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [importData, setImportData] = useState('');
  const [notification, setNotification] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  // Estado de autenticación
  const { user, loading: authLoading } = useAuthState();

  // Usar el contexto de productos
  const {
    productos,
    productosDisponibles,
    isLoading,
    updateProduct,
    deleteProduct,
    addProduct,
    updateProductoDisponible,
    deleteProductoDisponible,
    addProductoDisponible,
    getNextId,
    resetProducts,
    exportProducts,
    importProducts,
    clearLocalStorage,
    getStats,
    markLastUpdated
  } = useProducts();

  // Verificar si el usuario es admin
  useEffect(() => {
    if (user && isAdminUser(user)) {
      setShowAdmin(true);
      showNotification(`Bienvenido ${user.email}`);
    } else if (user && !isAdminUser(user)) {
      showNotification('No tienes permisos de administrador', 'error');
      handleLogout();
    } else {
      setShowAdmin(false);
    }
  }, [user]);

  //mostrar notificaciones
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!email || !password) {
      setLoginError('Por favor completa todos los campos');
      return;
    }

    const result = await loginAdmin(email, password);

    if (result.success) {
      if (isAdminUser(result.user)) {
        setEmail('');
        setPassword('');
        // El useEffect se encargará de mostrar el admin
      } else {
        setLoginError('No tienes permisos de administrador');
        await logoutAdmin();
      }
    } else {
      setLoginError('Credenciales incorrectas');
    }
  };

  const handleLogout = async () => {
    const result = await logoutAdmin();
    if (result.success) {
      setShowAdmin(false);
      setEditingProduct(null);
      setEmail('');
      setPassword('');
      showNotification('Sesión cerrada');
    }
  };

 const handleEdit = (categoria, producto) => {
  // Procesar imágenes para edición
  let imagenesArray = [];
  
  if (producto.imagenes && Array.isArray(producto.imagenes)) {
    imagenesArray = producto.imagenes.filter(img => img && img.trim());
  } else if (producto.imagen && producto.imagen.trim()) {
    imagenesArray = [producto.imagen.trim()];
  }

  setEditingProduct({ 
    categoria, 
    tipo: productType, 
    ...producto,
    imagenes: imagenesArray,
    newImageUrl: ''
  });
};

  const handleSave = async () => {
  if (editingProduct) {
    try {
      // Asegurar que tenemos un array de imágenes válido
      let imagenesArray = [];
      
      if (editingProduct.imagenes && Array.isArray(editingProduct.imagenes)) {
        imagenesArray = editingProduct.imagenes.filter(img => img && img.trim());
      } else if (editingProduct.imagen && editingProduct.imagen.trim()) {
        imagenesArray = [editingProduct.imagen.trim()];
      }

      // Si no hay imágenes en el array pero sí imagen principal, agregarla
      if (imagenesArray.length === 0 && editingProduct.imagen && editingProduct.imagen.trim()) {
        imagenesArray = [editingProduct.imagen.trim()];
      }

      // Asegurar que la primera imagen del array sea la imagen principal
      const imagenPrincipal = imagenesArray[0] || editingProduct.imagen || '';

      const updatedProduct = {
        id: editingProduct.id,
        titulo: editingProduct.titulo,
        precio: editingProduct.precio,
        descripcion: editingProduct.descripcion,
        imagen: imagenPrincipal, // Imagen principal
        imagenes: imagenesArray, // Array de todas las imágenes
        material: editingProduct.material || "",
        peso: editingProduct.peso || "", 
        tamano: editingProduct.tamano || "",
      };

      console.log('Producto final a guardar:', updatedProduct);

      if (editingProduct.tipo === 'terminados') {
        await updateProduct(editingProduct.categoria, updatedProduct);
      } else {
        await updateProductoDisponible(editingProduct.categoria, updatedProduct);
      }

      await markLastUpdated();
      showNotification('Producto actualizado correctamente');
      setEditingProduct(null);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      showNotification('Error al actualizar el producto', 'error');
    }
  }
};

  const handleDelete = async (categoria, id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        if (productType === 'terminados') {
          await deleteProduct(categoria, id);
        } else {
          await deleteProductoDisponible(categoria, id);
        }

        await markLastUpdated();
        showNotification('Producto eliminado correctamente', 'warning');
      } catch (error) {
        showNotification('Error al eliminar el producto', 'error');
      }
    }
  };

  const handleAddNew = () => {
  const currentProductsForType = productType === 'terminados' ? productos : productosDisponibles;
  
  let maxId = 0;
  Object.values(currentProductsForType).forEach(categoria => {
    if (categoria && Array.isArray(categoria)) {
      categoria.forEach(producto => {
        if (producto.id > maxId) {
          maxId = producto.id;
        }
      });
    }
  });
  
  const newId = maxId + 1;
  
  setEditingProduct({
    categoria: activeCategory,
    tipo: productType,
    id: newId,
    titulo: '',
    precio: '',
    descripcion: '',
    imagen: '',
    imagenes: [], // Inicializar como array vacío
    material: '',
    peso: '',
    tamano: '',
    newImageUrl: '' // Inicializar campo para nueva URL
  });
};

  const handleAddNewProduct = async () => {
  if (editingProduct && editingProduct.titulo && editingProduct.precio) {
    try {
      // Verificar que el ID no exista ya
      const currentProductsForType = editingProduct.tipo === 'terminados' ? productos : productosDisponibles;
      const existingIds = [];
      
      Object.values(currentProductsForType).forEach(categoria => {
        if (categoria && Array.isArray(categoria)) {
          categoria.forEach(producto => {
            existingIds.push(producto.id);
          });
        }
      });
      
      // Si el ID ya existe, generar uno nuevo
      let finalId = editingProduct.id;
      while (existingIds.includes(finalId)) {
        finalId++;
      }

      // Procesar imágenes de la misma manera
      let imagenesArray = [];
      
      if (editingProduct.imagenes && Array.isArray(editingProduct.imagenes)) {
        imagenesArray = editingProduct.imagenes.filter(img => img && img.trim());
      } else if (editingProduct.imagen && editingProduct.imagen.trim()) {
        imagenesArray = [editingProduct.imagen.trim()];
      }

      // Si no hay imágenes en el array pero sí imagen principal, agregarla
      if (imagenesArray.length === 0 && editingProduct.imagen && editingProduct.imagen.trim()) {
        imagenesArray = [editingProduct.imagen.trim()];
      }

      // Asegurar que la primera imagen del array sea la imagen principal
      const imagenPrincipal = imagenesArray[0] || editingProduct.imagen || '';
       
      const newProduct = {
        id: finalId,
        titulo: editingProduct.titulo.trim(),
        precio: editingProduct.precio.toString(),
        descripcion: editingProduct.descripcion.trim(),
        imagen: imagenPrincipal, // Imagen principal
        imagenes: imagenesArray, // Array de todas las imágenes
        material: editingProduct.material?.trim() || "",
        peso: editingProduct.peso?.trim() || "", 
        tamano: editingProduct.tamano?.trim() || "",
      };

      console.log('Nuevo producto a crear:', newProduct);

      if (editingProduct.tipo === 'terminados') {
        await addProduct(editingProduct.categoria, newProduct);
      } else {
        await addProductoDisponible(editingProduct.categoria, newProduct);
      }

      await markLastUpdated();
      setEditingProduct(null);
      showNotification(`Producto agregado correctamente con ID: ${finalId}`);
    } catch (error) {
      console.error('Error al agregar producto:', error);
      showNotification('Error al agregar el producto', 'error');
    }
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

  const handleImportData = async () => {
    if (importData.trim()) {
      try {
        const success = await importProducts(importData);
        if (success) {
          setImportData('');
          setShowBackupModal(false);
          await markLastUpdated();
          showNotification('Datos importados correctamente');
        } else {
          showNotification('Error: Formato de datos inválido', 'error');
        }
      } catch (error) {
        showNotification('Error al importar los datos', 'error');
      }
    } else {
      showNotification('Por favor pega los datos JSON para importar', 'error');
    }
  };

  const handleResetData = async () => {
    if (confirm('¿Estás seguro de que quieres restaurar todos los productos a los valores iniciales? Esta acción no se puede deshacer.')) {
      try {
        await resetProducts();
        await markLastUpdated();
        showNotification('Productos restaurados a valores iniciales', 'warning');
      } catch (error) {
        showNotification('Error al restaurar los productos', 'error');
      }
    }
  };

  const handleClearLocalStorage = async () => {
    if (confirm('¿Estás seguro de que quieres limpiar completamente el almacenamiento? Esto restaurará los datos iniciales.')) {
      try {
        await clearLocalStorage();
        showNotification('Datos limpiados correctamente', 'warning');
      } catch (error) {
        showNotification('Error al limpiar los datos', 'error');
      }
    }
  };

  // Obtener productos según el tipo seleccionado
  const currentProducts = productType === 'terminados' ? productos : productosDisponibles;

  const filteredProducts = currentProducts[activeCategory]?.filter(producto =>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Productos Terminados</p>
                    <p className="text-3xl font-bold text-blue-800">{stats.totalProducts}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Productos Disponibles</p>
                    <p className="text-3xl font-bold text-purple-800">
                      {Object.values(productosDisponibles).reduce((total, cat) => total + (cat?.length || 0), 0)}
                    </p>
                  </div>
                  <Database className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Productos Terminados por Categoría</h3>
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
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Productos Disponibles por Categoría</h3>
                <div className="space-y-3">
                  {categories.map((category) => {
                    const count = productosDisponibles[category.key]?.length || 0;
                    const totalDisponibles = Object.values(productosDisponibles).reduce((total, cat) => total + (cat?.length || 0), 0);
                    const percentage = totalDisponibles > 0 ? (count / totalDisponibles) * 100 : 0;

                    return (
                      <div key={category.key} className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">{category.name}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
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
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Usuario:</span> {user?.email}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Última actualización:</span>{' '}
                {stats.lastUpdated !== 'Nunca' ? new Date(stats.lastUpdated).toLocaleString('es-ES') : 'Nunca'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Pantalla de carga para autenticación
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>{authLoading ? 'Verificando autenticación...' : 'Cargando panel de administración...'}</p>
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

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email del Administrador
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="admin@laflecha.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Sistema de autenticación segura con Firebase
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
                <p className="text-gray-600">La Flecha Joyería - {user?.email}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowStatsModal(true)}
                className="bg-purple-500 hover:bg-purple-600 text-gray-400 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Estadísticas</span>
              </button>
              <button
                onClick={() => setShowBackupModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-gray-400 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Backup</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-red-500 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controles principales */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col space-y-4">
            {/* Selector de tipo de productos */}
            <div className="flex justify-center">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setProductType('terminados')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${productType === 'terminados'
                      ? 'text-gray-400 text-gray-400 shadow-md'
                      : 'text-gray-400 hover:text-gray-800'
                    }`}
                >
                  Productos Terminados
                </button>
                <button
                  onClick={() => setProductType('disponibles')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${productType === 'disponibles'
                      ? 'text-gray-400 text-gray-400 shadow-md'
                      : 'text-gray-400 hover:text-gray-800'
                    }`}
                >
                  Productos Disponibles
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Categorías */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeCategory === category.key
                        ? (productType === 'terminados' ? 'bg-blue-500' : 'bg-purple-500') + ' text-gray-400'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                  >
                    {category.name} ({currentProducts[category.key]?.length || 0})
                  </button>
                ))}
              </div>

              {/* Controles de vista y acciones */}
              <div className="flex space-x-4">
                {/* Selector de vista */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded-md transition-colors duration-200 ${viewMode === 'grid'
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded-md transition-colors duration-200 ${viewMode === 'list'
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
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 w-64 text-gray-400"
                  />
                </div>

                {/* Botón agregar */}
                <button
                  onClick={handleAddNew}
                  className="bg-green-500 hover:bg-green-600 text-gray-400 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar</span>
                </button>
              </div>
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
                      e.target.src = '';
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
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${productType === 'terminados' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                      }`}>
                      {productType === 'terminados' ? 'Terminado' : 'Disponible'}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{producto.titulo}</h3>
                    <span className="text-xl font-bold text-amber-600 ml-2">${formatPrice(producto.precio)}</span>

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
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
                    <tr key={// Continuación del código que faltaba - AGREGAR después de la línea: {filteredProducts.map((producto) => (
                      //                     <tr key={

                      producto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${productType === 'terminados' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                          {productType === 'terminados' ? 'Terminado' : 'Disponible'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {producto.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={producto.imagen}
                          alt={producto.titulo}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.src = '';
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {producto.titulo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-amber-600">
  ${formatPrice(producto.precio)}
</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs line-clamp-2">
                          {producto.descripcion}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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

        {/* Mensaje cuando no hay productos */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Database className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay productos {productType === 'terminados' ? 'terminados' : 'disponibles'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ?
                `No se encontraron productos que coincidan con "${searchTerm}"` :
                `No hay productos ${productType === 'terminados' ? 'terminados' : 'disponibles'} en la categoría ${categories.find(cat => cat.key === activeCategory)?.name}`
              }
            </p>
            <button
              onClick={handleAddNew}
              className="bg-green-500 hover:bg-green-600 text-gray-400 px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar primer producto</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal de edición/agregar producto */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingProduct.titulo ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Producto
                    </label>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, tipo: 'terminados' })}
                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${editingProduct.tipo === 'terminados'
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                          }`}
                      >
                        Terminado
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, tipo: 'disponibles' })}
                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${editingProduct.tipo === 'disponibles'
                            ? 'bg-purple-500 text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                          }`}
                      >
                        Disponible
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
  ID del Producto
</label>
<input
  type="number"
  value={editingProduct.id}
  readOnly={!!editingProduct.titulo}
  onChange={(e) => {
    if (!editingProduct.titulo) {
      setEditingProduct({ ...editingProduct, id: parseInt(e.target.value) || 1 });
    }
  }}
  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 ${
    !!editingProduct.titulo ? 'bg-gray-100 cursor-not-allowed' : ''
  }`}
  min="1"
/>
{!!editingProduct.titulo && (
  <p className="text-xs text-gray-500 mt-1">
    El ID no se puede modificar en productos existentes
  </p>
)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={editingProduct.titulo}
                    onChange={(e) => setEditingProduct({ ...editingProduct, titulo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Nombre del producto"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio *
                  </label>
                  <input
                    type="text"
                    value={editingProduct.precio}
                    onChange={(e) => setEditingProduct({ ...editingProduct, precio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="$0,000"
                    required
                  />
                </div>

                <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Imágenes del Producto
  </label>
  
  {/* Campo para agregar nueva imagen */}
  <div className="flex space-x-2 mb-3">
    <input
      type="url"
      value={editingProduct.newImageUrl || ''}
      onChange={(e) => setEditingProduct({ ...editingProduct, newImageUrl: e.target.value })}
      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
      placeholder="https://ejemplo.com/imagen.jpg"
    />
    <button
      type="button"
      onClick={() => {
  if (editingProduct.newImageUrl && editingProduct.newImageUrl.trim()) {
    const currentImages = editingProduct.imagenes || [];
    // Filtrar imágenes vacías y agregar la nueva
    const validImages = currentImages.filter(img => img && img.trim());
    const newImages = [...validImages, editingProduct.newImageUrl.trim()];
    
    setEditingProduct({ 
      ...editingProduct, 
      imagenes: newImages,
      imagen: newImages[0], // Primera imagen como principal
      newImageUrl: '' 
    });
  }
}}
      className="bg-green-500 hover:bg-green-600 text-amber-600 px-4 py-2 rounded-lg transition-colors duration-200"
    >
      <Plus className="w-4 h-4" />
    </button>
  </div>

  {/* Lista de imágenes actuales */}
  <div className="space-y-2">
    {(editingProduct.imagenes || [editingProduct.imagen].filter(Boolean)).map((imageUrl, index) => (
      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <img
          src={imageUrl}
          alt={`Vista ${index + 1}`}
          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
          onError={(e) => {
            e.target.src = '';
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 truncate">{imageUrl}</p>
          <p className="text-xs text-gray-400">
            {index === 0 ? 'Imagen principal' : `Imagen ${index + 1}`}
          </p>
        </div>
        <div className="flex space-x-1">
          {index > 0 && (
            <button
              type="button"
              onClick={() => {
                const newImages = [...(editingProduct.imagenes || [])];
                [newImages[0], newImages[index]] = [newImages[index], newImages[0]];
                setEditingProduct({ 
                  ...editingProduct, 
                  imagenes: newImages,
                  imagen: newImages[0]
                });
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
              title="Hacer principal"
            >
              Principal
            </button>
          )}
          {(editingProduct.imagenes || []).length > 1 && (
            <button
              type="button"
              onClick={() => {
                const newImages = (editingProduct.imagenes || []).filter((_, i) => i !== index);
                setEditingProduct({ 
                  ...editingProduct, 
                  imagenes: newImages,
                  imagen: newImages[0] || ''
                });
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
              title="Eliminar imagen"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    ))}
  </div>

  {(editingProduct.imagenes || [editingProduct.imagen].filter(Boolean)).length === 0 && (
    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-500 text-sm">No hay imágenes agregadas</p>
    </div>
  )}
</div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={editingProduct.descripcion}
                    onChange={(e) => setEditingProduct({ ...editingProduct, descripcion: e.target.value })}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Descripción del producto..."
                  />
                </div>
                <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
  <input
    type="text"
    value={editingProduct.material || ""}
    onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Peso</label>
  <input
    type="text"
    value={editingProduct.peso || ""}
    onChange={(e) => setEditingProduct({ ...editingProduct, peso: e.target.value })}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño</label>
  <input
    type="text"
    value={editingProduct.tamano || ""}
    onChange={(e) => setEditingProduct({ ...editingProduct, tamano: e.target.value })}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
  />
</div>

              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-gray-400 px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>Cancelar</span>
                </button>
                <button
                  onClick={editingProduct.titulo ? handleSave : handleAddNewProduct}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-gray-400 px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingProduct.titulo ? 'Guardar Cambios' : 'Crear Producto'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Backup */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Exportar datos */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Exportar Datos</h3>
                  <p className="text-blue-600 mb-4">Descarga una copia de seguridad de todos los productos en formato JSON.</p>
                  <button
                    onClick={handleExportData}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-gray-400 px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Descargar Backup</span>
                  </button>
                </div>

                {/* Importar datos */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">Importar Datos</h3>
                  <p className="text-green-600 mb-4">Restaura los productos desde un archivo de respaldo JSON.</p>
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="Pega aquí el contenido JSON del backup..."
                    rows="6"
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-4"
                  />
                  <button
                    onClick={handleImportData}
                    className="w-full bg-green-500 hover:bg-green-600 text-gray-400 px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Importar Datos</span>
                  </button>
                </div>

                {/* Restaurar datos iniciales */}
                <div className="bg-yellow-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-4">Restaurar Datos Iniciales</h3>
                  <p className="text-yellow-600 mb-4">Restaura todos los productos a los valores predeterminados del sistema.</p>
                  <button
                    onClick={handleResetData}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-400 px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Restaurar Datos</span>
                  </button>
                </div>

                {/* Limpiar almacenamiento */}
                <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-4">Limpiar Almacenamiento</h3>
                  <p className="text-red-600 mb-4">Elimina completamente todos los datos almacenados y restaura los valores iniciales.</p>
                  <button
                    onClick={handleClearLocalStorage}
                    className="w-full bg-red-500 hover:bg-red-600 text-gray-400 px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-5 h-5" />
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

      {/* Notificación */}
      <Notification notification={notification} />
    </div>
  );
};

export default AdministrationPanel;