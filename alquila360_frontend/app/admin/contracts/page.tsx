"use client";

import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { Search, Loader2, FileText, X, ChevronDown } from 'lucide-react';
import AdminNavbar from '@/components/AdminNavbar'; // Importación asumida (si da error, prueba con { AdminNavbar } )
import styles from './page.module.css';

// =========================================================================
// MOCK DE INTERFACES Y SERVICIOS (Ajustar según tu proyecto real)
// =========================================================================

interface ContractFilterParams {
  searchQuery: string;
  month: string;
  year: string;
  propertyType: string;
  status: string;
  sortOrder: string;
}

interface Tenant { fullName: string; }
interface Owner { fullName: string; }
interface Property { name: string; }
interface Contract {
  id: string;
  contractId: string;
  property: Property;
  price: number;
  currency: string;
  tenant: Tenant;
  owner: Owner;
  startDate: string;
  endDate: string;
  status: 'Activo' | 'Vencido'; 
}

// Mock de datos
const mockContracts: Contract[] = [
  { id: 'C001', contractId: 'CON-12345', property: { name: 'Casa con Jardín - Zona Central' }, price: 1250, currency: 'USD', tenant: { fullName: 'Ana Rodríguez' }, owner: { fullName: 'Felipe Sotelo' }, startDate: '2024-01-01', endDate: '2025-01-01', status: 'Activo' },
  { id: 'C002', contractId: 'CON-67890', property: { name: 'Departamento 3A - Edif. Norte' }, price: 800, currency: 'USD', tenant: { fullName: 'Luis Morales' }, owner: { fullName: 'Silvia Chávez' }, startDate: '2023-05-15', endDate: '2024-05-15', status: 'Vencido' },
  { id: 'C003', contractId: 'CON-98765', property: { name: 'Local Comercial - Avenida Principal' }, price: 2100, currency: 'USD', tenant: { fullName: 'Inversiones Alfa' }, owner: { fullName: 'Carlos Fuentes' }, startDate: '2024-10-01', endDate: '2025-10-01', status: 'Activo' },
];

const getAdminContracts = async (filters: ContractFilterParams): Promise<Contract[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let results = mockContracts.filter(c => 
    (filters.status === 'all' || c.status === filters.status)
  );
  
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    results = results.filter(c =>
      c.contractId.toLowerCase().includes(query) ||
      c.property.name.toLowerCase().includes(query)
    );
  }
  
  // Implementar lógica de filtrado por fecha y ordenamiento si es necesario
  
  return results;
};

// =========================================================================
// FIN DE MOCK
// =========================================================================

// Lista de opciones estáticas para filtros
const PROPERTY_TYPES = [
  { value: 'all', label: 'Todos' },
  { value: 'Casa', label: 'Casas' },
  { value: 'Departamento', label: 'Departamentos' },
  { value: 'Local', label: 'Locales' },
  { value: 'Campo', label: 'Campos' },
  { value: 'Oficina', label: 'Oficinas' },
  { value: 'Otro', label: 'Otros' },
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
    label: new Date(0, i).toLocaleString('es-ES', { month: 'long' }).toUpperCase() 
}));
MONTH_OPTIONS.unshift({ value: 'none', label: 'MES: NONE' });

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [
  { value: 'none', label: 'AÑO: NONE' },
  ...Array.from({ length: 5 }, (_, i) => ({ 
      value: (CURRENT_YEAR - i).toString(), 
      label: (CURRENT_YEAR - i).toString() 
  }))
];

// Función auxiliar para formatear la fecha
const formatContractDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};


