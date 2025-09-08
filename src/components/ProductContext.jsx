// ProductContext.js - REEMPLAZA COMPLETAMENTE tu archivo actual
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  updateDoc,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../firebase'; // Asegúrate de que la ruta sea correcta

const ProductContext = createContext();

// Datos iniciales (solo se usan si no hay datos en Firebase)
const INITIAL_PRODUCTS = {
  anillos: [
    {
      id: 1,
      titulo: "Anillo de Compromiso Diamante",
      precio: "$2,500",
      descripcion: "Hermoso anillo de compromiso con diamante central de 1 quilate, engastado en oro blanco de 18k. Diseño clásico y elegante.",
      imagen: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      titulo: "Anillo de Oro Rosa",
      precio: "$1,800",
      descripcion: "Anillo moderno de oro rosa de 14k con detalles únicos. Perfecto para uso diario con un toque de elegancia.",
      imagen: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop"
    }
  ],
  collares: [
    {
      id: 3,
      titulo: "Collar de Perlas Clásico",
      precio: "$1,200",
      descripcion: "Collar de perlas naturales cultivadas, con broche de oro amarillo. Elegancia atemporal para ocasiones especiales.",
      imagen: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop"
    },
    {
      id: 4,
      titulo: "Collar con Colgante Corazón",
      precio: "$950",
      descripcion: "Delicado collar de oro blanco con colgante en forma de corazón adornado con pequeños diamantes.",
      imagen: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop"
    }
  ],
  aretes: [
    {
      id: 5,
      titulo: "Aretes de Diamante",
      precio: "$3,200",
      descripcion: "Aretes de presión con diamantes de corte redondo, engastados en oro blanco de 18k. Brillo excepcional.",
      imagen: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop"
    },
    {
      id: 6,
      titulo: "Aretes Colgantes Plata",
      precio: "$480",
      descripcion: "Aretes colgantes de plata esterlina 925 con diseño geométrico moderno. Livianos y cómodos.",
      imagen: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop"
    }
  ],
  pulseras: [
    {
      id: 7,
      titulo: "Pulsera Tennis Diamantes",
      precio: "$4,500",
      descripcion: "Pulsera tennis con diamantes engastados en oro blanco. Diseño clásico que nunca pasa de moda.",
      imagen: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop"
    },
    {
      id: 8,
      titulo: "Pulsera de Oro Amarillo",
      precio: "$1,350",
      descripcion: "Pulsera de eslabones de oro amarillo de 14k. Perfecta para combinar con otras joyas.",
      imagen: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop"
    }
  ]
};

