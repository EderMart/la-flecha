import React from 'react'

export const Footer = () => {
  return (
    <footer id='Footer' className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10  flex items-center justify-center">
                  <img src="../utils/Logolaflecha-white.svg" alt="logo la flecha" />
                </div>
                <h3 className="text-2xl font-bold">La Flecha</h3>
              </div>
              <p className="text-gray-400">
                Joyería de lujo que combina tradición y modernidad para crear piezas únicas que duran para siempre.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-gray-400">
                <p>📍 a 18-121, Cra. 20 #181, Zaragoza, Antioquia</p>
                <p>📞 +57 321 6414607</p>
                <p>✉️ info@laflecha.com</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Horarios</h4>
              <div className="space-y-2 text-gray-400">
                <p>Lunes - Viernes: 7:30 am - 7:30 pm</p>
                <p>Sábado: 8:00 am - 7:30 pm</p>
                <p>Domingo: 8:30 am - 6:30 pm</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 La Flecha. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer;