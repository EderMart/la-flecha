import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Shield, Award, Menu, X } from 'lucide-react';
import "tailwindcss";
import { Link } from 'react-router-dom';
import { useProducts } from './ProductContext';
import '../../src/App.css'
import { React } from 'react';

const LaFlecha = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentSlides, setCurrentSlides] = useState({
        anillos: 0,
        collares: 0,
        aretes: 0,
        pulseras: 0
    });

    // Usar el contexto de productos
    const { productos } = useProducts();

    // Efecto para manejar la animación del splash screen
    // Efecto para manejar la animación del splash screen
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 4500); // 4.5 segundos para que termine la animación

        return () => clearTimeout(timer);
    }, []);

    // Componente del Splash Screen con la animación
    const SplashScreen = () => (
        <div className="fixed inset-0 bg-white flex justify-center items-center font-sans overflow-hidden z-50">
            <div className="relative w-full max-w-[600px] h-[400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* L */}
                <div
                    className="letra-l text-6xl font-bold text-amber-600 flex items-center justify-center"
                    style={{
                        animation: 'slideDownBounce 1.2s ease-out 0.5s both'
                    }}
                >
                    <img src="../public/letral.svg" alt="logo la flecha" className="w-full h-full object-contain " />
                </div>

                {/* F */}
                <div
                    className="letra-f text-6xl font-bold text-amber-600 flex items-center justify-center"
                    style={{
                        animation: 'slideUpBounce 1.2s ease-out 1.3s both'
                    }}
                >
                    <img src="../public/letraf.svg" alt="logo la flecha" className="w-full h-full object-contain" />
                </div>

                {/* Flecha */}
                <div
                    className="flecha-arrow text-yellow-400"
                    style={{
                        animation: 'arrowSlide 1.5s ease-in-out 2.1s both'
                    }}
                >
                    <img src="../public/flecha.svg" alt="logo la flecha" className="w-full h-full object-contain" />
                </div>
            </div>

            <style jsx>{`
      /* Estilos para la L */
      .letra-l {
        position: absolute;
        width: 80px;
        height: 100px;
        left: 35%;
        top: 35%;
      }
      
      /* Estilos para la F */
      .letra-f {
        position: absolute;
        width: 100px;
        height: 110px;
        right: 30%;
        top: 35%;
      }
      
      /* Estilos para la flecha */
      .flecha-arrow {
        position: absolute;
        left: -150px;
        height: 35px;
        top: 48%;
      }
      
      /* Tablets pequeñas */
      @media (min-width: 641px) {
        .letra-l {
          width: 100px;
          height: 125px;
          left: 32%;
        }
        
        .letra-f {
          width: 125px;
          height: 138px;
          right: 27%;
        }
        
        .flecha-arrow {
          left: -200px;
          height: 43px;
        }
      }
      
      /* Tablets medianas */
      @media (min-width: 769px) {
        .letra-l {
          left: 30%;
        }
        
        .letra-f {
          right: 25%;
        }
        
        .flecha-arrow {
          left: -250px;
        }
      }
      
      /* Tablets grandes y laptops pequeñas */
      @media (min-width: 1025px) {
        .letra-l {
          left: 28%;
        }
        
        .letra-f {
          right: 23%;
        }
        
        .flecha-arrow {
          left: -300px;
        }
      }
      
      /* Pantallas grandes */
      @media (min-width: 1280px) {
        .letra-l {
          width: 120px;
          height: 150px;
          left: 185px;
          top: 140px;
        }
        
        .letra-f {
          width: 150px;
          height: 166px;
          right: 193px;
          top: 140px;
        }
        
        .flecha-arrow {
          left: -599px;
          height: 51px;
          
        }
      }

      /* Ajustes para móvil */
@media (max-width: 640px) {
  .flecha-arrow {
    top: 43.5%; 
    left: -120px;
  }
}

      @keyframes slideDownBounce {
        0% { transform: translateY(-450px); }
        100% { transform: translateY(0px); }
      }
      
      @keyframes slideUpBounce {
        0% { transform: translateY(400px); }
        100% { transform: translateY(0px); }
      }
      
      @keyframes arrowSlide {
        0% { transform: translateX(0); }
        100% { transform: translateX(780px); }
      }
      
      @media (max-width: 640px) {
        @keyframes slideDownBounce {
          0% { transform: translateY(-300px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes slideUpBounce {
          0% { transform: translateY(300px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes arrowSlide {
          0% { transform: translateX(0); }
          100% { transform: translateX(250px); }
        }
      }
      
      @media (min-width: 641px) and (max-width: 768px) {
        @keyframes slideDownBounce {
          0% { transform: translateY(-350px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes slideUpBounce {
          0% { transform: translateY(350px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes arrowSlide {
          0% { transform: translateX(0); }
          100% { transform: translateX(320px); }
        }
      }
      
      @media (min-width: 769px) and (max-width: 1024px) {
        @keyframes slideDownBounce {
          0% { transform: translateY(-375px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes slideUpBounce {
          0% { transform: translateY(375px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes arrowSlide {
          0% { transform: translateX(0); }
          100% { transform: translateX(400px); }
        }
      }
      
      @media (min-width: 1025px) and (max-width: 1279px) {
        @keyframes arrowSlide {
          0% { transform: translateX(0); }
          100() { transform: translateX(500px); }
        }
      }
    `}</style>
        </div>
    );

    const nextSlide = (categoria) => {
        setCurrentSlides(prev => ({
            ...prev,
            [categoria]: (prev[categoria] + 1) % productos[categoria].length
        }));
    };

    const prevSlide = (categoria) => {
        setCurrentSlides(prev => ({
            ...prev,
            [categoria]: prev[categoria] === 0 ? productos[categoria].length - 1 : prev[categoria] - 1
        }));
    };

    const Carousel = ({ categoria, titulo }) => {
        const currentIndex = currentSlides[categoria];
        const items = productos[categoria];

        // Si no hay productos en esta categoría, mostrar un mensaje
        if (!items || items.length === 0) {
            return (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                    <div className="h-80 flex items-center justify-center bg-gray-100">
                        <p className="text-gray-500">No hay productos disponibles en {titulo.toLowerCase()}</p>
                    </div>
                </div>
            );
        }

        const currentItem = items[currentIndex];

        return (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                <div className="relative">
                    <div className="h-80 overflow-hidden">
                        <img
                            src={currentItem.imagen}
                            alt={currentItem.titulo}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                    <button
                        onClick={() => prevSlide(categoria)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => nextSlide(categoria)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="absolute top-4 left-4">
                        <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {titulo}
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{currentItem.titulo}</h3>
                        <span className="text-2xl font-bold text-amber-600">{currentItem.precio}</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">{currentItem.descripcion}</p>

                    <div className="flex justify-between items-center">
                        <div className="flex space-x-1">
                            {items.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex ? 'bg-amber-500' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <button className="bg-amber-600 hover:bg-amber-700 text-black px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105 font-medium">
                            Ver Detalles
                        </button>
                    </div>
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
                        elegancia y sofisticación. Crafted con los mejores materiales del mundo.
                    </p>
                    <button className="group relative bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-full text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3">
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
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
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
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Garantía Vitalicia</h3>
                            <p className="text-gray-600">Protección completa en tus joyas</p>
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
                            Cada pieza es cuidadosamente seleccionada y crafted para ofrecerte lo mejor en joyería de lujo
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Carousel categoria="anillos" titulo="Anillos" />
                        <Carousel categoria="collares" titulo="Collares" />
                        <Carousel categoria="aretes" titulo="Aretes" />
                        <Carousel categoria="pulseras" titulo="Pulseras" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LaFlecha;