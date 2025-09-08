import { Routes, Route } from 'react-router-dom';
import LaFlecha from './components/LaFlecha'; // Mueve tu componente actual a este archivo
import AdministrationPanel from './components/AdministrationPanel';


function App() {
  return (
    <Routes>
      <Route path="/" element={<LaFlecha />} />
      <Route path="/AdministrationPanel" element={<AdministrationPanel />} /> {/* Agregar esta línea */}
      {/* Aquí puedes agregar más rutas en el futuro */}
      {/* <Route path="/productos" element={<Productos />} /> */}
      {/* <Route path="/contacto" element={<Contacto />} /> */}
    </Routes>
  );
}

export default App;