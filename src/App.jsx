import { Routes, Route } from 'react-router-dom';
import LaFlecha from './components/LaFlecha'; // Mueve tu componente actual a este archivo

function App() {
  return (
    <Routes>
      <Route path="/" element={<LaFlecha />} />
      {/* Aquí puedes agregar más rutas en el futuro */}
      {/* <Route path="/productos" element={<Productos />} /> */}
      {/* <Route path="/contacto" element={<Contacto />} /> */}
    </Routes>
  );
}

export default App;