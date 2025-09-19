import { Routes, Route } from 'react-router-dom';
import LaFlecha from './components/LaFlecha';
import AdministrationPanel from './components/AdministrationPanel';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        {/* Ruta principal con Header, LaFlecha y Footer */}
        <Route 
          path="/" 
          element={
            <>
              <Header />
              <main className="flex-grow">
                <LaFlecha />
              </main>
              <Footer />
            </>
          } 
        />
        
        {/* Ruta del admin sin Header ni Footer */}
        <Route 
          path="/AdministrationPanel" 
          element={
            <div className="min-h-screen">
              <AdministrationPanel />
            </div>
          } 
        />
        
        {/* Aquí puedes agregar más rutas en el futuro */}
        {/* <Route path="/productos" element={<><Header /><Productos /><Footer /></>} /> */}
        {/* <Route path="/contacto" element={<><Header /><Contacto /><Footer /></>} /> */}
      </Routes>
    </div>
  );
}

export default App;