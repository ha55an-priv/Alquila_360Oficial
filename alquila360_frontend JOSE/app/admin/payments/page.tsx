'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, ChevronDown, CheckCircle2, XCircle, Clock, FileText, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// === CONSOLIDACIÓN DE DEPENDENCIAS PARA RESOLVER ERRORES DE COMPILACIÓN ===

// 1. Interfaz de Pago (IPayment)
// Definición de la estructura de datos para un pago individual
interface IPayment {
  id: string; // ID del pago (e.g., "PAGO-001")
  type: string; // Tipo de pago (e.g., "Alquiler mensual", "Gasto de reparación")
  amount: number; // Monto del pago
  status: 'pending' | 'completed' | 'failed'; // Estado del pago
  date: string; // Fecha de registro del pago (formato "YYYY-MM-DD")
  propertyName: string; // Nombre o descripción de la propiedad asociada
  contractId: string; // ID del contrato asociado
  payerName: string; // Nombre de la persona que realiza el pago (Inquilino/Administrador)
}

// 2. Servicio de Pago (PaymentService)
// Simulación de una lista de pagos (Data Mockup)
const mockPayments: IPayment[] = [
  {
    id: "PAGO-001",
    type: "Alquiler Mensual",
    amount: 850.00,
    status: "completed",
    date: "2024-11-20",
    propertyName: "Departamento Central, Edif. A",
    contractId: "CON-789",
    payerName: "Juan Pérez",
  },
  {
    id: "PAGO-002",
    type: "Servicios Básicos",
    amount: 120.50,
    status: "pending",
    date: "2024-11-25",
    propertyName: "Local Comercial #5",
    contractId: "CON-456",
    payerName: "María López",
  },
  {
    id: "PAGO-003",
    type: "Alquiler Mensual",
    amount: 1200.00,
    status: "failed",
    date: "2024-11-15",
    propertyName: "Casa con Jardín, Zona Sur",
    contractId: "CON-123",
    payerName: "Carlos Gómez",
  },
    {
    id: "PAGO-004",
    type: "Fondo de Reserva",
    amount: 350.00,
    status: "completed",
    date: "2024-11-10",
    propertyName: "Departamento Central, Edif. A",
    contractId: "CON-789",
    payerName: "Juan Pérez",
  },
];

/**
 * Servicio para simular la interacción con la API de Pagos.
 */
const PaymentService = {
  /**
   * Simula la obtención de la lista completa de pagos.
   * @returns Una promesa que resuelve con un array de pagos.
   */
  async getPayments(): Promise<IPayment[]> {
    // Simula el tiempo de espera de la red
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPayments;
  },

  /**
   * Simula la búsqueda de pagos por ID o nombre de la propiedad.
   * @param query El texto a buscar.
   * @returns Una promesa que resuelve con los pagos filtrados.
   */
  async searchPayments(query: string): Promise<IPayment[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowerCaseQuery = query.toLowerCase();

    return mockPayments.filter(payment =>
      payment.id.toLowerCase().includes(lowerCaseQuery) ||
      payment.propertyName.toLowerCase().includes(lowerCaseQuery)
    );
  },
};

// === FIN DE CONSOLIDACIÓN ===

