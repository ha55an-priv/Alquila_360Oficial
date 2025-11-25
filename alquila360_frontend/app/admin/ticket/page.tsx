"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, Star, X } from 'lucide-react';

// 👈 Importamos el AdminNavbar
import AdminNavbar from '@/components/AdminNavbar'; 

// ⚠️ Importa los estilos de tu layout de historial. 
// He dejado la ruta que usaste, pero asegúrate de que exista o cámbiala al archivo CSS de Historial de Tickets.
import styles from '../contracts/page.module.css'; 

// Definiciones de tipos (asumo que están en un archivo de interfaces)
interface Ticket {
    id: string;
    ticketId: string;
    property: {
        name: string;
    };
    technicalAssistance: {
        assignedTech: string;
        rating: number | null;
    };
    status: TicketStatus;
    priority: TicketPriority;
}

type TicketStatus = 'PENDIENTE' | 'EN PROGRESO' | 'CERRADO' | 'ABIERTO';
type TicketPriority = 'ALTA' | 'MEDIA' | 'BAJA';

interface TicketFilterParams {
    searchQuery: string;
    month: string;
    year: string;
    propertyType: string;
    status: string;
    priority: string;
    sortOrder: string;
}


// --- Opciones estáticas para filtros ---
const PROPERTY_TYPES = [
    { value: 'all', label: 'Todos' },
    { value: 'Casa', label: 'Casas' },
    { value: 'Departamento', label: 'Departamentos' },
    { value: 'Local', label: 'Locales' },
    { value: 'Campo', label: 'Campos' },
    { value: 'Oficina', label: 'Oficinas' },
    { value: 'Otro', label: 'Otros' },
];

const TICKET_STATUS: { value: TicketStatus | 'all', label: string, color: string }[] = [
    { value: 'all', label: 'Todos', color: '#6b7280' },
    { value: 'PENDIENTE', label: 'Pendiente', color: '#ef4444' }, // Rojo
    { value: 'EN PROGRESO', label: 'En Proceso', color: '#f59e0b' }, // Naranja
    { value: 'CERRADO', label: 'Finalizado', color: '#10b981' }, // Verde
    { value: 'ABIERTO', label: 'Abierto', color: '#4b5563' }, // Gris oscuro
];

const TICKET_PRIORITIES: { value: TicketPriority | 'all', label: string, color: string }[] = [
    { value: 'all', label: 'Todas', color: '#6b7280' },
    { value: 'ALTA', label: 'Alta', color: '#ef4444' }, // Rojo
    { value: 'MEDIA', label: 'Media', color: '#f59e0b' }, // Naranja
    { value: 'BAJA', label: 'Baja', color: '#10b981' }, // Verde
];

const SORT_OPTIONS = [
    { value: 'recent', label: 'Más Recientes' },
    { value: 'old', label: 'Más Antiguos' },
];

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({ 
    value: (i + 1).toString(), 
    label: new Date(0, i).toLocaleDateString('es-ES', { month: 'long' }) 
}));
MONTH_OPTIONS.unshift({ value: 'none', label: 'Mes: TODOS' });

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [
    { value: 'none', label: 'Año: TODOS' },
    ...Array.from({ length: 5 }, (_, i) => ({ 
        value: (CURRENT_YEAR - i).toString(), 
        label: (CURRENT_YEAR - i).toString() 
    }))
];

// Función auxiliar para obtener el color del ticket para el círculo y el botón
const getTicketColor = (ticket: Ticket) => {
    switch (ticket.priority) {
        case 'ALTA': return '#ef4444'; // Rojo
        case 'MEDIA': return '#f59e0b'; // Naranja
        case 'BAJA': return '#10b981'; // Verde
        default: return '#6b7280'; // Gris
    }
};

// Componente para mostrar las estrellas de calificación
const RatingStars: React.FC<{ rating: number | null }> = ({ rating }) => {
    const filledStars = rating !== null ? Math.round(rating) : 0;
    const maxStars = 5;
    const color = filledStars > 0 ? '#facc15' : '#d1d5db'; // Amarillo o Gris

    return (
        <div className="flex text-lg">
            {Array.from({ length: maxStars }).map((_, index) => (
                <Star 
                    key={index} 
                    size={20} 
                    fill={index < filledStars ? color : '#d1d5db'}
                    color={color}
                />
            ))}
        </div>
    );
};

