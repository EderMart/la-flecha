// ProductContext.js - REEMPLAZA COMPLETAMENTE tu archivo actual
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase"; // ⚠️ revisa que la ruta sea correcta

const ProductContext = createContext();

// ✅ Datos iniciales (si Firebase está vacío)
const INITIAL_PRODUCTS = {
  anillos: [
    {
      id: 1,
      titulo: "Anillo de Compromiso Diamante",
      precio: "$2,500",
      descripcion:
        "Hermoso anillo de compromiso con diamante central de 1 quilate, engastado en oro blanco de 18k. Diseño clásico y elegante.",
      imagen:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      titulo: "Anillo de Oro Rosa",
      precio: "$1,800",
      descripcion:
        "Anillo moderno de oro rosa de 14k con detalles únicos. Perfecto para uso diario con un toque de elegancia.",
      imagen:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
    },
  ],
  collares: [
    {
      id: 3,
      titulo: "Collar de Perlas Clásico",
      precio: "$1,200",
      descripcion:
        "Collar de perlas naturales cultivadas, con broche de oro amarillo. Elegancia atemporal para ocasiones especiales.",
      imagen:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      titulo: "Collar con Colgante Corazón",
      precio: "$950",
      descripcion:
        "Delicado collar de oro blanco con colgante en forma de corazón adornado con pequeños diamantes.",
      imagen:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
    },
  ],
  aretes: [
    {
      id: 5,
      titulo: "Aretes de Diamante",
      precio: "$3,200",
      descripcion:
        "Aretes de presión con diamantes de corte redondo, engastados en oro blanco de 18k. Brillo excepcional.",
      imagen:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
    },
    {
      id: 6,
      titulo: "Aretes Colgantes Plata",
      precio: "$480",
      descripcion:
        "Aretes colgantes de plata esterlina 925 con diseño geométrico moderno. Livianos y cómodos.",
      imagen:
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
    },
  ],
  pulseras: [
    {
      id: 7,
      titulo: "Pulsera Tennis Diamantes",
      precio: "$4,500",
      descripcion:
        "Pulsera tennis con diamantes engastados en oro blanco. Diseño clásico que nunca pasa de moda.",
      imagen:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
    },
    {
      id: 8,
      titulo: "Pulsera de Oro Amarillo",
      precio: "$1,350",
      descripcion:
        "Pulsera de eslabones de oro amarillo de 14k. Perfecta para combinar con otras joyas.",
      imagen:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
    },
  ],
};

// ✅ Inicial vacío para disponibles
const INITIAL_AVAILABLE_PRODUCTS = {
  anillos: [],
  collares: [],
  aretes: [],
  pulseras: [],
};