// --- Componente de Tarjeta de Pago Individual ---
interface PaymentCardProps {
  payment: IPayment;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ payment }) => {
  // Función para obtener el color y el ícono basado en el estado
  const getStatusDisplay = (status: IPayment['status']) => {
    switch (status) {
      case 'completed':
        return {
          text: 'COMPLETADO',
          color: 'bg-green-600 text-white',
          icon: <CheckCircle2 className="w-4 h-4 mr-2" />,
        };
      case 'pending':
        return {
          text: 'PENDIENTE',
          color: 'bg-yellow-500 text-black',
          icon: <Clock className="w-4 h-4 mr-2" />,
        };
      case 'failed':
        return {
          text: 'FALLIDO',
          color: 'bg-red-600 text-white',
          icon: <XCircle className="w-4 h-4 mr-2" />,
        };
      default:
        return {
          text: 'DESCONOCIDO',
          color: 'bg-gray-400 text-white',
          icon: <FileText className="w-4 h-4 mr-2" />,
        };
    }
  };

  const statusDisplay = getStatusDisplay(payment.status);

  return (
    <div className="flex bg-white rounded-xl shadow-lg mb-4 p-4 items-center transition duration-300 ease-in-out hover:shadow-xl">
      
      {/* Columna 1: Comprobante (Placeholder) */}
      <div className="flex-shrink-0 w-32 h-32 flex items-center justify-center bg-gray-200 rounded-lg mr-6">
        <FileText className="w-10 h-10 text-gray-500" />
      </div>

      {/* Columna 2: Detalles del Pago */}
      <div className="flex-grow">
        <div className="text-sm font-semibold text-gray-700 mb-1">
          ID PAGO: <span className="text-gray-900">{payment.id}</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {payment.type}
        </div>
        <div className="text-lg font-bold text-green-600 mb-2">
          Bs. {payment.amount.toFixed(2)}
        </div>
        <div className="flex items-center text-sm font-medium">
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusDisplay.color} mr-2 flex items-center`}>
                {statusDisplay.icon}
                {statusDisplay.text}
            </span>
            <span className="text-gray-500">
                Fecha: {payment.date}
            </span>
        </div>
        <div className="text-sm text-gray-500 mt-1">
            Propiedad: {payment.propertyName}
        </div>
      </div>

      {/* Columna 3: Botón de Acción */}
      <div className="flex-shrink-0 ml-6">
        <button
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150"
          // Corregido: Reemplazado alert() por console.log()
          onClick={() => console.log(`Visualizando detalles del pago ${payment.id}`)}
        >
          VER PAGO
        </button>
      </div>
    </div>
  );
};


// --- Componente de Esqueleto de Carga ---
const LoadingCard: React.FC = () => (
  <div className="flex bg-white rounded-xl shadow-lg mb-4 p-4 items-center">
    <Skeleton className="w-32 h-32 rounded-lg mr-6" />
    <div className="flex-grow space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <Skeleton className="w-28 h-10 ml-6" />
  </div>
);


// --- Componente Principal de la Página de Pagos ---
export default function PaymentsHistoryPage() {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState('NONE');
  const [filterYear, setFilterYear] = useState('NONE');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mantener sidebar visible por defecto
  
  // Lista de filtros de ejemplo para la barra lateral
  const sidebarFilters = [
    {
      title: 'INMUEBLES',
      items: ['Casas', 'Departamentos', 'Locales', 'Campos', 'Oficinas', 'Otros'],
      key: 'inmuebles',
    },
    {
      title: 'PUBLICACIÓN',
      items: ['Más Antiguos', 'Más Recientes'],
      key: 'publicacion',
    },
    {
      title: 'ESTADO',
      items: ['Vencido', 'Activo'],
      key: 'estado',
    },
    // Añadiríamos filtros de TIPO DE PAGO, etc., en una implementación real
  ];

  // Función para obtener los pagos
  const fetchPayments = useCallback(async (query: string = '') => {
    setIsLoading(true);
    try {
      const data = query 
        ? await PaymentService.searchPayments(query) 
        : await PaymentService.getPayments();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      // Opcionalmente, mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efecto para la carga inicial y la búsqueda
  useEffect(() => {
    fetchPayments(searchTerm);
  }, [searchTerm, fetchPayments]); // Vuelve a ejecutar cuando cambia el término de búsqueda

  // Función de filtrado más avanzada (en memoria por simplicidad)
  const filteredPayments = useMemo(() => {
    let result = payments;

    // Filtrado de Mes/Año (simple, se puede mejorar con un selector de fecha real)
    if (filterMonth !== 'NONE') {
      // Lógica de filtrado por mes (Date.getMonth() es 0-indexado)
      result = result.filter(p => {
        const date = new Date(p.date);
        return !isNaN(date.getTime()) && date.getMonth() + 1 === parseInt(filterMonth);
      });
    }
    if (filterYear !== 'NONE') {
      // Lógica de filtrado por año
      result = result.filter(p => {
        const date = new Date(p.date);
        return !isNaN(date.getTime()) && date.getFullYear() === parseInt(filterYear);
      });
    }
    
    // Aquí se aplicarían los filtros de la barra lateral si estuvieran implementados en el estado
    
    return result;
  }, [payments, filterMonth, filterYear]);
  
  const numResults = filteredPayments.length;
  const numMockInmuebles = sidebarFilters[0].items.length; // Número de items de inmuebles para mostrar en el sidebar

  // Opciones de Mes y Año para los selectores
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Header y Navegación del Administrador (Asumido que está fuera de este componente o se añade aquí) */}
      {/* Por la estructura de la imagen, solo necesitamos el contenido central */}
      
      {/* Contenedor Principal */}
      <div className="flex w-full pt-4">
        
        {/* Columna Izquierda: Filtros (Sidebar) */}
        {isSidebarOpen && (
          <div className="w-64 flex-shrink-0 p-4 bg-white shadow-xl rounded-xl mr-4 h-full sticky top-0">
            <h2 className="text-xl font-bold mb-4 text-gray-800">PAGOS</h2>
            <div className="text-sm text-gray-600 mb-6">Nro de resultados: <span className="font-semibold text-gray-900">{numResults}</span></div>

            {sidebarFilters.map((filter) => (
              <div key={filter.key} className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-1 mb-2">{filter.title}</h3>
                <ul className="space-y-1">
                  {filter.items.map((item, index) => (
                    <li key={index} className="text-xs text-gray-700 hover:text-blue-600 cursor-pointer">
                      {item} <span className="text-gray-400">(Nro de {filter.key === 'inmuebles' ? 'casos' : 'otros'})</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Columna Derecha: Contenido Principal (Búsqueda y Lista de Pagos) */}
        <div className="flex-grow p-4">
          
          {/* Bloque de Búsqueda y Filtros de Fecha */}
          <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-sm font-semibold text-gray-700 flex-shrink-0">FECHA:</span>
              
              {/* Selector de Mes */}
              <div className="relative">
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="appearance-none bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8 transition duration-150"
                >
                  {monthOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              
              {/* Selector de Año */}
              <div className="relative">
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="appearance-none bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8 transition duration-150"
                >
                  {yearOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Barra de Búsqueda */}
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="INTRODUZCA EL ID DEL PAGO O PROPIEDAD"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-150"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
          </div>

          {/* Lista de Resultados de Pagos */}
          <div className="space-y-4">
            {isLoading ? (
              // Mostrar esqueletos de carga
              Array.from({ length: 4 }).map((_, index) => <LoadingCard key={index} />)
            ) : numResults === 0 ? (
              // Mostrar mensaje de no resultados
              <div className="text-center p-10 bg-white rounded-xl shadow-lg">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700">No se encontraron pagos</h3>
                <p className="text-sm text-gray-500">Intenta ajustar tus filtros de búsqueda.</p>
              </div>
            ) : (
              // Mostrar las tarjetas de pago
              filteredPayments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}