import React from 'react'

export const Footer = () => {
  return (
    <footer id='Footer' className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">⟡</span>
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
                <p>📍 Av. Principal 123, Centro</p>
                <p>📞 +52 (555) 123-4567</p>
                <p>✉️ info@laflecha.com</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Horarios</h4>
              <div className="space-y-2 text-gray-400">
                <p>Lunes - Viernes: 9:00 - 19:00</p>
                <p>Sábado: 10:00 - 18:00</p>
                <p>Domingo: 11:00 - 16:00</p>
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