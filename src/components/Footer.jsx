import React from 'react'
import { MapPin, Phone, Mail, ShieldCheck } from 'lucide-react'

export const Footer = () => {
  return (
    <footer id='Footer' className="bg-gray-900 text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
                <img 
                  src="/Logolaflecha-white.svg" 
                  alt="logo la flecha" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">La Flecha</h3>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Joyería de lujo que combina tradición y modernidad para crear piezas únicas que duran para siempre.
            </p>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="text-lg sm:text-xl font-semibold mb-4 text-white">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-gray-300">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-amber-400" />
                <p className="text-sm sm:text-base leading-relaxed">
                  Calle bolívar 42-20, Zaragoza, Antioquia, Colombia
                </p>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-5 h-5 flex-shrink-0 text-amber-400" />
                <a 
                  href="tel:+573216414607" 
                  className="text-sm sm:text-base hover:text-amber-400 transition-colors duration-200"
                >
                  +57 321 641 4607
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-5 h-5 flex-shrink-0 text-amber-400" />
                <a 
                  href="mailto:chatlaflecha@gmail.com" 
                  className="text-sm sm:text-base hover:text-amber-400 transition-colors duration-200 break-all"
                >
                  chatlaflecha@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Hours Section */}
          <div className="space-y-4">
            <h4 className="text-lg sm:text-xl font-semibold mb-4 text-white">Horarios</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-gray-300 text-sm sm:text-base">
                <span className="font-medium">Lunes - Viernes:</span>
                <span className="text-right">8:30 am - 7:00 pm</span>
              </div>
              <div className="flex justify-between items-center text-gray-300 text-sm sm:text-base">
                <span className="font-medium">Sábado:</span>
                <span className="text-right">8:30 am - 7:30 pm</span>
              </div>
              <div className="flex justify-between items-center text-gray-300 text-sm sm:text-base">
                <span className="font-medium">Domingo:</span>
                <span className="text-right">8:30 am - 6:30 pm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certification Section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-3">
                <img 
                  src="/camara-comercio.png" 
                  alt="Cámara de Comercio del Magdalena Medio y Nordeste Antioqueño" 
                  className="h-12 w-auto"
                />
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">Empresa Verificada</span>
                </div>
                <p className="text-xs text-gray-400">
                  Establecimiento registrado desde marzo 2018
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-6 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-gray-400 text-sm sm:text-base">
                &copy; Marzo de 2018 La Flecha compra de oro. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;