// Componente para mostrar un solo ítem de ticket
const TicketItem: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
    const color = getTicketColor(ticket);
    const statusInfo = TICKET_STATUS.find(s => s.value === ticket.status);

    return (
        <div className={styles.contractItem} style={{ gridTemplateColumns: '180px 1fr 150px' }}>
            {/* 1. Ticket ID y color (Placeholder) */}
            <div 
                className={styles.documentPlaceholder} 
                style={{ backgroundColor: color, color: 'white', border: `2px solid ${color}` }}
            >
                TICKET #{ticket.ticketId.split('-').pop()}
            </div>

            {/* 2. Detalles del Ticket */}
            <div className={styles.contractDetails}>
                <span className={styles.contractId}>ID TICKET: {ticket.ticketId}</span>
                <span className={styles.propertyName}>{ticket.property.name}</span>
                <p className="text-sm font-semibold text-gray-800 mt-1 mb-0.5">
                    TÉCNICO: {ticket.technicalAssistance.assignedTech}
                </p>
                <div className={styles.contractInfo}>
                    <p>
                        Prioridad: <span className="font-semibold" style={{ color: color }}>{ticket.priority}</span> <br />
                        Estado: <span className="font-semibold" style={{ color: statusInfo?.color || '#6b7280' }}>{ticket.status}</span>
                    </p>
                </div>
            </div>

            {/* 3. Calificación y Botón */}
            <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-center">
                    <span className="text-xs font-semibold text-gray-700">CALIFICACIÓN DE ASISTENCIA TÉCNICA</span>
                    <RatingStars rating={ticket.technicalAssistance.rating} />
                </div>
                <button 
                    className={styles.viewButton}
                    onClick={() => console.log(`Ver detalles del ticket ${ticket.id}`)}
                >
                    VER TICKET
                </button>
            </div>
        </div>
    );
};


