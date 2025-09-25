import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { Menu, X, Instagram, Facebook, Share2 } from 'lucide-react';

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

  // Función para compartir la página
  const shareWebsite = async () => {
    const url = 'https://joyerialaflecha.com/';
    const title = 'La Flecha - Joyería';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copiar al portapapeles
      try {
        await navigator.clipboard.writeText(url);
        alert('¡Enlace copiado al portapapeles!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  // Función para abrir redes sociales
  const openSocialMedia = (platform) => {
    let url = '';
    switch (platform) {
      case 'instagram':
         url = 'https://www.instagram.com/laflechajoyeria/'; // Reemplaza con tu usuario real
        break;
      case 'facebook':
        url = 'https://www.facebook.com/share/16dTGNtMdg/?mibextid=wwXIfr'; // Reemplaza con tu página real
        break;
      default:
        return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
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
              onClick={(e) => scrollToSection('Footer', e)}
              className="text-gray-400 hover:text-amber-600 transition-colors duration-200 font-medium text-sm lg:text-base whitespace-nowrap cursor-pointer bg-transparent border-none p-0 hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-sm"
            >
              Nosotros
            </button>
            
            {/* Redes Sociales - Desktop */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => openSocialMedia('instagram')}
                className="p-2 text-amber-600 hover:text-pink-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-md"
                
                aria-label="Instagram"
                title="Síguenos en Instagram"
              >
                <Instagram className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => openSocialMedia('facebook')}
                className="p-2 text-amber-600 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"

                aria-label="Facebook"
                title="Síguenos en Facebook"
              >
                <Facebook className="h-5 w-5" />
              </button>
              
              <button
                onClick={shareWebsite}
                className="p-2 text-amber-600 hover:text-sky-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-md"
                aria-label="Compartir"
                title="Compartir página"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
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
            ? 'max-h-96 opacity-100 pb-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <nav className="border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-3">
              {/* Enlace Nosotros */}
              <button 
                onClick={(e) => scrollToSection('Footer', e)}
                className="text-gray-600 hover:text-amber-600 hover:bg-gray-50 transition-all duration-200 font-medium text-base px-4 py-3 rounded-md block text-left w-full bg-transparent border-none cursor-pointer"
              >
                Nosotros
              </button>
              
              {/* Separador visual */}
              <div className="border-t border-gray-100 my-2"></div>
              
              {/* Título para redes sociales */}
              <div className="px-4 py-1">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Síguenos
                </span>
              </div>
              
              {/* Redes Sociales - Mobile con diseño mejorado */}
              <div className="flex flex-col space-y-2 px-2">
                <button
                  onClick={() => openSocialMedia('instagram')}
                  className="flex items-center justify-start space-x-3 text-amber-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-lg p-3 w-full text-left"
                  aria-label="Instagram"
                >
                  <div className="flex-shrink-0">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">Instagram</span>
                </button>
                
                <button
                  onClick={() => openSocialMedia('facebook')}
                  className="flex items-center justify-start space-x-3 text-amber-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-3 w-full text-left"
                  aria-label="Facebook"
                >
                  <div className="flex-shrink-0">
                    <Facebook className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">Facebook</span>
                </button>
                
                <button
                  onClick={shareWebsite}
                  className="flex items-center justify-start space-x-3 text-amber-600 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-lg p-3 w-full text-left"
                  aria-label="Compartir"
                >
                  <div className="flex-shrink-0">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">Compartir página</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}