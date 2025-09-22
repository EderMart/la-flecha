import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Star, Shield, Award, Menu, X, Eye, Database, RefreshCw, Grid3X3, List, Truck, Clock, Users, ArrowRight, Quote, CheckCircle, Calendar, Upload } from 'lucide-react';
import "tailwindcss";
import { Link } from 'react-router-dom';
import { useProducts } from './ProductContext';
import '../../src/App.css'

const formatPrice = (p) => {
  const n = Number(p);
  if (!Number.isFinite(n)) return p ? String(p) : '';
  return n.toLocaleString('es-CO');
};

const CATEGORY_SUBTYPES = {
  anillos: ['Anillos en oro 18k', 'Anillos tejidos'],
  pulseras: ['Pulseras oro 18k', 'Pulseras tejidas'],
  aretes: ['Aretes tradicionales'],
  collares: ['Collares tradicionales'],
  topos: ['Topos en oro 18k', 'Topos con piedras preciosas'],
  dijes: ['Dijes tradicionales'],
  juegos: [
    'Juego de pulseras y anillo',
    'Juego de cadena y dije',
    'Juego de cadena, pulsera y anillo'
  ]
};

const SubtypeSelector = ({ categoria, titulo, selectedSubtypes, setSelectedSubtypes }) => (
  <div className="mb-4">
    <select
      value={selectedSubtypes[categoria]}
      onChange={(e) => setSelectedSubtypes({
        ...selectedSubtypes,
        [categoria]: e.target.value
      })}
      className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white text-gray-700"
    >
      {CATEGORY_SUBTYPES[categoria]?.map(subtipo => (
        <option key={subtipo} value={subtipo}>{subtipo}</option>
      ))}
    </select>
  </div>
);


