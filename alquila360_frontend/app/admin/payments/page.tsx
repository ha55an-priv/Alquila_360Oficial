'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, ChevronDown, FileText, X } from 'lucide-react';

// === AJUSTES DE IMPORTACIÓN PARA EVITAR EL ERROR 'ELEMENT TYPE IS INVALID' ===
// 1. Asumimos que AdminNavbar es una exportación nombrada. Si es 'export default', 
//    debes quitar las llaves de esta línea:
import { Skeleton } from "@/components/ui/skeleton"; 
import AdminNavbar from '@/components/AdminNavbar'; 
import styles from './page.module.css'; 

// === DEFINICIONES Y SERVICIOS (MOCK) ===
interface IPayment {
  id: string; 
  type: string; 
  amount: number; 
  status: 'pending' | 'completed' | 'failed'; 
  date: string; 
  propertyName: string; 
  contractId: string; 
  payerName: string; 
}

const mockPayments: IPayment[] = [
  { id: "PAGO-001", type: "Alquiler Mensual", amount: 850.00, status: "completed", date: "2024-11-20", propertyName: "Departamento Central, Edif. A", contractId: "CON-789", payerName: "Juan Pérez" },
  { id: "PAGO-002", type: "Servicios Básicos", amount: 120.50, status: "pending", date: "2024-11-25", propertyName: "Local Comercial #5", contractId: "CON-456", payerName: "María López" },
  { id: "PAGO-003", type: "Alquiler Mensual", amount: 1200.00, status: "failed", date: "2024-11-15", propertyName: "Casa con Jardín, Zona Sur", contractId: "CON-123", payerName: "Carlos Gómez" },
  { id: "PAGO-004", type: "Fondo de Reserva", amount: 350.00, status: "completed", date: "2024-11-10", propertyName: "Departamento Central, Edif. A", contractId: "CON-789", payerName: "Juan Pérez" },
];

const PaymentService = {
  async searchPayments(query: string): Promise<IPayment[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowerCaseQuery = query.toLowerCase();
    return mockPayments.filter(payment =>
      payment.id.toLowerCase().includes(lowerCaseQuery) ||
      payment.propertyName.toLowerCase().includes(lowerCaseQuery)
    );
  },
  async getPayments(): Promise<IPayment[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPayments;
  },
};
// === FIN DE DEFINICIONES Y SERVICIOS ===

