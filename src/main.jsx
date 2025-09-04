import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Admin from './components/Admin.jsx'
import { ProductProvider } from './components/ProductContext.jsx'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProductProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta principal con Header, App y Footer */}
          <Route 
            path="/*" 
            element={
              <>
                <Header className="z-50 w-full"/>
                <App />
                <Footer/>
              </>
            } 
          />
          
          {/* Ruta del admin sin Header ni Footer */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </ProductProvider>
  </React.StrictMode>
);