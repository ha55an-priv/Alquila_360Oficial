import { instance } from "../utils/axios.util"; 
import { isAxiosError } from "axios";
import { Contract, ContractFilterParams } from '@/app/interfaces/contract.interface';

const CONTRACTS_API_URL = '/admin/contracts'; 

// --- Datos simulados para desarrollo ---
const mockContracts: Contract[] = [
    {
        id: 'c-001',
        contractId: 'C-2024-001',
        property: { name: 'Casa en Av. Las Lomas', type: 'Casa', address: 'Av. Las Lomas #123' },
        tenant: { id: 'u-101', fullName: 'Ana María Pérez' },
        owner: { id: 'u-201', fullName: 'Ricardo Gómez' },
        price: 850,
        currency: 'USD',
        startDate: '2024-01-15',
        endDate: '2024-12-15',
        status: 'Activo',
        documentUrl: '/docs/c-2024-001.pdf',
    },
    {
        id: 'c-002',
        contractId: 'C-2023-045',
        property: { name: 'Oficina Central Torre B', type: 'Oficina', address: 'Calle Potosí #45' },
        tenant: { id: 'u-102', fullName: 'Inversiones Sigma Ltda.' },
        owner: { id: 'u-202', fullName: 'Desarrollos Urbanos S.A.' },
        price: 1500,
        currency: 'USD',
        startDate: '2023-05-01',
        endDate: '2024-05-01',
        status: 'Vencido',
        documentUrl: '/docs/c-2023-045.pdf',
    },
    {
        id: 'c-003',
        contractId: 'C-2024-010',
        property: { name: 'Departamento Zona Norte 3B', type: 'Departamento', address: 'C. 3 #10' },
        tenant: { id: 'u-103', fullName: 'Juan Carlos Mamani' },
        owner: { id: 'u-203', fullName: 'Elena Vargas' },
        price: 550,
        currency: 'USD',
        startDate: '2024-03-20',
        endDate: '2025-03-20',
        status: 'Activo',
        documentUrl: '/docs/c-2024-010.pdf',
    },
];
// --- Fin de datos simulados ---

/**
 * Obtiene la lista de contratos del administrador con filtros.
 * @param params Los parámetros de búsqueda y filtrado.
 * @returns Una promesa que resuelve a un array de objetos Contract.
 */
export const getAdminContracts = async (params: ContractFilterParams): Promise<Contract[]> => {
  try {
    // En un entorno real, usarías:
    // const response = await instance.get<Contract[]>(CONTRACTS_API_URL, { params });
    // return response.data;
    
    // SIMULACIÓN: Filtrado y ordenamiento en el frontend basado en el mockup
    
    let filteredContracts = mockContracts.filter(contract => {
        // 1. Filtrado por Búsqueda (ID o Nombre de Propiedad)
        if (params.searchQuery) {
            const query = params.searchQuery.toLowerCase();
            if (!(contract.contractId.toLowerCase().includes(query) || 
                  contract.property.name.toLowerCase().includes(query))) {
                return false;
            }
        }

        // 2. Filtrado por Tipo de Inmueble
        if (params.propertyType !== 'all' && params.propertyType !== contract.property.type) {
            return false;
        }

        // 3. Filtrado por Estado
        if (params.status !== 'all' && params.status !== contract.status) {
            return false;
        }

        // 4. Filtrado por Fecha (Año y Mes) - Simplificado
        // NOTA: Implementar el filtrado de fecha de forma completa requiere más lógica.
        // Aquí solo simulamos que el año debe coincidir con la fecha de inicio.
        if (params.year !== 'none') {
            const startYear = new Date(contract.startDate).getFullYear().toString();
            if (startYear !== params.year) {
                return false;
            }
        }
        
        return true;
    });
    
    // 5. Ordenamiento (Sort)
    if (params.sortOrder === 'price_asc') {
        filteredContracts.sort((a, b) => a.price - b.price);
    } else if (params.sortOrder === 'price_desc') {
        filteredContracts.sort((a, b) => b.price - a.price);
    } else if (params.sortOrder === 'recent') {
        // Ordena por fecha de inicio descendente (más recientes primero)
        filteredContracts.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    } else if (params.sortOrder === 'old') {
        // Ordena por fecha de inicio ascendente (más antiguos primero)
        filteredContracts.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    }
    
    return filteredContracts;


  } catch (error) {
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error al cargar los contratos.';
      throw new Error(errorMessage);
    }
    // Si falla, devuelve los datos simulados sin filtrar
    console.warn("Error real al cargar los contratos. Usando datos simulados.");
    return mockContracts;
  }
};