// --- Componente de Tarjeta de Pago Individual ---
interface PaymentCardProps {
  payment: IPayment;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ payment }) => {
  const getStatusDisplay = (status: IPayment['status']) => {
    switch (status) {
      case 'completed':
        return { text: 'ACTIVO', color: 'text-green-600' };
      case 'pending':
        return { text: 'PENDIENTE', color: 'text-yellow-500' };
      case 'failed':
        return { text: 'VENCIDO', color: 'text-red-600' };
      default:
        return { text: 'DESCONOCIDO', color: 'text-gray-400' };
    }
  };

  const statusDisplay = getStatusDisplay(payment.status);

  return (
    <div className={styles.contractItem}>
      
      {/* Columna 1: Comprobante */}
      <div className={styles.documentPlaceholder}>
        COMPROBANTE
      </div>

      {/* Columna 2: Detalles del Pago */}
      <div className={styles.contractDetails}>
        <span className="text-sm font-semibold text-gray-700 mb-1">ID PAGO:</span>
        <div className={styles.contractId}>{payment.type}</div>
        <div className={styles.propertyName}>Tipo de pago: {payment.type}</div>
        <div className={styles.priceText}>PRECIO: Bs. {payment.amount.toFixed(2)}</div>
        <div className={styles.contractInfo}>
          Estado: <span className={`${statusDisplay.color} font-bold`}>{statusDisplay.text}</span>
        </div>
        <div className={styles.contractInfo}>Fecha de registro: {new Date(payment.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
      </div>

      {/* Columna 3: Botón de Acción */}
      <button
        className={styles.viewButton}
        onClick={() => console.log(`Visualizando detalles del pago ${payment.id}`)}
      >
        VER PAGO
      </button>
    </div>
  );
};


// --- Componente de Esqueleto de Carga ---
const LoadingCard: React.FC = () => (
  <div className={styles.contractItem}>
    {/* Esqueleto simplificado para coincidir con la estructura del item */}
    <Skeleton className="w-full h-24 rounded-full" /> 
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
    <Skeleton className="w-full h-10" />
  </div>
);


// --- Componente Principal de la Página de Pagos ---
export default function PaymentsHistoryPage() {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState('NONE');
  const [filterYear, setFilterYear] = useState('NONE');
  const [isSidebarOpen] = useState(true); // Fijo en true para diseño de escritorio
  
  const sidebarFilters = [
    { 
      title: 'INMUEBLES', 
      items: [
        'Casas (Nro de casas)', 
        'Departamentos (Nro de departamentos)', 
        'Locales (Nro de locales)', 
        'Campos (Nro de capos)', 
        'Oficinas (Nro de oficinas)', 
        'Otros (Nro de otros)'
      ], 
      key: 'inmuebles' 
    },
    { 
      title: 'PUBLICACION', 
      items: ['Mas Antiguos', 'Mas Recientes'], 
      key: 'publicacion' 
    },
    { 
      title: 'ESTADO', 
      items: ['Vencido', 'Activo'], 
      key: 'estado' 
    },
  ];

  const fetchPayments = useCallback(async (query: string = '') => {
    setIsLoading(true);
    try {
      const data = query 
        ? await PaymentService.searchPayments(query) 
        : await PaymentService.getPayments();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments(searchTerm);
  }, [searchTerm, fetchPayments]);

  const filteredPayments = useMemo(() => {
    // Lógica de filtrado por fecha
    let result = payments;
    if (filterMonth !== 'NONE') {
      result = result.filter(p => new Date(p.date).getMonth() + 1 === parseInt(filterMonth));
    }
    if (filterYear !== 'NONE') {
      result = result.filter(p => new Date(p.date).getFullYear() === parseInt(filterYear));
    }
    return result;
  }, [payments, filterMonth, filterYear]);
  
  const numResults = filteredPayments.length;
  
  const monthOptions = [
    { value: 'NONE', label: 'NONE' },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: (i + 1).toString(),
      label: new Date(0, i).toLocaleString('es-ES', { month: 'long' }).toUpperCase()
    }))
  ];
  const yearOptions = [
    { value: 'NONE', label: 'NONE' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
  ];

  return (
    <div className={styles.container}>
      
      {/* Asumo que AdminNavbar ya tiene sus propios estilos y es fijo/pegado al tope */}
      <AdminNavbar /> 
      
      <div className={styles.mainContent}>
        <div className={styles.contractsLayout}>
          
          {/* Columna Izquierda: Filtros (Sidebar) */}
          {isSidebarOpen && (
            <div className={styles.filterPanel}>
              <h2 className={styles.filterTitle}>PAGOS</h2>
              <div className="text-sm text-gray-600 mb-6">Nro de resultados: <span className="font-semibold text-gray-900">{numResults}</span></div>

              {sidebarFilters.map((filter) => (
                <div key={filter.key} className={styles.filterGroup}>
                  <h3 className={styles.filterGroupTitle}>{filter.title}</h3>
                  <ul className={styles.filterList}>
                    {filter.items.map((item, index) => (
                      <li key={index} className={styles.filterItem}>
                        <button className={styles.filterButton}>
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Columna Derecha: Contenido Principal y Pagos */}
          <div className={styles.resultsPanel}>
            
            {/* Bloque de Búsqueda y Filtros de Fecha (Barra de arriba) */}
            <div className={styles.searchBar}>
              
              <span className="text-sm font-semibold text-gray-700 flex-shrink-0">FECHA:</span>
              
              <div className={styles.dateFilter}>
                {/* Selector de Mes */}
                <div className="relative">
                  <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className={styles.select}
                  >
                    {monthOptions.map(option => (
                      <option key={option.value} value={option.value}>MES: {option.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
                
                {/* Selector de Año */}
                <div className="relative">
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className={styles.select}
                  >
                    {yearOptions.map(option => (
                      <option key={option.value} value={option.value}>AÑO: {option.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Barra de Búsqueda */}
              <div className={styles.searchInputContainer}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="INTRODUZCA EL ID DEL TICKET"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Lista de Resultados de Pagos */}
            <div className="space-y-4 mt-6">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => <LoadingCard key={index} />)
              ) : numResults === 0 ? (
                <div className="text-center p-10 bg-white rounded-xl shadow-lg">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">No se encontraron pagos</h3>
                  <p className="text-sm text-gray-500">Intenta ajustar tus filtros de búsqueda.</p>
                </div>
              ) : (
                filteredPayments.map((payment) => (
                  <PaymentCard key={payment.id} payment={payment} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}