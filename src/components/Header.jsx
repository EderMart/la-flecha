import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">⟡</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  La Flecha
                </h1>
                <p className="text-sm text-gray-500">Joyería de Lujo</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#productos" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">Productos</a>
              <a href="#Footer" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">Nosotros</a>
              <a href="#Footer" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">Contacto</a>
            </nav>
          </div>
        </div>
      </header>
  )
}

export default Header