export const ProductProvider = ({ children }) => {
  const [productos, setProductos] = useState(INITIAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Cargar productos desde Firebase al iniciar
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const categories = ['anillos', 'collares', 'aretes', 'pulseras'];
        const productData = {};
        
        for (const category of categories) {
          const querySnapshot = await getDocs(collection(db, category));
          if (querySnapshot.empty) {
            // Si no hay datos en Firebase, usar datos iniciales
            productData[category] = INITIAL_PRODUCTS[category];
            // Guardar datos iniciales en Firebase
            await initializeFirebaseData(category, INITIAL_PRODUCTS[category]);
          } else {
            // Cargar datos existentes
            productData[category] = querySnapshot.docs.map(doc => ({
              id: parseInt(doc.id),
              ...doc.data()
            }));
          }
        }
        
        setProductos(productData);
        
        // Cargar timestamp de última actualización
        try {
          const metaSnapshot = await getDocs(collection(db, 'meta'));
          if (!metaSnapshot.empty) {
            const metaDoc = metaSnapshot.docs[0];
            setLastUpdated(metaDoc.data().lastUpdated);
          }
        } catch (error) {
          console.log('No hay datos de meta:', error);
        }
        
      } catch (error) {
        console.error('Error cargando productos:', error);
        // En caso de error, usar datos iniciales
        setProductos(INITIAL_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Escuchar cambios en tiempo real
  useEffect(() => {
    const categories = ['anillos', 'collares', 'aretes', 'pulseras'];
    const unsubscribes = [];

    categories.forEach(category => {
      const unsubscribe = onSnapshot(
        collection(db, category),
        (snapshot) => {
          const categoryProducts = snapshot.docs.map(doc => ({
            id: parseInt(doc.id),
            ...doc.data()
          }));
          
          setProductos(prev => ({
            ...prev,
            [category]: categoryProducts
          }));
        },
        (error) => {
          console.error(`Error escuchando ${category}:`, error);
        }
      );
      
      unsubscribes.push(unsubscribe);
    });

    // Cleanup
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  // Inicializar datos en Firebase
  const initializeFirebaseData = async (category, products) => {
    try {
      for (const product of products) {
        await setDoc(doc(db, category, product.id.toString()), {
          titulo: product.titulo,
          precio: product.precio,
          descripcion: product.descripcion,
          imagen: product.imagen
        });
      }
    } catch (error) {
      console.error(`Error inicializando ${category}:`, error);
    }
  };

  // Actualizar timestamp
  const markLastUpdated = async () => {
    try {
      const timestamp = Date.now();
      await setDoc(doc(db, 'meta', 'lastUpdate'), {
        lastUpdated: timestamp
      });
      setLastUpdated(timestamp);
    } catch (error) {
      console.error('Error actualizando timestamp:', error);
    }
  };

  // Obtener siguiente ID disponible
  const getNextId = () => {
    let maxId = 0;
    Object.values(productos).forEach(categoryProducts => {
      categoryProducts.forEach(product => {
        if (product.id > maxId) {
          maxId = product.id;
        }
      });
    });
    return maxId + 1;
  };

  // Actualizar producto
  const updateProduct = async (categoria, updatedProduct) => {
    try {
      await updateDoc(doc(db, categoria, updatedProduct.id.toString()), {
        titulo: updatedProduct.titulo,
        precio: updatedProduct.precio,
        descripcion: updatedProduct.descripcion,
        imagen: updatedProduct.imagen
      });

      // El listener onSnapshot se encargará de actualizar el estado
      await markLastUpdated();
      
    } catch (error) {
      console.error('Error actualizando producto:', error);
      throw error;
    }
  };

  // Eliminar producto
  const deleteProduct = async (categoria, id) => {
    try {
      await deleteDoc(doc(db, categoria, id.toString()));
      
      // El listener onSnapshot se encargará de actualizar el estado
      await markLastUpdated();
      
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw error;
    }
  };

  // Agregar producto
  const addProduct = async (categoria, newProduct) => {
    try {
      await setDoc(doc(db, categoria, newProduct.id.toString()), {
        titulo: newProduct.titulo,
        precio: newProduct.precio,
        descripcion: newProduct.descripcion,
        imagen: newProduct.imagen
      });

      // El listener onSnapshot se encargará de actualizar el estado
      await markLastUpdated();
      
    } catch (error) {
      console.error('Error agregando producto:', error);
      throw error;
    }
  };

  // Exportar productos (para backup)
  const exportProducts = () => {
    const exportData = {
      productos,
      timestamp: Date.now(),
      version: '2.0'
    };
    return JSON.stringify(exportData, null, 2);
  };

  // Importar productos
  const importProducts = async (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.productos) {
        throw new Error('Formato de datos inválido');
      }

      // Limpiar todas las colecciones existentes
      await resetProducts();
      
      // Importar nuevos datos
      for (const [category, products] of Object.entries(data.productos)) {
        for (const product of products) {
          await setDoc(doc(db, category, product.id.toString()), {
            titulo: product.titulo,
            precio: product.precio,
            descripcion: product.descripcion,
            imagen: product.imagen
          });
        }
      }

      await markLastUpdated();
      return true;
      
    } catch (error) {
      console.error('Error importando datos:', error);
      return false;
    }
  };

  // Resetear productos a valores iniciales
  const resetProducts = async () => {
    try {
      const categories = ['anillos', 'collares', 'aretes', 'pulseras'];
      
      // Limpiar todas las colecciones
      for (const category of categories) {
        const querySnapshot = await getDocs(collection(db, category));
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        
        // Restaurar datos iniciales
        await initializeFirebaseData(category, INITIAL_PRODUCTS[category]);
      }

      await markLastUpdated();
      
    } catch (error) {
      console.error('Error reseteando productos:', error);
      throw error;
    }
  };

  // Limpiar almacenamiento (equivalente a localStorage.clear())
  const clearLocalStorage = async () => {
    try {
      await resetProducts();
      
      // Limpiar meta data
      try {
        await deleteDoc(doc(db, 'meta', 'lastUpdate'));
      } catch (error) {
        // No importa si no existe
      }
      
      setLastUpdated(null);
      
    } catch (error) {
      console.error('Error limpiando datos:', error);
      throw error;
    }
  };

  // Obtener estadísticas
  const getStats = () => {
    const totalProducts = Object.values(productos).reduce(
      (total, categoryProducts) => total + categoryProducts.length, 
      0
    );

    const categoriesCount = Object.entries(productos).map(([category, products]) => ({
      category,
      count: products.length
    }));

    return {
      totalProducts,
      categoriesCount,
      lastUpdated: lastUpdated ? new Date(lastUpdated).toISOString() : 'Nunca'
    };
  };

  const contextValue = {
    productos,
    isLoading,
    updateProduct,
    deleteProduct,
    addProduct,
    getNextId,
    resetProducts,
    exportProducts,
    importProducts,
    clearLocalStorage,
    getStats,
    markLastUpdated
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

// Hook personalizado
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe ser usado dentro de ProductProvider');
  }
  return context;
};