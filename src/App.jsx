import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "tailwindcss";
import { Link } from 'react-router-dom';

import './App.css'

import { React, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Shield, Truck, Award } from 'lucide-react';

const LaFlecha = () => {
  const [currentSlides, setCurrentSlides] = useState({
    anillos: 0,
    collares: 0,
    aretes: 0,
    pulseras: 0
  });

  // Datos de productos (esto vendría de una API en producción)
  const productos = {
    anillos: [
      {
        id: 1,
        imagen: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
        titulo: "Anillo Solitario Diamante",
        precio: "$2,500",
        descripcion: "Elegante anillo solitario con diamante de 1 quilate, montado en oro blanco de 18k. Perfecto para compromiso."
      },
      {
        id: 2,
        imagen: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
        titulo: "Anillo Vintage Oro Rosa",
        precio: "$1,800",
        descripcion: "Anillo vintage con detalles florales en oro rosa de 14k, adornado con pequeños diamantes."
      },
      {
        id: 3,
        imagen: "https://images.unsplash.com/photo-1525251991900-cb6a5cd44403?w=400&h=400&fit=crop",
        titulo: "Anillo Moderno Geométrico",
        precio: "$1,200",
        descripcion: "Diseño contemporáneo con líneas geométricas en oro amarillo de 18k."
      }
    ],
    collares: [
      {
        id: 4,
        imagen: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
        titulo: "Collar Perlas Naturales",
        precio: "$3,200",
        descripcion: "Collar de perlas naturales de agua dulce con broche de oro blanco y diamantes."
      },
      {
        id: 5,
        imagen: "https://images.unsplash.com/photo-1611652022313-8b5e84c9497e?w=400&h=400&fit=crop",
        titulo: "Collar Cadena Oro",
        precio: "$1,500",
        descripcion: "Elegante cadena de oro amarillo de 18k con eslabones clásicos, longitud 45cm."
      },
      {
        id: 6,
        imagen: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
        titulo: "Collar Colgante Corazón",
        precio: "$980",
        descripcion: "Delicado colgante en forma de corazón con incrustaciones de diamantes pequeños."
      }
    ],
    aretes: [
      {
        id: 7,
        imagen: "https://images.unsplash.com/photo-1635767582909-864bb5d45b97?w=400&h=400&fit=crop",
        titulo: "Aretes Largos Elegantes",
        precio: "$2,100",
        descripcion: "Aretes largos con cristales Swarovski y oro blanco de 18k, perfectos para ocasiones especiales."
      },
      {
        id: 8,
        imagen: "https://images.unsplash.com/photo-1588444837495-c6cfbd87c36e?w=400&h=400&fit=crop",
        titulo: "Aretes Perla Clásicos",
        precio: "$1,300",
        descripcion: "Aretes de perla cultivada con montura de oro amarillo, diseño clásico y atemporal."
      },
      {
        id: 9,
        imagen: "https://images.unsplash.com/photo-1596944946170-0b067039e5a5?w=400&h=400&fit=crop",
        titulo: "Aretes Modernos Geométricos",
        precio: "$890",
        descripcion: "Diseño contemporáneo con formas geométricas en oro rosa de 14k."
      }
    ],
    pulseras: [
      {
        id: 10,
        imagen: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
        titulo: "Pulsera Tenis Diamantes",
        precio: "$4,500",
        descripcion: "Pulsera tipo tenis con diamantes de alta calidad engarzados en oro blanco de 18k."
      },
      {
        id: 11,
        imagen: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
        titulo: "Pulsera Eslabones Oro",
        precio: "$1,900",
        descripcion: "Pulsera de eslabones gruesos en oro amarillo de 18k, diseño robusto y elegante."
      },
      {
        id: 12,
        imagen: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
        titulo: "Pulsera Charm Vintage",
        precio: "$1,400",
        descripcion: "Pulsera vintage con múltiples charms en oro rosa, cada uno con su propia historia."
      }
    ]
  };

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
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105 font-medium">
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
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
          <button className="bg-amber-600 hover:bg-amber-700 text-black px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-xl">
            Explorar Colección
          </button>
        </div>
      </section>

      {/* Features */}
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