const LaFlecha = () => {
  const [selectedSubtypes, setSelectedSubtypes] = useState({
    anillos: 'Anillos en oro 18k',
    pulseras: 'Pulseras oro 18k',
    aretes: 'Aretes tradicionales',
    collares: 'Collares tradicionales',
    topos: 'Topos en oro 18k',
    dijes: 'Dijes tradicionales',
    juegos: 'Juego de pulseras y anillo'
  });
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
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('terminados');
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [testimonialSubmitting, setTestimonialSubmitting] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    nombre: '',
    testimonio: '',
    calificacion: 5,
    producto: '',
    telefono: '',
    email: ''
  });



  const { productos, productosDisponibles, testimonios, getTestimoniosPublicos, addTestimonio } = useProducts();

  // Obtener testimonios pÃºblicos para mostrar
  const testimoniosPublicos = getTestimoniosPublicos();

  // FunciÃ³n para manejar el envÃ­o del testimonio
  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setTestimonialSubmitting(true);

    try {
      // Agregar el testimonio usando el contexto
      await addTestimonio(newTestimonial);

      // Resetear el formulario
      setNewTestimonial({
        nombre: '',
        testimonio: '',
        calificacion: 5,
        producto: '',
        telefono: '',
        email: ''
      });

      // Cerrar el formulario
      setShowTestimonialForm(false);

      // Opcional: Mostrar mensaje de Ã©xito
      alert('¡Gracias por compartir tu experiencia!');

    } catch (error) {
      console.error('Error al enviar testimonio:', error);
      alert('Hubo un error al enviar tu testimonio. Por favor intenta de nuevo.');
    } finally {
      setTestimonialSubmitting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleProductUpdate = () => {
      setLastUpdate(Date.now());
      setCurrentSlides(prev => {
        const newSlides = {};
        Object.keys(prev).forEach(categoria => {
          const productCount = productos[categoria]?.length || 0;
          newSlides[categoria] = Math.min(prev[categoria], Math.max(0, productCount - 1));
        });
        return newSlides;
      });
    };

    window.addEventListener('productsUpdated', handleProductUpdate);
    window.addEventListener('storage', handleProductUpdate);

    return () => {
      window.removeEventListener('productsUpdated', handleProductUpdate);
      window.removeEventListener('storage', handleProductUpdate);
    };
  }, [productos]);

  const SplashScreen = () => (
    <div className="fixed inset-0 bg-white flex flex-col justify-center items-center font-sans overflow-hidden z-50">
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <img
              src="/Logolaflecha.svg"
              alt="Logo La Flecha"
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
          </div>
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
                borderTopColor: '#f59e0b',
                borderRightColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: 'transparent'
              }}
            />
          </div>
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
                borderTopColor: '#fbbf24',
                borderRightColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: 'transparent'
              }}
            />
          </div>
        </div>
        <p className="mt-6 text-gray-600 text-sm animate-pulse">Cargando...</p>
      </div>
      <style>{`
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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!isModalOpen || !selectedProduct) return null;

    // Resetear el Ã­ndice cuando cambie el producto
    useEffect(() => {
      setCurrentImageIndex(0);
    }, [selectedProduct?.id]);

    // Obtener todas las imÃ¡genes del producto
    const getAllImages = (product) => {
      const images = [];

      // Agregar imagen principal si existe
      if (product.imagen && product.imagen.trim()) {
        images.push(product.imagen);
      }

      // Agregar imÃ¡genes adicionales si existen
      if (product.imagenes && Array.isArray(product.imagenes)) {
        product.imagenes.forEach(img => {
          if (img && img.trim() && !images.includes(img)) {
            images.push(img);
          }
        });
      }

      return images.filter(img => img && img.trim());
    };

    const images = getAllImages(selectedProduct);

    // Funciones de navegaciÃ³n
    const nextImage = () => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    };

    const prevImage = () => {
      setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    };

    const goToImage = (index) => {
      setCurrentImageIndex(index);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4  hover:bg-white text-gray-600 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* GalerÃ­a de imÃ¡genes mejorada */}
            <div className="h-96 md:h-[500px] bg-gray-50 overflow-hidden rounded-t-2xl relative">
              {images.length === 0 ? (
                // Estado sin imÃ¡genes
                <div className="h-full flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-2" />
                    <p>No hay imágenes disponibles</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Imagen principal con animaciÃ³n suave */}
                  <div className="h-full flex items-center justify-center p-4 relative overflow-hidden">
                    <img
                      key={currentImageIndex}
                      src={images[currentImageIndex]}
                      alt={`${selectedProduct.titulo} - Vista ${currentImageIndex + 1}`}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-all duration-500 ease-in-out transform"
                      style={{
                        animation: 'fadeIn 0.3s ease-in-out'
                      }}
                      onError={(e) => {
                        e.target.src = '/api/placeholder/400/400';
                      }}
                    />
                  </div>

                  {/* Controles de navegaciÃ³n (solo si hay más de una imagen) */}
                  {images.length > 1 && (
                    <>
                      {/* Botones de navegaciÃ³n */}
                      <button
  onClick={prevImage}
  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
  aria-label="Imagen anterior"
>
  <ChevronLeft className="w-6 h-6" />
</button>

                      <button
  onClick={nextImage}
  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-600 p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
  aria-label="Imagen siguiente"
>
  <ChevronRight className="w-6 h-6" />
</button>

                      {/* Indicadores de punto */}
                      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 text-amber-600 ${
                            index === currentImageIndex 
                              ? 'bg-white shadow-lg' 
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`Ir a imagen ${index + 1}`}
                        />
                      ))}
                    </div> */}

                      {/* Contador de imÃ¡genes */}
                      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}

                  {/* Miniaturas en la parte inferior (solo si hay mÃºltiples imÃ¡genes) */}
                  {images.length > 1 && images.length <= 6 && (
                    <div className="absolute bottom-4 right-4 flex space-x-2 max-w-[300px] z-10">
                      {images.map((imageUrl, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`flex-shrin  k-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-110 ${index === currentImageIndex
                            ? 'border-white shadow-lg'
                            : 'border-transparent hover:border-white/50'
                            }`}
                        >
                          <img
                            src={imageUrl}
                            alt={`Vista ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/api/placeholder/48/48';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* NavegaciÃ³n con teclado */}
                  <div
                    className="absolute inset-0"
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowLeft') prevImage();
                      if (e.key === 'ArrowRight') nextImage();
                      if (e.key === 'Escape') closeModal();
                    }}
                    tabIndex={0}
                  />
                </>
              )}
            </div>

            {/* InformaciÃ³n del producto */}
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{selectedProduct.titulo}</h2>
                <span className="text-3xl font-bold text-amber-600">${formatPrice(selectedProduct.precio)}</span>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedProduct.descripcion}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">CaracterÍsticas</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <Star className="w-4 h-4 text-amber-500 mr-2" />
                        Calidad premium
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
                      {selectedProduct.material && (
                        <p><span className="font-medium">Material:</span> {selectedProduct.material}</p>
                      )}
                      {selectedProduct.peso && (
                        <p><span className="font-medium">Peso:</span> {selectedProduct.peso}</p>
                      )}
                      {selectedProduct.tamano && (
                        <p><span className="font-medium">TamaÃ±o:</span> {selectedProduct.tamano}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mostrar informaciÃ³n de imÃ¡genes si hay mÃºltiples */}
                {/* {images.length > 1 && (
                <div className="bg-amber-50 rounded-lg p-4">
                  <h4 className="font-medium text-amber-800 mb-2">GalerÃ­a del producto</h4>
                  <p className="text-amber-700 text-sm">
                    Este producto incluye {images.length} imÃ¡genes. 
                    Usa las flechas o haz clic en los puntos para navegar entre ellas.
                  </p>
                </div>
              )} */}

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                  <a
                    href={`https://wa.me/573007269024?text=Hola,%20me%20interesa%20el%20producto:%20${encodeURIComponent(selectedProduct.titulo)}%20-%20$${encodeURIComponent(formatPrice(selectedProduct.precio))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <button className="w-full bg-green-600 hover:bg-green-700 text-amber-600 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.085" />
                      </svg>
                      Contactar por WhatsApp
                    </button>
                  </a>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      </div>
    );
  };

  // Componente de testimonios actualizado para usar testimonios reales
  const TestimonialsSection = () => {
    // Estado para controlar cuÃ¡ntas reseÃ±as mostrar
    const [showAllTestimonials, setShowAllTestimonials] = useState(false);

    if (testimoniosPublicos.length === 0) {
      return (
        <section className="py-16 bg-amber-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Lo que dicen nuestros <span className="text-amber-600">clientes</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                La satisfacción de nuestros clientes es nuestra mayor recompensa
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl max-w-4xl mx-auto text-center">
              <Quote className="w-12 h-12 text-amber-600 mb-4 mx-auto" />
              <p className="text-lg text-gray-600 mb-6">
                Sé el primero en compartir tu experiencia con nosotros
              </p>
              <button
                onClick={() => setShowTestimonialForm(true)}
                className="bg-amber-600 hover:bg-amber-700 text-amber-600 px-8 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Escribir testimonio
              </button>
            </div>
          </div>
        </section>
      );
    }

    // Determinar cuÃ¡ntas reseÃ±as mostrar
    const testimoniosToShow = showAllTestimonials ? testimoniosPublicos : testimoniosPublicos.slice(0, 6);
    const hasMoreTestimonials = testimoniosPublicos.length > 6;

    return (
      <section className="py-16 bg-amber-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Lo que dicen nuestros <span className="text-amber-600">clientes</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              La satisfacciÃ³n de nuestros clientes es nuestra mayor recompensa
            </p>
            {testimoniosPublicos.length > 0 && (
              <p className="text-sm text-amber-600 font-medium mt-2">
                {testimoniosPublicos.length} testimonio{testimoniosPublicos.length !== 1 ? 's' : ''} de nuestros clientes
              </p>
            )}
          </div>

          {/* Grid de testimonios responsive */}
          <div className={`grid gap-6 mb-8 transition-all duration-500 ${showAllTestimonials
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
            {testimoniosToShow.map((testimonio) => (
              <div
                key={testimonio.id}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Quote className="w-8 h-8 text-amber-600 mb-3" />

                {/* Testimonio con altura limitada para consistencia visual */}
                <div className="mb-4 min-h-[80px]">
                  <p className="text-gray-700 text-sm line-clamp-4 leading-relaxed">
                    "{testimonio.testimonio}"
                  </p>
                </div>

                {/* InformaciÃ³n del cliente */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-amber-600 font-bold text-sm">
                          {testimonio.nombre.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm">
                          {testimonio.nombre}
                        </h4>
                        <div className="flex items-center">
                          {[...Array(testimonio.calificacion)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    {testimonio.verificado && (
                      <div className="flex items-center" title="Cliente verificado">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                  </div>

                  {/* Mostrar producto si existe */}
                  {testimonio.producto && (
                    <p className="text-xs text-gray-500 mt-2 bg-gray-50 px-2 py-1 rounded-md">
                      Producto: {testimonio.producto}
                    </p>
                  )}

                  {/* Fecha del testimonio si existe */}
                  {testimonio.fecha && (
                    <div className="flex items-center mt-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(testimonio.fecha).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Controles de visualizaciÃ³n */}
          <div className="text-center space-y-4">
            {/* BotÃ³n para ver más/menos testimonios */}
            {hasMoreTestimonials && (
              <button
                onClick={() => setShowAllTestimonials(!showAllTestimonials)}
                className="bg-white hover:bg-gray-50 text-amber-600 border-2 border-amber-600 hover:border-amber-700 px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
              >
                {showAllTestimonials ? (
                  <>
                    <ChevronLeft className="w-4 h-4" />
                    Ver menos testimonios
                  </>
                ) : (
                  <>
                    Ver todos los testimonios ({testimoniosPublicos.length})
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

            {/* BotÃ³n para agregar nuevo testimonio */}
            <button
              onClick={() => setShowTestimonialForm(true)}
              className="bg-amber-600 hover:bg-amber-700 text-amber-600 px-8 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Compartir mi experiencia
            </button>
          </div>
        </div>
      </section>
    );
  };

  // Componente del proceso
  const ProcessSection = () => (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Nuestro <span className="text-amber-400">proceso</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Desde la consulta hasta la entrega, te acompañamos en cada paso
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Consulta</h3>
            <p className="text-gray-300">Conversamos sobre tus ideas y preferencias</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Diseño</h3>
            <p className="text-gray-300">Creamos un diseño personalizado para ti</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Creación</h3>
            <p className="text-gray-300">Elaboramos tu joya con máxima precisión</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">4. Entrega</h3>
            <p className="text-gray-300">Recibe tu joya úica en un tiempo estimado</p>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="https://wa.me/573007269024?text=Hola,%20me%20gustarí­a%20conocer%20más%20sobre%20el%20proceso%20de%20personalización"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-white text-amber-600 hover:bg-gray-50 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-2 mx-auto">
              Iniciar mi proyecto.
              <ArrowRight className="w-5 h-5" />
            </button>
          </a>
        </div>
      </div>
    </section>
  );

  const Carousel = ({ categoria, titulo, subtipoSeleccionado }) => {
    // CAMBIO: Filtrar productos por subtipo
    const allItems = activeTab === 'terminados' ? productos[categoria] : productosDisponibles[categoria];

    const items = allItems?.filter(item => {
      if (!item.subtipo) {
        return subtipoSeleccionado === CATEGORY_SUBTYPES[categoria][0];
      }
      return item.subtipo === subtipoSeleccionado;
    }) || [];

    const currentIndex = currentSlides[categoria] || 0;

    // CAMBIO: Agregar subtipoSeleccionado como dependencia
    useEffect(() => {
      if (items && items.length > 0) {
        if (currentIndex >= items.length) {
          setCurrentSlides(prev => ({
            ...prev,
            [categoria]: 0
          }));
        }
      }
    }, [activeTab, items?.length, categoria, currentIndex, subtipoSeleccionado]);


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
                Los productos aparecerán aquí­ automáticamente cuando se agreguen
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Asegurar que el currentIndex estÃ© dentro del rango vÃ¡lido
    const safeCurrentIndex = Math.max(0, Math.min(currentIndex, items.length - 1));
    const currentItem = items[safeCurrentIndex];

    if (!currentItem) {
      console.error(`No se encontrÃ³ producto en Ã­ndice ${safeCurrentIndex} para ${categoria}`);
      return null;
    }

    // Funciones de navegaciÃ³n
    const handleNextSlide = () => {
      const newIndex = (safeCurrentIndex + 1) % items.length;
      console.log(`Next slide para ${categoria}: ${safeCurrentIndex} -> ${newIndex}`);

      setCurrentSlides(prev => ({
        ...prev,
        [categoria]: newIndex
      }));
    };

    const handlePrevSlide = () => {
      const newIndex = safeCurrentIndex === 0 ? items.length - 1 : safeCurrentIndex - 1;
      console.log(`Prev slide para ${categoria}: ${safeCurrentIndex} -> ${newIndex}`);

      setCurrentSlides(prev => ({
        ...prev,
        [categoria]: newIndex
      }));
    };

    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <div className="relative">
          <div className="h-80 overflow-hidden rounded-t-2xl bg-gray-100 relative">
            <img
              key={`${categoria}-${activeTab}-${safeCurrentIndex}-${currentItem.id}`}
              src={currentItem.imagen}
              alt={currentItem.titulo}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              onError={(e) => {
                e.target.src = '';
              }}
            />
            {/* Overlay sutil para mejorar legibilidad de botones */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          {items.length > 1 && (
            <>
              <button
                onClick={handlePrevSlide}
                type="button"
                aria-label="Producto anterior"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextSlide}
                type="button"
                aria-label="Producto siguiente"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-600 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
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

          <div className="flex justify-end items-center">
            <button
              onClick={() => openModal(currentItem)}
              className="bg-white hover:bg-amber-700 text-amber-600 px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105 font-medium"
            >
              Ver Detalles
            </button>
          </div>

          <div className="mt-3 text-xs text-gray-500 border-t pt-3">
            {items.length > 1 && (
              <span>{safeCurrentIndex + 1} de {items.length}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ListView = ({ categoria, titulo, subtipoSeleccionado }) => {
    // CAMBIO: Aplicar filtro por subtipo
    const allItems = activeTab === 'terminados' ? productos[categoria] : productosDisponibles[categoria];

    const items = allItems?.filter(item => {
      if (!item.subtipo) {
        return subtipoSeleccionado === CATEGORY_SUBTYPES[categoria][0];
      }
      return item.subtipo === subtipoSeleccionado;
    }) || [];

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
                    e.target.src = '';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-gray-800 truncate">{item.titulo}</h4>
                    <span className="text-xl font-bold text-amber-600 ml-4">${formatPrice(item.precio)}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{item.descripcion}</p>
                  <button
                    onClick={() => openModal(item)}
                    className="bg-amber-600 hover:bg-amber-700 text-amber-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
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

  // Formulario para nuevo testimonio
  // Formulario para nuevo testimonio - VERSIÃ“N CORREGIDA
  const TestimonialForm = () => {
    // Mover el estado local dentro del componente para evitar re-renders innecesarios
    const [formData, setFormData] = useState({
      nombre: '',
      testimonio: '',
      calificacion: 5,
      producto: '',
      telefono: '',
      email: '',
      recibirNoticias: false // Nuevo campo para el checkbox
    });

    // FunciÃ³n optimizada para manejar cambios en los inputs
    const handleInputChange = useCallback((field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }, []);

    // FunciÃ³n para enviar notificaciÃ³n por WhatsApp
    const sendWhatsAppNotification = (userData) => {
      const message = `*HOLA QUIERO RESIVIR OFERTAS Y PRODUCTOS EXCLUSIVOS ANTES QUE NADIE!*\n\nMi nombre es ${userData.nombre}  y quiero ser de los primeros en recibir las nuevas ofertas y productos que ofrece la tienda.\n\nTeléfono: ${userData.telefono}\n Email: ${userData.email}\n\n¡Por favor agrégame a la lista!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/573007269024?text=${encodedMessage}`;

      // Abrir WhatsApp en una nueva ventana
      window.open(whatsappURL, '_blank');
    };

    // FunciÃ³n para manejar el envÃ­o del formulario
    const handleSubmit = async (e) => {
      e.preventDefault();
      setTestimonialSubmitting(true);

      try {
        // Agregar el testimonio usando el contexto
        await addTestimonio(formData);

        // Si el usuario quiere recibir noticias Y tiene telÃ©fono, enviar notificaciÃ³n
        if (formData.recibirNoticias && (formData.telefono || formData.email)) {
          sendWhatsAppNotification(formData);
        }

        // Resetear el formulario local
        setFormData({
          nombre: '',
          testimonio: '',
          calificacion: 5,
          producto: '',
          telefono: '',
          email: '',
          recibirNoticias: false
        });

        // Cerrar el formulario
        setShowTestimonialForm(false);

        // Mensaje de Ã©xito personalizado
        const successMessage = formData.recibirNoticias
          ? 'Â¡Gracias por tu testimonio! Te contactaremos pronto para mantenerte al dÃ­a con nuestros nuevos productos.'
          : '¡Gracias por compartir tu experiencia!';

        alert(successMessage);

      } catch (error) {
        console.error('Error al enviar testimonio:', error);
        alert('Hubo un error al enviar tu testimonio. Por favor intenta de nuevo.');
      } finally {
        setTestimonialSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Overlay de carga */}
          {testimonialSubmitting && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-2xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Enviando tu testimonio...</p>
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Comparte tu experiencia</h3>
              <button
                onClick={() => setShowTestimonialForm(false)}
                className="text-gray-400 hover:text-gray-600"
                type="button"
                disabled={testimonialSubmitting}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                  placeholder="Tu nombre completo"
                  autoComplete="name"
                  disabled={testimonialSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Opcional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  disabled={testimonialSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono (Recomendado)
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                  placeholder="+57 300 123 4567"
                  autoComplete="tel"
                  disabled={testimonialSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Producto comprado
                </label>
                <input
                  type="text"
                  value={formData.producto}
                  onChange={(e) => handleInputChange('producto', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                  placeholder="Ej: Anillo de compromiso, Collar personalizado..."
                  disabled={testimonialSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calificación *
                </label>
                <div className="flex space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleInputChange('calificacion', rating)}
                      className={`p-1 transition-colors ${rating <= formData.calificacion ? 'text-amber-400' : 'text-gray-300'}`}
                      disabled={testimonialSubmitting}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tu testimonio *
                </label>
                <textarea
                  required
                  value={formData.testimonio}
                  onChange={(e) => handleInputChange('testimonio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-24 resize-none text-gray-900"
                  placeholder="Comparte tu experiencia con nosotros..."
                  disabled={testimonialSubmitting}
                />
              </div>

              {/* NUEVO: Checkbox para recibir noticias VIP */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="recibirNoticias"
                    checked={formData.recibirNoticias}
                    onChange={(e) => handleInputChange('recibirNoticias', e.target.checked)}
                    className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    disabled={testimonialSubmitting}
                  />
                  <div>
                    <label htmlFor="recibirNoticias" className="text-sm font-medium text-gray-800 cursor-pointer">
                      ¡Quiero ser de los primeros!
                    </label>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Recibe información de nuevos productos y ofertas exclusivas antes que nadie.
                      {!formData.telefono && !formData.email && (
                        <span className="text-amber-700 font-medium"> (Necesitas proporcionar teléfono o email)</span>
                      )}
                    </p>
                  </div>
                </div>

                {formData.recibirNoticias && !formData.telefono && !formData.email && (
                  <div className="mt-2 p-2 bg-amber-100 border border-amber-300 rounded text-xs text-amber-800">
                    Por favor, proporciona tu teléfono o email para poder contactarte.
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={testimonialSubmitting || (formData.recibirNoticias && !formData.telefono && !formData.email)}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-amber-600 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
                >
                  {testimonialSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    'Enviar testimonio'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTestimonialForm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                  disabled={testimonialSubmitting}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Componente para mostrar todos los productos de una categorÃ­a
  const AllProductsView = ({ categoria, titulo, subtipoSeleccionado }) => {
    // CAMBIO: Aplicar filtro por subtipo
    const allItems = activeTab === 'terminados' ? productos[categoria] : productosDisponibles[categoria];

    const items = allItems?.filter(item => {
      if (!item.subtipo) {
        return subtipoSeleccionado === CATEGORY_SUBTYPES[categoria][0];
      }
      return item.subtipo === subtipoSeleccionado;
    }) || [];

    if (!items || items.length === 0) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-3 animate-pulse" />
          <p className="text-gray-500">No hay productos disponibles en {titulo.toLowerCase()}</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-b">
          <h3 className="text-2xl font-bold text-gray-800">{titulo}</h3>
          <p className="text-sm text-gray-600">{items.length} producto{items.length !== 1 ? 's' : ''} disponible{items.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-48 bg-gray-100 overflow-hidden relative">
                <img
                  src={item.imagen}
                  alt={item.titulo}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '';
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-gray-800 truncate">{item.titulo}</h4>
                  <span className="text-xl font-bold text-amber-600 ml-2">${formatPrice(item.precio)}</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{item.descripcion}</p>
                <button
                  onClick={() => openModal(item)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-amber-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Componente para mostrar TODOS los productos de TODAS las categorÃ­as
  const AllCategoriesView = () => {
    const currentProducts = activeTab === 'terminados' ? productos : productosDisponibles;
    const allItems = [];

    // Recopilar todos los productos de todas las categorÃ­as
    Object.entries(currentProducts).forEach(([categoria, items]) => {
      if (items && Array.isArray(items)) {
        items.forEach(item => {
          allItems.push({
            ...item,
            categoria: categoria
          });
        });
      }
    });

    if (allItems.length === 0) {
      return (
        <div className="bg-white rounded-xl p-12 shadow-lg text-center">
          <RefreshCw className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay productos disponibles</h3>
          <p className="text-gray-500">Los productos aparecerÃ¡n aquÃ­ cuando se agreguen</p>
        </div>
      );
    }

    const getCategoryName = (categoria) => {
      const names = {
        anillos: 'Anillos',
        collares: 'Collares',
        aretes: 'Aretes',
        pulseras: 'Pulseras'
      };
      return names[categoria] || categoria;
    };

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-6 border-b">
          <h3 className="text-3xl font-bold text-white mb-2">Todos los Productos</h3>
          <p className="text-amber-100">{allItems.length} productos en total</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          {allItems.map((item) => (
            <div key={`${item.categoria}-${item.id}`} className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-48 bg-gray-100 overflow-hidden relative">
                <img
                  src={item.imagen}
                  alt={item.titulo}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '';
                  }}
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {getCategoryName(item.categoria)}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-gray-800 truncate">{item.titulo}</h4>
                  <span className="text-xl font-bold text-amber-600 ml-2">${formatPrice(item.precio)}</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{item.descripcion}</p>
                <button
                  onClick={() => openModal(item)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-amber-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section Mejorado */}
      /* Hero Section Mejorado con Video de Fondo */
<section className="relative py-24 text-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
  {/* Video de fondo */}
  <div className="absolute inset-0 w-full h-full">
    <video
      className="w-full h-full object-cover"
      autoPlay
      muted
      loop
      playsInline
    >
      <source src="/path-to-your-video.mp4" type="video/mp4" />
      <source src="/path-to-your-video.webm" type="video/webm" />
      {/* Fallback para navegadores que no soporten video */}
      Tu navegador no soporta video HTML5.
    </video>
    
    {/* Overlay oscuro para mejorar legibilidad del texto */}
    <div className="absolute inset-0 bg-black/50"></div>
  </div>

        {/* Efecto de partículas de fondo (mantiene las partículas originales) */}
        <div className="absolute inset-0 opacity-10 z-10">
          <div className="absolute top-20 left-10 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-1 h-1 bg-amber-300 rounded-full animate-pulse delay-75"></div>
          <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse delay-150"></div>
          <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-amber-400 rounded-full animate-pulse delay-300"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 z-20">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Elegancia que
            <span className="block bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent"> Perdura</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            Descubre nuestra colección de joyas únicas, donde cada pieza cuenta una historia de amor,
            elegancia y sofisticación, hecha con los mejores materiales del mundo.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="https://wa.me/573007269024?text=Hola,%20me%20interesa%20obtener%20más%20información"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <button className="group relative bg-white hover:bg-green-600 text-amber-600 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25 flex items-center gap-3 min-w-[280px] justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300"></div>

                <div className="relative z-10 flex items-center gap-3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="drop-shadow-sm"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.085" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    Chatear por WhatsApp
                  </span>
                </div>

                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></div>
              </button>
            </a>

            <a
              href="#productos"
              className="group"
            >
              <button className="group relative bg-white hover:bg-amber-700 text-amber-600 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-amber-500/25 flex items-center gap-3 min-w-[280px] justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300"></div>

                <div className="relative z-10 flex items-center gap-3">
                  <ArrowRight className="w-6 h-6 drop-shadow-sm" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    Ver Catálogo
                  </span>
                </div>

                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full"></div>
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* SecciÃ³n de caracterÃ­sticas mejorada */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              ¿Por qué elegir <span className="text-amber-600">La Flecha?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cada detalle importa cuando se trata de crear la joya perfecta para ti
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow">
                <Award className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Calidad Premium</h3>
              <p className="text-gray-600 leading-relaxed">Materiales de la más alta calidad seleccionados cuidadosamente</p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow">
                <Shield className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Garantí­a de por vida</h3>
              <p className="text-gray-600 leading-relaxed">Protección completa y mantenimiento para tus joyas</p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow">
                <Truck className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Enví­os Nacionales</h3>
              <p className="text-gray-600 leading-relaxed">Entrega segura en todo el territorio nacional</p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow">
                <Star className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Diseño Exclusivo</h3>
              <p className="text-gray-600 leading-relaxed">Piezas únicas diseñadas especialmente para cada cliente</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nueva secciÃ³n de proceso */}
      <ProcessSection />

      {/* Nueva secciÃ³n de testimonios */}
      <TestimonialsSection />

      {/* SecciÃ³n de productos */}
      <section id="productos" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Nuestra <span className="text-amber-600">Colección</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Cada pieza es cuidadosamente seleccionada y hecha para ofrecerte lo mejor en joyerí­a de lujo.
              Descubre diseños únicos que reflejan tu personalidad y estilo.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">


              <button
                onClick={() => setActiveTab('disponibles')}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${activeTab === 'disponibles'
                  ? 'bg-white text-amber-600 shadow-xl'
                  : 'bg-gray-200 text-gray-400 hover:bg-amber-50 shadow-md'
                  }`}
              >
                Disponibles Ahora
              </button>

              <button
                onClick={() => setActiveTab('terminados')}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${activeTab === 'terminados'
                  ? 'bg-white text-amber-600 shadow-xl'
                  : 'bg-gray-200 text-gray-400 hover:bg-amber-50 shadow-md'
                  }`}
              >
                Trabajos Personalizados
              </button>
            </div>

            <div className="flex bg-white rounded-xl p-2 shadow-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all duration-200 ${viewMode === 'grid'
                  ? 'bg-amber-500 text-gray-400 shadow-md'
                  : 'text-amber-600 hover:text-gray-400 hover:bg-gray-50'
                  }`}
                title="Vista carousel"
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all duration-200 ${viewMode === 'list'
                  ? 'bg-amber-500 text-gray-400 shadow-md'
                  : 'text-amber-600 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                title="Vista lista"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('category')}
                className={`p-3 rounded-lg transition-all duration-200 ${viewMode === 'category'
                  ? 'bg-amber-500 text-gray-400 shadow-md'
                  : 'text-amber-600 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                title="Ver todos por categorÃ­a"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`p-3 rounded-lg transition-all duration-200 ${viewMode === 'all'
                  ? 'bg-amber-500 text-gray-400 shadow-md'
                  : 'text-amber-600 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                title="Ver todos los productos"
              >
                <Database className="w-5 h-5" />
              </button>
            </div>
          </div>
          {viewMode === 'grid' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Anillos</h3>
                <SubtypeSelector categoria="anillos" titulo="Anillos" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <Carousel categoria="anillos" titulo={selectedSubtypes.anillos} subtipoSeleccionado={selectedSubtypes.anillos} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Collares</h3>
                <SubtypeSelector categoria="collares" titulo="Collares" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <Carousel categoria="collares" titulo={selectedSubtypes.collares} subtipoSeleccionado={selectedSubtypes.collares} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Aretes</h3>
                <SubtypeSelector categoria="aretes" titulo="Aretes" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <Carousel categoria="aretes" titulo={selectedSubtypes.aretes} subtipoSeleccionado={selectedSubtypes.aretes} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Pulseras</h3>
                <SubtypeSelector categoria="pulseras" titulo="Pulseras" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <Carousel categoria="pulseras" titulo={selectedSubtypes.pulseras} subtipoSeleccionado={selectedSubtypes.pulseras} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Topos</h3>
                <SubtypeSelector categoria="topos" titulo="Topos" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <Carousel categoria="topos" titulo={selectedSubtypes.topos} subtipoSeleccionado={selectedSubtypes.topos} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Dijes</h3>
                <SubtypeSelector categoria="dijes" titulo="Dijes" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <Carousel categoria="dijes" titulo={selectedSubtypes.dijes} subtipoSeleccionado={selectedSubtypes.dijes} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Juegos</h3>
                <SubtypeSelector categoria="juegos" titulo="Juegos" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <Carousel categoria="juegos" titulo={selectedSubtypes.juegos} subtipoSeleccionado={selectedSubtypes.juegos} />
              </div>
            </div>
          )}

          {viewMode === 'list' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Anillos</h3>
                <SubtypeSelector categoria="anillos" titulo="Anillos" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <ListView categoria="anillos" titulo={selectedSubtypes.anillos} subtipoSeleccionado={selectedSubtypes.anillos} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Collares</h3>
                <SubtypeSelector categoria="collares" titulo="Collares" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <ListView categoria="collares" titulo={selectedSubtypes.collares} subtipoSeleccionado={selectedSubtypes.collares} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Aretes</h3>
                <SubtypeSelector categoria="aretes" titulo="Aretes" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <ListView categoria="aretes" titulo={selectedSubtypes.aretes} subtipoSeleccionado={selectedSubtypes.aretes} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Pulseras</h3>
                <SubtypeSelector categoria="pulseras" titulo="Pulseras" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <ListView categoria="pulseras" titulo={selectedSubtypes.pulseras} subtipoSeleccionado={selectedSubtypes.pulseras} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Topos</h3>
                <SubtypeSelector categoria="topos" titulo="Topos" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <ListView categoria="topos" titulo={selectedSubtypes.topos} subtipoSeleccionado={selectedSubtypes.topos} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Dijes</h3>
                <SubtypeSelector categoria="dijes" titulo="Dijes" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <ListView categoria="dijes" titulo={selectedSubtypes.dijes} subtipoSeleccionado={selectedSubtypes.dijes} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Juegos</h3>
                <SubtypeSelector categoria="juegos" titulo="Juegos" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <ListView categoria="juegos" titulo={selectedSubtypes.juegos} subtipoSeleccionado={selectedSubtypes.juegos} />
              </div>
            </div>
          )}

          {viewMode === 'category' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Anillos</h3>
                <SubtypeSelector categoria="anillos" titulo="Anillos" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <ListView categoria="anillos" titulo={selectedSubtypes.anillos} subtipoSeleccionado={selectedSubtypes.anillos} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Collares</h3>
                <SubtypeSelector categoria="collares" titulo="Collares" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <AllProductsView categoria="collares" titulo={selectedSubtypes.collares} subtipoSeleccionado={selectedSubtypes.collares} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Aretes</h3>
                <SubtypeSelector categoria="aretes" titulo="Aretes" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <AllProductsView categoria="aretes" titulo={selectedSubtypes.aretes} subtipoSeleccionado={selectedSubtypes.aretes} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Pulseras</h3>
                <SubtypeSelector categoria="pulseras" titulo="Pulseras" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <AllProductsView categoria="pulseras" titulo={selectedSubtypes.pulseras} subtipoSeleccionado={selectedSubtypes.pulseras} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Topos</h3>
                <SubtypeSelector categoria="topos" titulo="Topos" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <AllProductsView categoria="topos" titulo={selectedSubtypes.topos} subtipoSeleccionado={selectedSubtypes.topos} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Dijes</h3>
                <SubtypeSelector categoria="dijes" titulo="Dijes" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <AllProductsView categoria="dijes" titulo={selectedSubtypes.dijes} subtipoSeleccionado={selectedSubtypes.dijes} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Juegos</h3>
                <SubtypeSelector categoria="juegos" titulo="Juegos" selectedSubtypes={selectedSubtypes} setSelectedSubtypes={setSelectedSubtypes} />
                <AllProductsView categoria="juegos" titulo={selectedSubtypes.juegos} subtipoSeleccionado={selectedSubtypes.juegos} />
              </div>
            </div>
          )}

          {viewMode === 'all' && (
            <AllCategoriesView />
          )}
        </div>
      </section>

      {/* Nueva secciÃ³n de llamada a la acciÃ³n */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para crear tu joya perfecta?
          </h2>
          <p className="text-xl text-amber-100 mb-12 leading-relaxed">
            Nuestro equipo de expertos está esperando para ayudarte a diseñar la joya de tus sueños.
            ¡Comienza tu proyecto hoy mismo!
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="https://wa.me/573007269024?text=Hola,%20me%20gustarí­a%20iniciar%20un%20proyecto%20personalizado"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-white text-amber-600 hover:bg-gray-50 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-3 mx-auto sm:mx-0">
                <Users className="w-6 h-6" />
                Consulta Personalizada
              </button>
            </a>

            <a
              href="https://wa.me/573007269024?text=Hola,%20me%20interesa%20ver%20más%20productos%20disponibles"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-white text-amber-600 hover:bg-gray-50 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-3 mx-auto sm:mx-0">
                <Star className="w-6 h-6" />
                Ver Más Productos
              </button>
            </a>
          </div>
        </div>
      </section>

      <ProductModal />
      {showTestimonialForm && <TestimonialForm />}
      <ProductModal />
    </div>
  );
};

export default LaFlecha;