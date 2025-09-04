import React, { createContext, useContext, useState, useEffect } from 'react';

// Datos iniciales de productos
const initialProducts = {
  anillos: [
    {
      id: 1,
      imagen: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
      titulo: "Anillo Solitario Diamante",
      precio: "$2,500",
      descripcion: "Elegante anillo solitario con diamante de 1 quilate, montado en oro blanco de 18k. Perfecto para compromiso."
    },
    {
      id: 2,
      imagen: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
      titulo: "Anillo Vintage Oro Rosa",
      precio: "$1,800",
      descripcion: "Anillo vintage con detalles florales en oro rosa de 14k, adornado con pequeños diamantes."
    },
    {
      id: 3,
      imagen: "https://images.unsplash.com/photo-1525251991900-cb6a5cd44403?w=400&h=400&fit=crop",
      titulo: "Anillo Moderno Geométrico",
      precio: "$1,200",
      descripcion: "Diseño contemporáneo con líneas geométricas en oro amarillo de 18k."
    }
  ],
  collares: [
    {
      id: 4,
      imagen: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
      titulo: "Collar Perlas Naturales",
      precio: "$3,200",
      descripcion: "Collar de perlas naturales de agua dulce con broche de oro blanco y diamantes."
    },
    {
      id: 5,
      imagen: "https://images.unsplash.com/photo-1611652022313-8b5e84c9497e?w=400&h=400&fit=crop",
      titulo: "Collar Cadena Oro",
      precio: "$1,500",
      descripcion: "Elegante cadena de oro amarillo de 18k con eslabones clásicos, longitud 45cm."
    },
    {
      id: 6,
      imagen: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
      titulo: "Collar Colgante Corazón",
      precio: "$980",
      descripcion: "Delicado colgante en forma de corazón con incrustaciones de diamantes pequeños."
    }
  ],
  aretes: [
    {
      id: 7,
      imagen: "https://images.unsplash.com/photo-1635767582909-864bb5d45b97?w=400&h=400&fit=crop",
      titulo: "Aretes Largos Elegantes",
      precio: "$2,100",
      descripcion: "Aretes largos con cristales Swarovski y oro blanco de 18k, perfectos para ocasiones especiales."
    },
    {
      id: 8,
      imagen: "https://images.unsplash.com/photo-1588444837495-c6cfbd87c36e?w=400&h=400&fit=crop",
      titulo: "Aretes Perla Clásicos",
      precio: "$1,300",
      descripcion: "Aretes de perla cultivada con montura de oro amarillo, diseño clásico y atemporal."
    },
    {
      id: 9,
      imagen: "https://images.unsplash.com/photo-1596944946170-0b067039e5a5?w=400&h=400&fit=crop",
      titulo: "Aretes Modernos Geométricos",
      precio: "$890",
      descripcion: "Diseño contemporáneo con formas geométricas en oro rosa de 14k."
    }
  ],
  pulseras: [
    {
      id: 10,
      imagen: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
      titulo: "Pulsera Tenis Diamantes",
      precio: "$4,500",
      descripcion: "Pulsera tipo tenis con diamantes de alta calidad engarzados en oro blanco de 18k."
    },
    {
      id: 11,
      imagen: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
      titulo: "Pulsera Eslabones Oro",
      precio: "$1,900",
      descripcion: "Pulsera de eslabones gruesos en oro amarillo de 18k, diseño robusto y elegante."
    },
    {
      id: 12,
      imagen: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
      titulo: "Pulsera Charm Vintage",
      precio: "$1,400",
      descripcion: "Pulsera vintage con múltiples charms en oro rosa, cada uno con su propia historia."
    }
  ]
};

// Clave para localStorage
const STORAGE_KEY = 'laflecha_productos';

// Crear el contexto
const ProductContext = createContext();

// Hook personalizado para usar el contexto
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }
  return context;
};

// Función para cargar productos desde localStorage
const loadProductsFromStorage = () => {
  try {
    const savedProducts = localStorage.getItem(STORAGE_KEY);
    if (savedProducts) {
      const parsed = JSON.parse(savedProducts);
      // Validar que tiene la estructura correcta
      if (parsed && typeof parsed === 'object' && 
          parsed.anillos && parsed.collares && parsed.aretes && parsed.pulseras) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error al cargar productos desde localStorage:', error);
  }
  return initialProducts;
};

// Función para guardar productos en localStorage
const saveProductsToStorage = (productos) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
  } catch (error) {
    console.error('Error al guardar productos en localStorage:', error);
  }
};

// Proveedor del contexto
export const ProductProvider = ({ children }) => {
  const [productos, setProductos] = useState(() => loadProductsFromStorage());

  // Guardar en localStorage cada vez que cambien los productos
  useEffect(() => {
    saveProductsToStorage(productos);
  }, [productos]);

  // Función para actualizar un producto
  const updateProduct = (categoria, updatedProduct) => {
    setProductos(prev => {
      const updated = { ...prev };
      const categoryProducts = [...updated[categoria]];
      const productIndex = categoryProducts.findIndex(p => p.id === updatedProduct.id);
      
      if (productIndex !== -1) {
        categoryProducts[productIndex] = updatedProduct;
        updated[categoria] = categoryProducts;
      }
      
      return updated;
    });
  };

  // Función para eliminar un producto
  const deleteProduct = (categoria, id) => {
    setProductos(prev => ({
      ...prev,
      [categoria]: prev[categoria].filter(p => p.id !== id)
    }));
  };

  // Función para agregar un nuevo producto
  const addProduct = (categoria, newProduct) => {
    setProductos(prev => ({
      ...prev,
      [categoria]: [...prev[categoria], newProduct]
    }));
  };

  // Función para obtener el siguiente ID disponible
  const getNextId = () => {
    const allProducts = Object.values(productos).flat();
    return Math.max(...allProducts.map(p => p.id), 0) + 1;
  };

  // Función para restaurar productos iniciales (útil para reset)
  const resetProducts = () => {
    setProductos(initialProducts);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Función para exportar productos (útil para backup)
  const exportProducts = () => {
    return JSON.stringify(productos, null, 2);
  };

  // Función para importar productos (útil para restore)
  const importProducts = (productData) => {
    try {
      const parsed = JSON.parse(productData);
      if (parsed && typeof parsed === 'object' && 
          parsed.anillos && parsed.collares && parsed.aretes && parsed.pulseras) {
        setProductos(parsed);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al importar productos:', error);
      return false;
    }
  };

  const value = {
    productos,
    updateProduct,
    deleteProduct,
    addProduct,
    getNextId,
    resetProducts,
    exportProducts,
    importProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};