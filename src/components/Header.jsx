import React from 'react'
import { Link } from 'react-router-dom'

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 w-full">
      <div className="w-full mx-auto lg:px-8 px-3">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg flex items-center justify-center">
              <img src="/Logolaflecha.svg" alt="logo la flecha" className="w-full h-full object-contain" />
            </div>
            <div>
              {/* <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black">
            La Flecha
          </h1> */}
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8">
            <a href="#productos" className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm lg:text-base">Productos</a>
            <a href="#Footer" className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm lg:text-base">Nosotros</a>
            <a href="#Footer" className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm lg:text-base">Contacto</a>
          </nav>

          {/* Botón para mobil */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Navegación mobil */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <a 
                href="#productos" 
                className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-base px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </a>
              <a 
                href="#Footer" 
                className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-base px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Nosotros
              </a>
              <a 
                href="#Footer" 
                className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-base px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