// Componente para mostrar un solo ítem de contrato
const ContractItem: React.FC<{ contract: Contract }> = ({ contract }) => {
  const isExpired = contract.status === 'Vencido';
  const statusClass = isExpired ? 'text-red-600' : 'text-green-600';

  return (
    <div className={styles.contractItem}>
      {/* 1. Documento Digital Placeholder */}
      <div className={styles.documentPlaceholder}>
        <FileText size={40} className="text-gray-500" />
        <span className="mt-1 text-xs">DOCUMENTO DIGITAL</span>
      </div>

      {/* 2. Detalles del Contrato */}
      <div className={styles.contractDetails}>
        <span className={styles.contractId}>ID CONTRATO: {contract.contractId}</span>
        <span className={styles.propertyName}>{contract.property.name}</span>
        <span className={styles.priceText}>PRECIO: {contract.price} {contract.currency}</span>
        <p className={styles.contractInfo}>
          Estado: <span className={`${statusClass} font-bold`}>{contract.status.toUpperCase()}</span> <br />
          Inquilino: {contract.tenant.fullName} <br />
          Fecha inicio / Fecha fin: {formatContractDate(contract.startDate)} / {formatContractDate(contract.endDate)}
        </p>
      </div>

      {/* 3. Botón Ver Contrato */}
      <a href={`/admin/contract/${contract.id}`} className={styles.viewButton}>
        VER CONTRATO
      </a>
    </div>
  );
};


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
  const fetchContractsData = async (currentFilters: ContractFilterParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminContracts(currentFilters);
      setContracts(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los contratos.');
      setContracts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContractsData(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.month, filters.year, filters.propertyType, filters.status, filters.sortOrder, filters.searchQuery]);


  // Mapear los filtros de propiedad a su conteo simulado
  const propertyCounts: Record<string, number> = useMemo(() => {
    return {
        'Casa': 12,
        'Departamento': 25,
        'Local': 5,
        'Campo': 2,
        'Oficina': 8,
        'Otro': 1,
    };
  }, []);

  // Contadores para los filtros
  const activeContracts = mockContracts.filter(c => c.status === 'Activo').length;
  const expiredContracts = mockContracts.filter(c => c.status === 'Vencido').length;
  

  return (
    <div className={styles.container}>
      
      <AdminNavbar /> 
      
      <main className={styles.mainContent}>
        
        <div className={styles.contractsLayout}>

          {/* --- SECCIÓN IZQUIERDA: FILTROS --- */}
          <div className={styles.filterPanel}>
            <h2 className={styles.filterTitle}>CONTRATOS</h2>
            <p className="text-sm text-gray-500 mb-6">Nro de resultados: <span className="font-bold text-gray-800">{contracts.length}</span></p>

            {/* Filtro de Inmuebles */}
            <div className={styles.filterGroup}>
              <h3 className={styles.filterGroupTitle}>INMUEBLES</h3>
              <ul className={styles.filterList}>
                {PROPERTY_TYPES.filter(t => t.value !== 'all').map((type) => (
                  <li key={type.value} className={styles.filterItem}>
                    <button 
                      onClick={() => handleFilterChange('propertyType', type.value)}
                      className={`${styles.filterButton} ${filters.propertyType === type.value ? styles.active : ''}`}
                    >
                      {type.label} ({propertyCounts[type.value] || 0})
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filtro de Publicación/Ordenamiento */}
            <div className={styles.filterGroup}>
              <h3 className={styles.filterGroupTitle}>PUBLICACION</h3>
              <ul className={styles.filterList}>
                {SORT_OPTIONS.filter(opt => !opt.value.includes('price')).map(opt => (
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
              </ul>
            </div>

            {/* Filtro de Estado */}
            <div className={styles.filterGroup}>
              <h3 className={styles.filterGroupTitle}>ESTADO</h3>
              <ul className={styles.filterList}>
                {CONTRACT_STATUS.filter(t => t.value !== 'all').map((status) => (
                  <li key={status.value} className={styles.filterItem}>
                    <button 
                      onClick={() => handleFilterChange('status', status.value)}
                      className={`${styles.filterButton} ${filters.status === status.value ? styles.active : ''}`}
                    >
                      {status.label} ({status.value === 'Activo' ? activeContracts : expiredContracts})
                    </button>
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
                    <span className="text-base font-semibold text-gray-700 whitespace-nowrap">FECHA:</span>
                    <div className="relative">
                      <select 
                          className={styles.select} 
                          value={filters.month} 
                          onChange={(e) => handleFilterChange('month', e.target.value)}
                      >
                          {MONTH_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <select 
                          className={styles.select} 
                          value={filters.year} 
                          onChange={(e) => handleFilterChange('year', e.target.value)}
                      >
                          {YEAR_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
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
            <div className="space-y-4 mt-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64 text-gray-500">
                    <Loader2 className="animate-spin mr-2" size={24} /> Cargando contratos...
                  </div>
                ) : error ? (
                  <div className="text-center py-10 text-red-600 border border-red-200 bg-red-50 rounded-lg">
                    <p className='font-medium'>Error al cargar: {error}</p>
                  </div>
                ) : contracts.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 border border-gray-200 bg-white rounded-lg">
                    <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className='font-medium'>No se encontraron contratos con los filtros aplicados.</p>
                  </div>
                ) : (
                  contracts.map(contract => (
                    <ContractItem key={contract.id} contract={contract} />
                  ))
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}