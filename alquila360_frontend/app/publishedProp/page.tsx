"use client";

import { useState, useEffect } from "react"; 
import { Search, X, ChevronDown, ChevronUp, Bell, Trash2, Edit } from "lucide-react"; 
import styles from "./styles.module.css";
import Link from "next/link";
// Importaciones del servicio
import { 
    getAuthToken, 
    getOwnerProperties, 
    deleteProperty,
    // ... otros services
} from "../services/property.service"; 
// Interfaces
import { Property as BackendProperty, EstadoPropiedad } from "@/app/interfaces/property.interface";

// Definir la interfaz local
interface Property extends BackendProperty {
    estado: EstadoPropiedad;
}


export default function Properties() {
    // [ESTADOS DE UI]
    const [searchTerm, setSearchTerm] = useState("");
    const [showUserMenu, setShowUserMenu] = useState(false);
    // const [minPrice, setMinPrice] = useState(""); // No utilizados, se pueden eliminar si no se usan
    // const [maxPrice, setMaxPrice] = useState(""); // No utilizados, se pueden eliminar si no se usan
    
    // [ESTADOS DE DATOS Y CARGA]
    const [properties, setProperties] = useState<Property[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // [ESTADO DE AUTENTICACIÓN PARA TIMING]
    const [tokenAvailable, setTokenAvailable] = useState<string | null>(null);


    // 🛑 HOOK PARA CARGAR PROPIEDADES (Manejo de la Condición de Carrera)
    useEffect(() => {
        const currentToken = getAuthToken();
        
        // 1. Si el token aparece, lo guardamos y forzamos re-ejecución.
        if (currentToken && !tokenAvailable) {
            setTokenAvailable(currentToken);
            return; 
        }

        // 2. Si la página carga sin token, mostramos error de autenticación.
        if (!currentToken && !tokenAvailable) {
            setLoading(false);
            setError("Acceso denegado. Por favor, inicie sesión.");
            return;
        }

        // 3. Ejecutamos la carga de datos solo si tokenAvailable es truthy (segunda ejecución)
        const loadProperties = async () => {
            try {
                setLoading(true);
                setError(null); 
                
                const data = await getOwnerProperties(); 
                
                setProperties(data as Property[]); 
                
            } catch (err) {
                console.error("Fallo al cargar propiedades:", err);
                const errorMessage = (err as Error).message;
                if (errorMessage.includes("Acceso no autorizado") || errorMessage.includes("401")) {
                    setError("Sesión expirada o no autorizada. Por favor, inicie sesión nuevamente.");
                } else {
                    setError("Error al obtener propiedades. Intente más tarde.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (tokenAvailable) {
             loadProperties();
        }
    }, [tokenAvailable]); 


    // FUNCIÓN DE ELIMINACIÓN
    const handleDelete = async (id: number) => {
        if (!confirm("¿Está seguro de que desea eliminar esta propiedad? Esta acción es irreversible.")) {
            return;
        }
        try {
            await deleteProperty(id);
            setProperties(prev => prev.filter(p => p.idPropiedad !== id));
        } catch (err) {
            alert("Error al eliminar la propiedad. Verifique su sesión o permisos.");
            console.error("Error deleting property:", err);
        }
    };


    // FILTRO DE PROPIEDADES
    const filteredProperties = properties.filter(p => 
        p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.ciudad?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className={styles.page}>
            {/* HEADER */}
            <header className={styles.header}>
                 {/* Estructura básica del header para ser funcional */}
                <div className={styles.headerOverlay}></div>
                <div className={styles.headerContent}>
                    <div className={styles.logo}>
                        <img src="/logo.png" alt="Logo" className={styles.logoImg} />
                        Propiedades
                    </div>
                    <div className={styles.searchBox}>
                        <Search size={18} className={styles.searchIcon} />
                        <input 
                            type="text" 
                            placeholder="Buscar por ciudad, descripción..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className={styles.clearBtn} onClick={() => setSearchTerm("")}>
                                <X size={18} />
                            </button>
                        )}
                    </div>
                    <button className={styles.userBtn} onClick={() => setShowUserMenu(!showUserMenu)}>
                        <span>Usuario Logueado</span>
                        <div className={styles.userAvatar}>U</div>
                    </button>
                </div>
            </header>

            {/* MAIN */}
            <div className={styles.main}>
                {/* SIDEBAR */}
                <aside className={styles.sidebar}>
                    <h2>INMUEBLES PUBLICADOS</h2>
                    <p>Nro de resultados: {filteredProperties.length}</p>
                    {/* Aquí irían los filtros de precio, tipo, etc. */}
                </aside>

                {/* LISTA DE PROPIEDADES */}
                <section className={styles.propertiesList}>
                    {loading && <p>Cargando propiedades...</p>}
                    {error && <p className={styles.errorMessage}>Error: {error}</p>}

                    {!loading && !error && filteredProperties.length === 0 && (
                        <p>No se encontraron propiedades publicadas para este usuario.</p>
                    )}

                    {/* 🛑 MAPEADO Y RENDERIZADO VISUAL DE CADA PROPIEDAD */}
                    {filteredProperties.map((p) => (
                        <div key={p.idPropiedad} className={styles.propertyItem}>
                            
                            {/* IMAGEN: Asume que p.images[0].fileName es la URL/ruta de la imagen */}
                            <div className={styles.propertyImageContainer}>
                                {p.images && p.images.length > 0 && p.images[0].url ? (
                                    <img 
                                        // 🛑 NECESITAS LA URL COMPLETA DEL BACKEND para la imagen
                                        // Reemplaza 'http://localhost:3001/uploads/' con la ruta base de tus archivos estáticos
                                        src={`http://localhost:3001/uploads/${p.images[0].url}`} 
                                        alt={`Imagen de ${p.descripcion}`} 
                                        className={styles.propertyImage} 
                                    />
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        Sin imagen
                                    </div>
                                )}
                            </div>
                            
                            {/* DETALLES */}
                            <div className={styles.propertyDetails}>
                                <h3>{p.descripcion} ({p.tipo})</h3>
                                <p><strong>Ciudad:</strong> {p.ciudad}</p>
                                <p><strong>Dirección:</strong> {p.calle} {p.numViv ? `, Nro ${p.numViv}` : ''}</p>
                                <p><strong>Estado:</strong> {p.estado}</p>
                            </div>

                            {/* BOTONES */}
                            <div className={styles.propertyButtonWrapper}>
                                <Link href={`/editProperty/${p.idPropiedad}`}>
                                    <button className={styles.editButton}>
                                        <Edit size={18} /> EDITAR
                                    </button>
                                </Link>
                                <button 
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(p.idPropiedad)}
                                >
                                    <Trash2 size={18} /> ELIMINAR
                                </button>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}