"use client";

import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { Search, Loader2, FileText, X } from 'lucide-react';
import styles from './page.module.css';
import { getAdminContracts } from '@/app/services/contract.service';
import { Contract, ContractFilterParams } from '@/app/interfaces/contract.interface';

// Lista de opciones estáticas para filtros
const PROPERTY_TYPES = [
  { value: 'all', label: 'Todos' },
  { value: 'Casa', label: 'Casas (Nro de casas)' },
  { value: 'Departamento', label: 'Departamentos (Nro de departamentos)' },
  { value: 'Local', label: 'Locales (Nro de locales)' },
  { value: 'Campo', label: 'Campos (Nro de campos)' },
  { value: 'Oficina', label: 'Oficinas (Nro de oficinas)' },
  { value: 'Otro', label: 'Otros (Nro de otros)' },
];

const CONTRACT_STATUS = [
  { value: 'all', label: 'Todos' },
  { value: 'Activo', label: 'Activo' },
  { value: 'Vencido', label: 'Vencido' },
];

const SORT_OPTIONS = [
    { value: 'recent', label: 'Más Recientes' },
    { value: 'old', label: 'Más Antiguos' },
    { value: 'price_desc', label: 'Precio Mayor - Precio Menor' },
    { value: 'price_asc', label: 'Precio Menor - Precio Mayor' },
];

// Opciones de Mes y Año (simplificado)
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

// Función auxiliar para formatear la fecha
const formatContractDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    // Se asume formato ISO (YYYY-MM-DD)
    return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};


// Componente para mostrar un solo ítem de contrato
const ContractItem: React.FC<{ contract: Contract }> = ({ contract }) => (
  <div className={styles.contractItem}>
    {/* 1. Documento Digital Placeholder */}
    <div className={styles.documentPlaceholder}>
      <FileText size={40} className="mr-2" />
      DOCUMENTO DIGITAL
    </div>

    {/* 2. Detalles del Contrato */}
    <div className={styles.contractDetails}>
      <span className={styles.contractId}>ID CONTRATO: {contract.contractId}</span>
      <span className={styles.propertyName}>{contract.property.name}</span>
      <span className={styles.priceText}>PRECIO: {contract.price} {contract.currency}</span>
      <p className={styles.contractInfo}>
        Inquilino: {contract.tenant.fullName} <br />
        Propietario: {contract.owner.fullName} <br />
        Fecha inicio / Fecha fin: {formatContractDate(contract.startDate)} / {formatContractDate(contract.endDate)}
      </p>
    </div>

    {/* 3. Botón Ver Contrato */}
    <a href={`/admin/contract/${contract.id}`} className={styles.viewButton}>
      VER CONTRATO
    </a>
  </div>
);


export default function AdminContractHistoryPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado de los filtros
  const [filters, setFilters] = useState<ContractFilterParams>({
    searchQuery: '',
    month: 'none',
    year: 'none',
    propertyType: 'all',
    status: 'all',
    sortOrder: 'recent',
  });

  // Manejar el cambio de filtros
  const handleFilterChange = (key: keyof ContractFilterParams, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Función de carga de datos
  const fetchContracts = async (currentFilters: ContractFilterParams) => {
    setIsLoading(true);
    setError(null);
    try {
      // El servicio ya aplica los filtros y ordenamiento en el lado del cliente (para la simulación)
      const data = await getAdminContracts(currentFilters);
      setContracts(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los contratos.');
      setContracts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect para cargar los datos cuando cambian los filtros (debounced o directo)
  // Aquí lo hacemos directo por simplicidad, pero se recomienda un debounce para la búsqueda por texto.
  useEffect(() => {
    fetchContracts(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.month, filters.year, filters.propertyType, filters.status, filters.sortOrder, filters.searchQuery]);


  // Mapear los filtros de propiedad a su conteo simulado
  const propertyCounts: Record<string, number> = useMemo(() => {
    // En un caso real, esto vendría del backend o se calcularía de la lista completa.
    // Usamos conteos simulados por ahora.
    return {
        'Casa': 12,
        'Departamento': 25,
        'Local': 5,
        'Campo': 2,
        'Oficina': 8,
        'Otro': 1,
    };
  }, []);

  return (
    <div className={styles.container}>
      {/* <Navbar role="admin" /> */}
      <main className={styles.mainContent}>
        
        <div className={styles.contractsLayout}>

          {/* --- SECCIÓN IZQUIERDA: FILTROS --- */}
          <div className={styles.filterPanel}>
            <h2 className={styles.filterTitle}>CONTRATOS</h2>
            <p className="text-sm text-gray-500 mb-4">Nro de resultados: <span className="font-bold text-gray-800">{contracts.length}</span></p>

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

            {/* Filtro de Publicación/Ordenamiento */}
            <div className={styles.filterGroup}>
              <h3 className={styles.filterGroupTitle}>PUBLICACION</h3>
              <ul className={styles.filterList}>
                {SORT_OPTIONS.filter(opt => opt.value !== 'price_asc' && opt.value !== 'price_desc').map(opt => (
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
            
            {/* Filtro de Precio */}
            <div className={styles.filterGroup}>
              <h3 className={styles.filterGroupTitle}>PRECIO</h3>
              <ul className={styles.filterList}>
                {SORT_OPTIONS.filter(opt => opt.value.includes('price')).map(opt => (
                    <li key={opt.value} className={styles.filterItem}>
                        <button 
                            className={`${styles.filterButton} ${filters.sortOrder === opt.value ? styles.active : ''}`}
                            onClick={() => handleFilterChange('sortOrder', opt.value)}
                        >
                            {opt.label}
                        </button>
                    </li>
                ))}
                <li className={styles.filterItem}>
                    <span className={styles.filterLabel}>Precio (Lo define el usuario)</span>
                </li>
              </ul>
            </div>

            {/* Filtro de Estado */}
            <div className={styles.filterGroup}>
              <h3 className={styles.filterGroupTitle}>ESTADO</h3>
              <ul className={styles.filterList}>
                {CONTRACT_STATUS.filter(t => t.value !== 'all').map((status) => (
                  <li key={status.value} className={styles.filterItem}>
                    <label 
                      onClick={() => handleFilterChange('status', status.value)}
                      className={`${styles.filterLabel} ${filters.status === status.value ? styles.active : ''}`}
                    >
                      {status.label}
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
                        placeholder="INTRODUZCA EL ID/NOMBRE DE LA PROPIEDAD"
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

            {/* Lista de Contratos */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64 text-gray-500">
                <Loader2 className="animate-spin mr-2" size={24} /> Cargando contratos...
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-600 border border-red-200 bg-red-50 rounded-lg">
                <p className='font-medium'>Error al cargar: {error}</p>
                <p className='text-sm mt-1'>Por favor, intente recargar la página.</p>
              </div>
            ) : contracts.length === 0 ? (
              <div className="text-center py-10 text-gray-500 border border-gray-200 bg-white rounded-lg">
                <p className='font-medium'>No se encontraron contratos con los filtros aplicados.</p>
                <button 
                    className="text-teal-600 hover:text-teal-800 mt-2 text-sm"
                    onClick={() => setFilters({
                        searchQuery: '', month: 'none', year: 'none', 
                        propertyType: 'all', status: 'all', sortOrder: 'recent'
                    })}
                >
                    Limpiar Filtros
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {contracts.map(contract => (
                  <ContractItem key={contract.id} contract={contract} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}