"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, Star, X, MapPin } from 'lucide-react';
// Importamos los estilos del historial de contratos ya que el layout es idéntico
import styles from '../contracts/page.module.css'; 
// No import named getAdminTickets because the service module does not export it; we'll use dynamic import at runtime.
import { Ticket, TicketFilterParams, TicketStatus, TicketPriority } from '@/app/interfaces/ticket.interface';

// --- Opciones estáticas para filtros ---
const PROPERTY_TYPES = [
  { value: 'all', label: 'Todos' },
  // Los siguientes labels se mantienen igual que en contratos, solo son decorativos para el conteo.
  { value: 'Casa', label: 'Casas (Nro de casas)' },
  { value: 'Departamento', label: 'Departamentos (Nro de departamentos)' },
  { value: 'Local', label: 'Locales (Nro de locales)' },
  { value: 'Campo', label: 'Campos (Nro de campos)' },
  { value: 'Oficina', label: 'Oficinas (Nro de oficinas)' },
  { value: 'Otro', label: 'Otros (Nro de otros)' },
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
MONTH_OPTIONS.unshift({ value: 'none', label: 'Mes: NONE' });

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [
  { value: 'none', label: 'Año: NONE' },
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
                    // Lo ideal sería usar Next.js Link, pero para la simulación usamos button y href
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
      // Import dinámico para evitar errores en tiempo de compilación si el servicio no exporta el nombre esperado.
      const svc = await import('@/app/services/ticket.service');
      // Por seguridad, tratar el módulo como any para evitar errores de tipado al acceder a propiedades dinámicas.
      const moduleAny = svc as any;
      // Intentar varias posibles funciones exportadas que podrían existir en el módulo.
      const fn =
        moduleAny.getAdminTickets ??
        moduleAny.getTickets ??
        moduleAny.fetchTickets ??
        moduleAny.default?.getAdminTickets ??
        moduleAny.default?.getTickets ??
        moduleAny.default?.fetchTickets;
      if (!fn) throw new Error('No ticket fetch function found in ticket.service');
      const data = await fn(currentFilters);
      setTickets(data);
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
      {/* <Navbar role="admin" /> */}
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