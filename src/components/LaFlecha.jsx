import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Shield, Award, Menu, X, RefreshCw, Grid3X3, List, Truck } from 'lucide-react';
import "tailwindcss";
import { Link } from 'react-router-dom';
import { useProducts } from './ProductContext';


import '../../src/App.css'
import { React } from 'react';

const formatPrice = (p) => {
  const n = Number(p);
  if (!Number.isFinite(n)) return p ? String(p) : '';
  return n.toLocaleString('es-CO'); // fuerza puntos como separador de miles
};


const LaFlecha = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlides, setCurrentSlides] = useState({
    anillos: 0,
    collares: 0,
    aretes: 0,
    pulseras: 0
  });
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Nuevos estados para las funcionalidades
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'
  const [activeTab, setActiveTab] = useState('terminados'); // 'terminados' o 'disponibles'

  // Usar el contexto de productos

  const { productos, productosDisponibles } = useProducts();

  // Efecto para manejar la animación del splash screen
  useEffect(() => {
    // Mostrar splash un tiempo corto mientras carga (ajusta ms si quieres)
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200); // 1.2 segundos

    return () => clearTimeout(timer);
  }, []);

  // Efecto para escuchar cambios en los productos (funcionalidad del admin)
  useEffect(() => {
    const handleProductUpdate = () => {
      setLastUpdate(Date.now());
      // Resetear slides si los productos cambiaron
      setCurrentSlides(prev => {
        const newSlides = {};
        Object.keys(prev).forEach(categoria => {
          const productCount = productos[categoria]?.length || 0;
          newSlides[categoria] = Math.min(prev[categoria], Math.max(0, productCount - 1));
        });
        return newSlides;
      });
    };

    // Escuchar eventos de actualización de productos
    window.addEventListener('productsUpdated', handleProductUpdate);
    window.addEventListener('storage', handleProductUpdate);

    return () => {
      window.removeEventListener('productsUpdated', handleProductUpdate);
      window.removeEventListener('storage', handleProductUpdate);
    };
  }, [productos]);

  // Nuevo SplashScreen: imagen del logo + un anillo giratorio alrededor que indica carga
  const SplashScreen = () => (
    <div className="fixed inset-0 bg-white flex flex-col justify-center items-center font-sans overflow-hidden z-50">
      <div className="flex flex-col items-center">
        {/* Container principal del logo y círculo */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">

          {/* Logo centrado - SIEMPRE en el centro */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <img
              src="/Logolaflecha.svg"
              alt="Logo La Flecha"
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
          </div>

          {/* Círculo de carga giratorio principal */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: 'spin 1.5s linear infinite' }}
          >
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                borderWidth: '4px',
                borderStyle: 'solid',
                borderTopColor: '#f59e0b', // amber-500
                borderRightColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: 'transparent'
              }}
            />
          </div>

          {/* Círculo exterior adicional */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: 'spin 2s linear infinite reverse' }}
          >
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderTopColor: '#fbbf24', // amber-400
                borderRightColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: 'transparent'
              }}
            />
          </div>
        </div>

        <p className="mt-6 text-gray-600 text-sm animate-pulse">Cargando...</p>
      </div>

      {/* CSS para la animación */}
      <style jsx>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
    </div>
  );

  const nextSlide = (categoria) => {
    setCurrentSlides(prev => ({
      ...prev,
      [categoria]: (prev[categoria] + 1) % (productos[categoria]?.length || 1)
    }));
  };

  const prevSlide = (categoria) => {
    setCurrentSlides(prev => ({
      ...prev,
      [categoria]: prev[categoria] === 0 ?
        (productos[categoria]?.length || 1) - 1 :
        prev[categoria] - 1
    }));
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const ProductModal = () => {
    if (!isModalOpen || !selectedProduct) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="relative">
            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-400 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Imagen del producto */}
            <div className="h-80 bg-gray-50 overflow-hidden rounded-t-2xl flex items-center justify-center p-6">
              <img
                src={selectedProduct.imagen}
                alt={selectedProduct.titulo}
                className="max-w-[400px] max-h-[300px] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop';
                }}
              />
            </div>

            {/* Contenido del modal */}
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{selectedProduct.titulo}</h2>
                <span className="text-3xl font-bold text-amber-600">{selectedProduct.precio}</span>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedProduct.descripcion}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Características</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <Star className="w-4 h-4 text-amber-500 mr-2" />
                        Oro 18k
                      </li>
                      <li className="flex items-center">
                        <Shield className="w-4 h-4 text-amber-500 mr-2" />
                        Garantía de por vida
                      </li>
                      <li className="flex items-center">
                        <Award className="w-4 h-4 text-amber-500 mr-2" />
                        Diseño exclusivo
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Detalles</h3>
                    <div className="space-y-2 text-gray-600">
                      <p><span className="font-medium">Disponibilidad:</span> Entrega inmediata</p>
                      <p><span className="font-medium">Envío:</span> A nivel nacional</p>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t ">
                  <a
                    href={`https://wa.me/573007269024?text=Hola,%20me%20interesa%20el%20producto:%20${encodeURIComponent(selectedProduct.titulo)}%20-%20${encodeURIComponent(selectedProduct.precio)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 "
                  >
                    <button className="w-full bg-gray-400 hover:bg-green-600 text-gray-400 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.085" />
                      </svg>
                      Contactar por WhatsApp
                    </button>
                  </a>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-400 hover:bg-gray-300 text-gray-400 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    Cerrar
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Carousel = ({ categoria, titulo }) => {
    const currentIndex = currentSlides[categoria];
    const items = activeTab === 'terminados'
      ? productos[categoria]
      : productosDisponibles[categoria];

    // Si no hay productos en esta categoría, mostrar mensaje
    if (!items || items.length === 0) {
      return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <div className="h-80 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-gray-400 mb-4">
              <RefreshCw className="w-16 h-16 animate-pulse" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No hay productos disponibles</p>
            <p className="text-gray-400 text-sm mt-2">en {titulo.toLowerCase()}</p>
            <div className="mt-4 px-4 py-2 bg-amber-100 rounded-lg">
              <p className="text-amber-700 text-xs text-center">
                Los productos aparecerán aquí automáticamente cuando se agreguen
              </p>
            </div>
          </div>
        </div>
      );
    }

    // ✅ Solo llegas aquí si hay productos
    const currentItem = items[currentIndex];
    if (!currentItem) return null;



    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <div className="relative">
          <div className="h-64 overflow-hidden rounded-t-2xl flex items-center justify-center bg-gray-100"> {/* Línea modificada */}
            <img
              src={currentItem.imagen}
              alt={currentItem.titulo}
              className="w-auto h-60 max-w-full object-contain transition-transform duration-500 hover:scale-110"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop';
              }}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          {/* Botones de navegación solo si hay más de un producto */}
          {items.length > 1 && (
            <>
              <button
                onClick={() => prevSlide(categoria)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-grey-black p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => nextSlide(categoria)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-grey-black p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="absolute top-4 left-4">
            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {titulo}
            </span>
          </div>

          {/* Indicador de actualización reciente (funcionalidad del admin de Versión 2) */}
          {Date.now() - lastUpdate < 5000 && (
            <div className="absolute top-4 right-4">
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1 animate-pulse">
                <RefreshCw className="w-3 h-3" />
                <span>Actualizado</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-800">{currentItem.titulo}</h3>
            <span className="text-2xl font-bold text-amber-600">${formatPrice(currentItem.precio)}</span>

          </div>
          <p className="text-gray-600 leading-relaxed mb-4">{currentItem.descripcion}</p>

          <div className="flex justify-between items-center">
            {/* Indicadores de paginación solo si hay más de un producto */}
            {items.length > 1 && (
              <div className="flex space-x-1">
                {items.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex ? 'bg-amber-400' : 'bg-gray-400'
                      }`}
                  />
                ))}
              </div>
            )}
            <button
              onClick={() => openModal(currentItem)}
              className="bg-amber-600 hover:bg-amber-400 text-grey-400 px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105 font-medium"
            >
              Ver Detalles
            </button>
          </div>

          {/* Información adicional del producto (de Versión 2) */}
          <div className="mt-3 text-xs text-gray-400 border-t pt-3">
            {/* <span>ID: {currentItem.id}</span> */}
            {items.length > 1 && (
              <span className="ml-4">{currentIndex + 1} de {items.length}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Nuevo componente para vista de lista
  const ListView = ({ categoria, titulo }) => {
    const items = activeTab === 'terminados'
      ? productos[categoria]
      : productosDisponibles[categoria];

    if (!items || items.length === 0) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{titulo}</h3>
          <div className="text-center py-8">
            <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-3 animate-pulse" />
            <p className="text-gray-500">No hay productos disponibles en {titulo.toLowerCase()}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-amber-50 px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">{titulo}</h3>
          <p className="text-sm text-gray-600">{items.length} producto{items.length !== 1 ? 's' : ''} disponible{items.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="divide-y divide-gray-100">
          {items.map((item, index) => (
            <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex gap-4">
                <img
                  src={item.imagen}
                  alt={item.titulo}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-gray-800 truncate">{item.titulo}</h4>
                    <span className="text-xl font-bold text-amber-600 ml-4">{item.precio}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{item.descripcion}</p>
                  <button
                    onClick={() => openModal(item)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Si el splash está activo, mostrar solo el splash screen
  if (showSplash) {
    return <SplashScreen />;
  }

  // Una vez que el splash termine, mostrar el contenido principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <section className="py-20 text-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Elegancia que
            <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent"> Perdura</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Descubre nuestra colección de joyas únicas, donde cada pieza cuenta una historia de amor,
            elegancia y sofisticación. echa con los mejores materiales del mundo.
          </p>
          <a
            href="https://wa.me/573007269024?text=Hola,%20me%20interesa%20obtener%20más%20información"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="group relative bg-white hover:bg-green-600 text-gray-400 hover:text-gray-400 px-6 py-3 rounded-full text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3">

              {/* Efecto de onda al hover */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300"></div>

              {/* Icono de WhatsApp mejorado */}
              <div className="relative z-10">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-sm"
                >
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.085"
                    fill="currentColor"
                  />
                </svg>
              </div>

              {/* Texto del botón */}
              <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                Chatear por WhatsApp
              </span>

              {/* Indicador de pulso */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-300 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
            </button>
          </a>
        </div>
      </section>

      <section className="py-16 bg-white">
  <div className="max-w-6xl mx-auto px-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

      <div className="text-center group">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
          <Award className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Calidad Premium</h3>
        <p className="text-gray-600">Materiales de la más alta calidad</p>
      </div>

      <div className="text-center group">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
          <Shield className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Garantía de por vida</h3>
        <p className="text-gray-600">Protección completa en tus joyas</p>
      </div>

      <div className="text-center group">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
          <Truck className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Envíos Nacionales</h3>
        <p className="text-gray-600">Envios en todo el país</p>
      </div>

      <div className="text-center group">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
          <Star className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Diseño Exclusivo</h3>
        <p className="text-gray-600">Piezas únicas y personalizadas</p>
      </div>
    </div>
  </div>
</section>

      {/* Productos */}
      <section id="productos" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Nuestra <span className="text-amber-600">Colección</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cada pieza es cuidadosamente seleccionada y hecha para ofrecerte lo mejor en joyería de lujo
            </p>
          </div>

          {/* Pestañas y Toggle de Vista */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            {/* Pestañas */}
            {/* Selector de pestañas */}
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => setActiveTab('terminados')}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'terminados'
                  ? 'bg-gray-400 text-gray-400'
                  : 'bg-gray-400 text-gray-400d'
                  }`}
              >
                Trabajos personalizados
              </button>

              <button
                onClick={() => setActiveTab('disponibles')}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'disponibles'
                  ? 'bg-gray-400 text-gray-400'
                  : 'bg-gray-400 text-gray-400d'
                  }`}
              >
                Disponibles
              </button>
            </div>


            {/* Toggle de Vista */}
            <div className="flex bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'grid'
                  ? 'bg-gray-400 text-gray-400'
                  : 'bg-gray-400 text-gray-400d'
                  }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'list'
                  ? 'bg-gray-400 text-gray-400'
                  : 'bg-gray-400 text-gray-400d'
                  }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Contenido según la pestaña activa */}
          {/* Contenido según la pestaña activa */}
          {viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 gap-8">
              <Carousel categoria="anillos" titulo="Anillos" />
              <Carousel categoria="collares" titulo="Collares" />
              <Carousel categoria="aretes" titulo="Aretes" />
              <Carousel categoria="pulseras" titulo="Pulseras" />
            </div>
          ) : (
            <div className="space-y-6">
              <ListView categoria="anillos" titulo="Anillos" />
              <ListView categoria="collares" titulo="Collares" />
              <ListView categoria="aretes" titulo="Aretes" />
              <ListView categoria="pulseras" titulo="Pulseras" />
            </div>
          )}


        </div>
      </section>
      <ProductModal />
    </div>
  );
};

export default LaFlecha;
