import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función para navegación suave sin cambiar la URL
  const scrollToSection = (sectionId, event) => {
    event.preventDefault(); // Prevenir comportamiento por defecto del enlace
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    
    // Limpiar cualquier hash de la URL
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, null, window.location.pathname);
    }
    
    // Cerrar menú móvil si está abierto
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg flex items-center justify-center">
              <img 
                src="/Logolaflecha.svg" 
                alt="logo la flecha" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                La Flecha
              </h1>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <button 
              onClick={(e) => scrollToSection('productos', e)}
              className="text-gray-400 hover:text-amber-600 transition-colors duration-200 font-medium text-sm lg:text-base whitespace-nowrap cursor-pointer bg-transparent border-none p-0 hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm"
            >
              Productos
            </button>
            <button 
              onClick={(e) => scrollToSection('Footer', e)}
              className="text-gray-400 hover:text-amber-600 transition-colors duration-200 font-medium text-sm lg:text-base whitespace-nowrap cursor-pointer bg-transparent border-none p-0 hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm"
            >
              Nosotros
            </button>
            <button 
              onClick={(e) => scrollToSection('Footer', e)}
              className="text-gray-400 hover:text-amber-600 transition-colors duration-200 font-medium text-sm lg:text-base whitespace-nowrap cursor-pointer bg-transparent border-none p-0 hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm"
            >
              Contacto
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-amber-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-60 opacity-100 pb-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <nav className="border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-1">
              <button 
                onClick={(e) => scrollToSection('productos', e)}
                className="text-gray-400 hover:text-amber-600 hover:bg-gray-50 transition-all duration-200 font-medium text-base px-4 py-3 rounded-md block text-left w-full bg-transparent border-none cursor-pointer"
              >
                Productos
              </button>
              <button 
                onClick={(e) => scrollToSection('Footer', e)}
                className="text-gray-400 hover:text-amber-600 hover:bg-gray-50 transition-all duration-200 font-medium text-base px-4 py-3 rounded-md block text-left w-full bg-transparent border-none cursor-pointer"
              >
                Nosotros
              </button>
              <button 
                onClick={(e) => scrollToSection('Footer', e)}
                className="text-gray-400 hover:text-amber-600 hover:bg-gray-50 transition-all duration-200 font-medium text-base px-4 py-3 rounded-md block text-left w-full bg-transparent border-none cursor-pointer"
              >
                Contacto
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}