export const ProductProvider = ({ children }) => {
  const [productos, setProductos] = useState(INITIAL_PRODUCTS);
  const [productosDisponibles, setProductosDisponibles] = useState(
    INITIAL_AVAILABLE_PRODUCTS
  );
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // 📥 Cargar productos y disponibles desde Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const categories = ["anillos", "collares", "aretes", "pulseras"];
        const productData = {};
        const availableData = {};

        for (const category of categories) {
          // --- Productos terminados
          const querySnapshot = await getDocs(collection(db, category));
          if (querySnapshot.empty) {
            productData[category] = INITIAL_PRODUCTS[category];
            await initializeFirebaseData(category, INITIAL_PRODUCTS[category]);
          } else {
            productData[category] = querySnapshot.docs.map((d) => {
              const data = d.data() || {};
              return {
                ...data,
                id: parseInt(d.id, 10),
                precio: typeof data.precio === 'number' ? data.precio : parsePrecioInput(data.precio),
              };
            });
          }

          // --- Productos disponibles
          // --- Productos disponibles
const availableSnapshot = await getDocs(
  collection(db, `disponibles_${category}`)
);

availableData[category] = availableSnapshot.docs.map((d) => {
  const data = d.data() || {};
  return {
    ...data,
    id: parseInt(d.id, 10),
    precio: typeof data.precio === 'number'
      ? data.precio
      : parsePrecioInput(data.precio),
  };
});


        }

        setProductos(productData);
        setProductosDisponibles(availableData);

        // --- Última actualización
        try {
          const metaSnapshot = await getDocs(collection(db, "meta"));
          if (!metaSnapshot.empty) {
            const metaDoc = metaSnapshot.docs[0];
            setLastUpdated(metaDoc.data().lastUpdated);
          }
        } catch (error) {
          console.log("No hay datos de meta:", error);
        }
      } catch (error) {
        console.error("Error cargando productos:", error);
        setProductos(INITIAL_PRODUCTS);
        setProductosDisponibles(INITIAL_AVAILABLE_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // 📡 Escuchar cambios en tiempo real
  useEffect(() => {
    const categories = ["anillos", "collares", "aretes", "pulseras"];
    const unsubscribes = [];

    categories.forEach((category) => {
      // --- Listener productos
      const unsubProductos = onSnapshot(
        collection(db, category),
        (snapshot) => {
          const categoryProducts = snapshot.docs.map((d) => {
            const data = d.data() || {};
            return {
              ...data,
              id: parseInt(d.id, 10),
              precio: typeof data.precio === 'number' ? data.precio : parsePrecioInput(data.precio),
            };
          });
          setProductos((prev) => ({ ...prev, [category]: categoryProducts }));
          setProductos((prev) => ({
            ...prev,
            [category]: categoryProducts,
          }));
        },
        (error) => console.error(`Error escuchando ${category}:`, error)
      );

      // --- Listener disponibles
      const unsubDisponibles = onSnapshot(
        collection(db, `disponibles_${category}`),
        (snapshot) => {
          const categoryProducts = snapshot.docs.map((doc) => ({
            id: parseInt(doc.id),
            ...doc.data(),
          }));
          setProductosDisponibles((prev) => ({ ...prev, [category]: categoryProducts }));

        },
        (error) => console.error(`Error escuchando disponibles_${category}:`, error)
      );

      unsubscribes.push(unsubProductos, unsubDisponibles);
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, []);

  // 🔧 Funciones auxiliares
  const initializeFirebaseData = async (category, products) => {
    try {
      for (const product of products) {
        await setDoc(doc(db, category, product.id.toString()), {
          titulo: product.titulo,
          precio: product.precio,
          descripcion: product.descripcion,
          imagen: product.imagen,
        });
      }
    } catch (error) {
      console.error(`Error inicializando ${category}:`, error);
    }
  };

  const markLastUpdated = async () => {
    try {
      const timestamp = Date.now();
      await setDoc(doc(db, "meta", "lastUpdate"), { lastUpdated: timestamp });
      setLastUpdated(timestamp);
    } catch (error) {
      console.error("Error actualizando timestamp:", error);
    }
  };

  const getNextId = () => {
    let maxId = 0;
    Object.values(productos).forEach((categoryProducts) => {
      categoryProducts.forEach((product) => {
        if (product.id > maxId) maxId = product.id;
      });
    });
    return maxId + 1;
  };

  // helper: limpiar/parsear precio que puede venir con puntos (1.000.000) o comas (1,000.00)
  const parsePrecioInput = (precio) => {
    if (precio == null) return 0;
    if (typeof precio === 'number') return precio;
    const s = String(precio).trim();
    // quitar espacios, quitar puntos de miles, cambiar coma decimal por punto
    const cleaned = s.replace(/\s/g, '').replace(/\./g, '').replace(/,/g, '.');
    const n = Number(cleaned);
    if (Number.isFinite(n)) return n;
    // fallback: extraer solo dígitos, punto y guion
    const digits = s.replace(/[^\d\.-]/g, '');
    const n2 = Number(digits);
    return Number.isFinite(n2) ? n2 : 0;
  };



  // CRUD productos terminados
  const addProduct = async (categoria, newProduct) => {
    const id = newProduct.id.toString();
    const precioNumber = parsePrecioInput(newProduct.precio);
    console.log('addProduct payload', { id, titulo: newProduct.titulo, precio: precioNumber });
    await setDoc(doc(db, categoria, id), {
      id,
      titulo: newProduct.titulo,
      precio: precioNumber,
      descripcion: newProduct.descripcion,
      imagen: newProduct.imagen,
    }, { merge: true }); // merge por seguridad si por alguna razón el doc no existiera
    await markLastUpdated();
  };


  const updateProduct = async (categoria, updatedProduct) => {
    const id = updatedProduct.id.toString();
    const precioNumber = parsePrecioInput(updatedProduct.precio);
    await setDoc(doc(db, categoria, id), {
      id,
      titulo: updatedProduct.titulo,
      precio: precioNumber,
      descripcion: updatedProduct.descripcion,
      imagen: updatedProduct.imagen,
    }, { merge: true });
    await markLastUpdated();
  };


  const deleteProduct = async (categoria, id) => {
    try {
      await deleteDoc(doc(db, categoria, id.toString()));
      await markLastUpdated();
    } catch (error) {
      console.error(`Error eliminando producto ${id} en ${categoria}:`, error);
    }
  };

  // CRUD productos disponibles
  const addProductoDisponible = async (categoria, newProduct) => {
    const id = newProduct.id.toString();
    const precioNumber = parsePrecioInput(newProduct.precio);
    await setDoc(doc(db, `disponibles_${categoria}`, id), {
      id,
      titulo: newProduct.titulo,
      precio: precioNumber,
      descripcion: newProduct.descripcion,
      imagen: newProduct.imagen,
    }, { merge: true });
    await markLastUpdated();
  };

  const updateProductoDisponible = async (categoria, updatedProduct) => {
    const id = updatedProduct.id.toString();
    const precioNumber = parsePrecioInput(updatedProduct.precio);
    await setDoc(doc(db, `disponibles_${categoria}`, id), {
      id,
      titulo: updatedProduct.titulo,
      precio: precioNumber,
      descripcion: updatedProduct.descripcion,
      imagen: updatedProduct.imagen,
    }, { merge: true });
    await markLastUpdated();
  };


  const deleteProductoDisponible = async (categoria, id) => {
    try {
      await deleteDoc(doc(db, `disponibles_${categoria}`, id.toString()));
      await markLastUpdated();
    } catch (error) {
      console.error(`Error eliminando producto disponible ${id} en ${categoria}:`, error);
    }
  };

  // 📤 Backup / Import / Reset
  const exportProducts = () => {
    return JSON.stringify(
      { productos, productosDisponibles, timestamp: Date.now(), version: "2.0" },
      null,
      2
    );
  };

  const importProducts = async (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (!data.productos) throw new Error("Formato inválido");

      await resetProducts();
      for (const [category, products] of Object.entries(data.productos)) {
        for (const product of products) {
          await setDoc(doc(db, category, product.id.toString()), {
            titulo: product.titulo,
            precio: product.precio,
            descripcion: product.descripcion,
            imagen: product.imagen,
          });
        }
      }
      await markLastUpdated();
      return true;
    } catch (error) {
      console.error("Error importando datos:", error);
      return false;
    }
  };

  const resetProducts = async () => {
    const categories = ["anillos", "collares", "aretes", "pulseras"];
    for (const category of categories) {
      const querySnapshot = await getDocs(collection(db, category));
      await Promise.all(querySnapshot.docs.map((doc) => deleteDoc(doc.ref)));
      await initializeFirebaseData(category, INITIAL_PRODUCTS[category]);
    }
    await markLastUpdated();
  };

  const clearLocalStorage = async () => {
    await resetProducts();
    try {
      await deleteDoc(doc(db, "meta", "lastUpdate"));
    } catch (_) { }
    setLastUpdated(null);
  };

  const getStats = () => {
    const totalProducts = Object.values(productos).reduce(
      (total, categoryProducts) => total + categoryProducts.length,
      0
    );
    return {
      totalProducts,
      lastUpdated: lastUpdated ? new Date(lastUpdated).toISOString() : "Nunca",
    };
  };

  const contextValue = {
    productos,
    productosDisponibles,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    addProductoDisponible,
    updateProductoDisponible,
    deleteProductoDisponible,
    getNextId,
    resetProducts,
    exportProducts,
    importProducts,
    clearLocalStorage,
    getStats,
    markLastUpdated,
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
  if (!context)
    throw new Error("useProducts debe ser usado dentro de ProductProvider");
  return context;
};
