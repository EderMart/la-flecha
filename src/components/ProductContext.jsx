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
  addDoc,
  orderBy,
  query,
  limit,
  Timestamp  // ← Agregar esta importación
} from "firebase/firestore";
import { db } from "../../firebase"; // ⚠️ revisa que la ruta sea correcta

const ProductContext = createContext();

// ✅ Datos iniciales (si Firebase está vacío)
const INITIAL_PRODUCTS = {
  anillos: [],
  collares: [],
  aretes: [],
  pulseras: [],
};

// ✅ Inicial vacío para disponibles
const INITIAL_AVAILABLE_PRODUCTS = {
  anillos: [],
  collares: [],
  aretes: [],
  pulseras: [],
};

// ✅ Testimonios iniciales de ejemplo
const INITIAL_TESTIMONIALS = [];

export const ProductProvider = ({ children }) => {
  const [productos, setProductos] = useState(INITIAL_PRODUCTS);
  const [productosDisponibles, setProductosDisponibles] = useState(
    INITIAL_AVAILABLE_PRODUCTS
  );
  const [testimonios, setTestimonios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // 🔥 Cargar productos, disponibles y testimonios desde Firebase
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
                // Asegurar compatibilidad con versiones antiguas
                imagenes: data.imagenes || (data.imagen ? [data.imagen] : [])
              };
            });
          }

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
              // Asegurar compatibilidad con versiones antiguas
              imagenes: data.imagenes || (data.imagen ? [data.imagen] : [])
            };
          });
        }

        // --- Cargar testimonios
        await loadTestimonials();

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
        setTestimonios(INITIAL_TESTIMONIALS);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // 📡 Función para cargar testimonios
  const loadTestimonials = async () => {
    try {
      const testimonialsRef = collection(db, "testimonios");
      const q = query(
        testimonialsRef,
        orderBy("fecha", "desc"),
        limit(20)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Inicializar con testimonios de ejemplo si no hay ninguno
        await initializeTestimonials();
        setTestimonios(INITIAL_TESTIMONIALS);
      } else {
        const testimoniosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTestimonios(testimoniosData);
      }
    } catch (error) {
      console.error("Error cargando testimonios:", error);
      setTestimonios(INITIAL_TESTIMONIALS);
    }
  };

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
            // Asegurar compatibilidad con versiones antiguas
            imagenes: data.imagenes || (data.imagen ? [data.imagen] : [])
          };
        });
        setProductos((prev) => ({ ...prev, [category]: categoryProducts }));
      },
      (error) => console.error(`Error escuchando ${category}:`, error)
    );

    // --- Listener disponibles
    const unsubDisponibles = onSnapshot(
      collection(db, `disponibles_${category}`),
      (snapshot) => {
        const categoryProducts = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: parseInt(doc.id),
            ...data,
            // Asegurar compatibilidad con versiones antiguas
            imagenes: data.imagenes || (data.imagen ? [data.imagen] : [])
          };
        });
        setProductosDisponibles((prev) => ({ ...prev, [category]: categoryProducts }));
      },
      (error) => console.error(`Error escuchando disponibles_${category}:`, error)
    );

    unsubscribes.push(unsubProductos, unsubDisponibles);
  });

    // --- Listener testimonios
    const testimonialsRef = collection(db, "testimonios");
  const q = query(testimonialsRef, orderBy("fecha", "desc"), limit(20));
  
  const unsubTestimonials = onSnapshot(
    q,
    (snapshot) => {
      const testimoniosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTestimonios(testimoniosData);
    },
    (error) => console.error("Error escuchando testimonios:", error)
  );

  unsubscribes.push(unsubTestimonials);

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
          material: product.material || "",
          peso: product.peso || "",
          tamano: product.tamano || "",
        });
      }
    } catch (error) {
      console.error(`Error inicializando ${category}:`, error);
    }
  };

  const initializeTestimonials = async () => {
    try {
      for (const testimonial of INITIAL_TESTIMONIALS) {
        await setDoc(doc(db, "testimonios", testimonial.id), testimonial);
      }
    } catch (error) {
      console.error("Error inicializando testimonios:", error);
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

    // Procesar imágenes
    let imagenesArray = [];
    if (newProduct.imagenes && Array.isArray(newProduct.imagenes)) {
      imagenesArray = newProduct.imagenes.filter(img => img && img.trim());
    } else if (newProduct.imagen && newProduct.imagen.trim()) {
      imagenesArray = [newProduct.imagen.trim()];
    }

    const imagenPrincipal = imagenesArray[0] || newProduct.imagen || '';

    console.log('addProduct payload', {
      id,
      titulo: newProduct.titulo,
      precio: precioNumber,
      imagenes: imagenesArray,
      imagen: imagenPrincipal
    });

    await setDoc(doc(db, categoria, id), {
      id,
      titulo: newProduct.titulo,
      precio: precioNumber,
      descripcion: newProduct.descripcion,
      imagen: imagenPrincipal,
      imagenes: imagenesArray, // Agregar el array de imágenes
      material: newProduct.material || "",
      peso: newProduct.peso || "",
      tamano: newProduct.tamano || "",
    }, { merge: true });
    await markLastUpdated();
  };

  const updateProduct = async (categoria, updatedProduct) => {
    const id = updatedProduct.id.toString();
    const precioNumber = parsePrecioInput(updatedProduct.precio);

    // Procesar imágenes
    let imagenesArray = [];
    if (updatedProduct.imagenes && Array.isArray(updatedProduct.imagenes)) {
      imagenesArray = updatedProduct.imagenes.filter(img => img && img.trim());
    } else if (updatedProduct.imagen && updatedProduct.imagen.trim()) {
      imagenesArray = [updatedProduct.imagen.trim()];
    }

    const imagenPrincipal = imagenesArray[0] || updatedProduct.imagen || '';

    await setDoc(doc(db, categoria, id), {
      id,
      titulo: updatedProduct.titulo,
      precio: precioNumber,
      descripcion: updatedProduct.descripcion,
      imagen: imagenPrincipal,
      imagenes: imagenesArray, // Agregar el array de imágenes
      material: updatedProduct.material || "",
      peso: updatedProduct.peso || "",
      tamano: updatedProduct.tamano || "",
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

    // Procesar imágenes
    let imagenesArray = [];
    if (newProduct.imagenes && Array.isArray(newProduct.imagenes)) {
      imagenesArray = newProduct.imagenes.filter(img => img && img.trim());
    } else if (newProduct.imagen && newProduct.imagen.trim()) {
      imagenesArray = [newProduct.imagen.trim()];
    }

    const imagenPrincipal = imagenesArray[0] || newProduct.imagen || '';

    await setDoc(doc(db, `disponibles_${categoria}`, id), {
      id,
      titulo: newProduct.titulo,
      precio: precioNumber,
      descripcion: newProduct.descripcion,
      imagen: imagenPrincipal,
      imagenes: imagenesArray, // Agregar el array de imágenes
      material: newProduct.material || "",
      peso: newProduct.peso || "",
      tamano: newProduct.tamano || "",
    }, { merge: true });
    await markLastUpdated();
  };


  const updateProductoDisponible = async (categoria, updatedProduct) => {
    const id = updatedProduct.id.toString();
    const precioNumber = parsePrecioInput(updatedProduct.precio);

    // Procesar imágenes
    let imagenesArray = [];
    if (updatedProduct.imagenes && Array.isArray(updatedProduct.imagenes)) {
      imagenesArray = updatedProduct.imagenes.filter(img => img && img.trim());
    } else if (updatedProduct.imagen && updatedProduct.imagen.trim()) {
      imagenesArray = [updatedProduct.imagen.trim()];
    }

    const imagenPrincipal = imagenesArray[0] || updatedProduct.imagen || '';

    await setDoc(doc(db, `disponibles_${categoria}`, id), {
      id,
      titulo: updatedProduct.titulo,
      precio: precioNumber,
      descripcion: updatedProduct.descripcion,
      imagen: imagenPrincipal,
      imagenes: imagenesArray, // Agregar el array de imágenes
      material: updatedProduct.material || "",
      peso: updatedProduct.peso || "",
      tamano: updatedProduct.tamano || "",
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

  // CRUD Testimonios
  const addTestimonio = async (testimonioData) => {
    try {
      const nuevoTestimonio = {
        nombre: testimonioData.nombre,
        testimonio: testimonioData.testimonio,
        calificacion: testimonioData.calificacion || 5,
        imagen: testimonioData.imagen || "/api/placeholder/60/60",
        fecha: Timestamp.now(),
        producto: testimonioData.producto || "",
        verificado: testimonioData.verificado || false,
        mostrar: testimonioData.mostrar !== false,
        telefono: testimonioData.telefono || "",
        email: testimonioData.email || ""
      };

      const docRef = await addDoc(collection(db, "testimonios"), nuevoTestimonio);
      console.log('✅ Testimonio guardado exitosamente:', docRef.id); // Confirmación positiva
      await markLastUpdated();
      return docRef.id;
    } catch (error) {
      console.error("❌ Error agregando testimonio:", error);
      throw error;
    }
  };

  const updateTestimonio = async (id, testimonioData) => {
    try {
      await updateDoc(doc(db, "testimonios", id), {
        ...testimonioData,
        fechaActualizacion: Date.now()
      });
      await markLastUpdated();
    } catch (error) {
      console.error("Error actualizando testimonio:", error);
      throw error;
    }
  };

  const deleteTestimonio = async (id) => {
    try {
      await deleteDoc(doc(db, "testimonios", id));
      await markLastUpdated();
    } catch (error) {
      console.error("Error eliminando testimonio:", error);
      throw error;
    }
  };

  const toggleTestimonioVisibilidad = async (id, mostrar) => {
    try {
      await updateDoc(doc(db, "testimonios", id), { mostrar });
      await markLastUpdated();
    } catch (error) {
      console.error("Error cambiando visibilidad del testimonio:", error);
      throw error;
    }
  };

  const verificarTestimonio = async (id, verificado = true) => {
    try {
      await updateDoc(doc(db, "testimonios", id), {
        verificado,
        fechaVerificacion: Date.now()
      });
      await markLastUpdated();
    } catch (error) {
      console.error("Error verificando testimonio:", error);
      throw error;
    }
  };

  // Obtener testimonios públicos (para mostrar en la web)
  const getTestimoniosPublicos = () => {
    return testimonios.filter(t => t.mostrar === true);
  };

  // Obtener estadísticas de testimonios
  const getTestimonioStats = () => {
    const total = testimonios.length;
    const verificados = testimonios.filter(t => t.verificado).length;
    const publicos = testimonios.filter(t => t.mostrar).length;
    const promedioCalificacion = testimonios.length > 0
      ? testimonios.reduce((sum, t) => sum + (t.calificacion || 5), 0) / testimonios.length
      : 5;

    return {
      total,
      verificados,
      publicos,
      ocultos: total - publicos,
      promedioCalificacion: Math.round(promedioCalificacion * 10) / 10
    };
  };

  // 📤 Backup / Import / Reset
  const exportProducts = () => {
    return JSON.stringify(
      {
        productos,
        productosDisponibles,
        testimonios,
        timestamp: Date.now(),
        version: "2.1"
      },
      null,
      2
    );
  };

  const importProducts = async (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (!data.productos) throw new Error("Formato inválido");

      await resetProducts();

      // Importar productos
      for (const [category, products] of Object.entries(data.productos)) {
        for (const product of products) {
          await setDoc(doc(db, category, product.id.toString()), {
            titulo: product.titulo,
            precio: product.precio,
            descripcion: product.descripcion,
            imagen: product.imagen,
            material: product.material || "",
            peso: product.peso || "",
            tamano: product.tamano || "",
          });
        }
      }

      // Importar testimonios si existen
      if (data.testimonios) {
        for (const testimonio of data.testimonios) {
          await addTestimonio(testimonio);
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

    const testimonioStats = getTestimonioStats();

    return {
      totalProducts,
      lastUpdated: lastUpdated ? new Date(lastUpdated).toISOString() : "Nunca",
      testimonios: testimonioStats
    };
  };

  const contextValue = {
    productos,
    productosDisponibles,
    testimonios,
    isLoading,

    // Productos
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

    // Testimonios
    addTestimonio,
    updateTestimonio,
    deleteTestimonio,
    toggleTestimonioVisibilidad,
    verificarTestimonio,
    getTestimoniosPublicos,
    getTestimonioStats,
    loadTestimonials
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