export default function AdminTicketHistoryPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Estado de los filtros
    const [filters, setFilters] = useState<TicketFilterParams>({
        searchQuery: '',
        month: 'none',
        year: 'none',
        propertyType: 'all',
        status: 'all',
        priority: 'all',
        sortOrder: 'recent',
    });

    // Manejar el cambio de filtros
    const handleFilterChange = (key: keyof TicketFilterParams, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Función de carga de datos (usa import dinámico para evitar errores de exportación)
    const fetchTickets = async (currentFilters: TicketFilterParams) => {
        setIsLoading(true);
        setError(null);
        try {
            // Simulación de importación dinámica y llamada al servicio
            // Aquí iría tu lógica real para llamar a la API
            const dummyTickets: Ticket[] = [
                // Simulación de datos
                { id: '1', ticketId: 'TKT-1234', property: { name: 'Casa en Av. Central 50' }, technicalAssistance: { assignedTech: 'Juan Pérez', rating: 4 }, status: 'EN PROGRESO', priority: 'ALTA' },
                { id: '2', ticketId: 'TKT-5678', property: { name: 'Depto 3B, Edif. Oasis' }, technicalAssistance: { assignedTech: 'María G.', rating: 5 }, status: 'CERRADO', priority: 'MEDIA' },
                { id: '3', ticketId: 'TKT-9012', property: { name: 'Local Comercial 1' }, technicalAssistance: { assignedTech: 'Pablo R.', rating: null }, status: 'PENDIENTE', priority: 'BAJA' },
                // Añade más datos simulados si es necesario
            ];
            
            // Simulación de filtrado básico
            const filteredData = dummyTickets.filter(t => 
                (filters.status === 'all' || t.status === filters.status) &&
                (filters.priority === 'all' || t.priority === filters.priority) &&
                (filters.searchQuery === '' || t.ticketId.includes(filters.searchQuery.toUpperCase()))
            );

            await new Promise(resolve => setTimeout(resolve, 500)); // Simular latencia de red
            setTickets(filteredData);
            
        } catch (err: any) {
            setError(err?.message || 'Error al cargar los tickets.');
            setTickets([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Carga inicial y actualización al cambiar filtros
    useEffect(() => {
        fetchTickets(filters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.month, filters.year, filters.propertyType, filters.status, filters.priority, filters.sortOrder, filters.searchQuery]);


    // Mapear los filtros de propiedad a su conteo simulado
    const propertyCounts: Record<string, number> = useMemo(() => {
        // Conteo simulado, en realidad debería venir del backend o calcularse.
        return { 'Casa': 5, 'Departamento': 10, 'Local': 1, 'Campo': 0, 'Oficina': 3, 'Otro': 0, };
    }, []);

    return (
        <div className={styles.container}>
            
            {/* 👈 COMPONENTE NAVBAR DE ADMINISTRADOR */}
            <AdminNavbar /> 

            <main className={styles.mainContent}>
                
                <div className={styles.contractsLayout}>

                    {/* --- SECCIÓN IZQUIERDA: FILTROS --- */}
                    <div className={styles.filterPanel}>
                        <h2 className={styles.filterTitle}>TICKETS</h2>
                        <p className="text-sm text-gray-500 mb-4">Nro de resultados: <span className="font-bold text-gray-800">{tickets.length}</span></p>

                        {/* Filtro de Inmuebles */}
                        <div className={styles.filterGroup}>
                            <h3 className={styles.filterGroupTitle}>INMUEBLES</h3>
                            <ul className={styles.filterList}>
                                {PROPERTY_TYPES.filter(t => t.value !== 'all').map((type) => (
                                    <li key={type.value} className={styles.filterItem}>
                                        <label 
                                            onClick={() => handleFilterChange('propertyType', type.value)}
                                            className={`${styles.filterLabel} ${filters.propertyType === type.value ? styles.active : ''}`}
                                        >
                                            {type.label} ({propertyCounts[type.value] || 0})
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Filtro de Ordenamiento */}
                        <div className={styles.filterGroup}>
                            <h3 className={styles.filterGroupTitle}>PUBLICACION</h3>
                            <ul className={styles.filterList}>
                                {SORT_OPTIONS.map(opt => (
                                    <li key={opt.value} className={styles.filterItem}>
                                        <button 
                                            className={`${styles.filterButton} ${filters.sortOrder === opt.value ? styles.active : ''}`}
                                            onClick={() => handleFilterChange('sortOrder', opt.value)}
                                        >
                                            {opt.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Filtro de Estado */}
                        <div className={styles.filterGroup}>
                            <h3 className={styles.filterGroupTitle}>ESTADO</h3>
                            <ul className={styles.filterList}>
                                {TICKET_STATUS.filter(s => s.value !== 'all').map((status) => (
                                    <li key={status.value} className={styles.filterItem}>
                                        <label 
                                            onClick={() => handleFilterChange('status', status.value)}
                                            className={`${styles.filterLabel} ${filters.status === status.value ? styles.active : ''}`}
                                            style={filters.status === status.value ? { color: status.color } : {}}
                                        >
                                            {status.label}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Filtro de Prioridad */}
                        <div className={styles.filterGroup}>
                            <h3 className={styles.filterGroupTitle}>PRIORIDAD</h3>
                            <ul className={styles.filterList}>
                                {TICKET_PRIORITIES.filter(p => p.value !== 'all').map((priority) => (
                                    <li key={priority.value} className={styles.filterItem}>
                                        <label 
                                            onClick={() => handleFilterChange('priority', priority.value)}
                                            className={`${styles.filterLabel} ${filters.priority === priority.value ? styles.active : ''}`}
                                            style={filters.priority === priority.value ? { color: priority.color } : {}}
                                        >
                                            {priority.label}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>

                    {/* --- SECCIÓN DERECHA: BÚSQUEDA Y LISTA --- */}
                    <div className={styles.resultsPanel}>
                        
                        {/* Barra de Búsqueda y Filtro de Fecha */}
                        <div className={styles.searchBar}>
                            
                            <div className={styles.dateFilter}>
                                <span className="text-base font-semibold text-gray-700">FECHA:</span>
                                <select 
                                    className={styles.select} 
                                    value={filters.month} 
                                    onChange={(e) => handleFilterChange('month', e.target.value)}
                                >
                                    {MONTH_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <select 
                                    className={styles.select} 
                                    value={filters.year} 
                                    onChange={(e) => handleFilterChange('year', e.target.value)}
                                >
                                    {YEAR_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.searchInputContainer}>
                                <input
                                    type="text"
                                    placeholder="INTRODUZCA EL ID DEL TICKET"
                                    className={styles.searchInput}
                                    value={filters.searchQuery}
                                    onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                                />
                                <Search className={styles.searchIcon} size={20} />
                                {filters.searchQuery && (
                                    <button 
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                                        onClick={() => handleFilterChange('searchQuery', '')}
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Lista de Tickets */}
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64 text-gray-500">
                                <Loader2 className="animate-spin mr-2" size={24} /> Cargando tickets...
                            </div>
                        ) : error ? (
                            <div className="text-center py-10 text-red-600 border border-red-200 bg-red-50 rounded-lg">
                                <p className='font-medium'>Error al cargar: {error}</p>
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 border border-gray-200 bg-white rounded-lg">
                                <p className='font-medium'>No se encontraron tickets con los filtros aplicados.</p>
                                <button 
                                    className="text-teal-600 hover:text-teal-800 mt-2 text-sm"
                                    onClick={() => setFilters({
                                        searchQuery: '', month: 'none', year: 'none', 
                                        propertyType: 'all', status: 'all', priority: 'all', sortOrder: 'recent'
                                    })}
                                >
                                    Limpiar Filtros
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tickets.map(ticket => (
                                    <TicketItem key={ticket.id} ticket={ticket} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}