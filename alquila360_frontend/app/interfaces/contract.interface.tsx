export interface Contract {
  id: string;
  contractId: string; // ID visible del contrato, ej: C-2024-001
  property: {
    name: string;
    type: 'Casa' | 'Departamento' | 'Local' | 'Campo' | 'Oficina' | 'Otro';
    address: string;
  };
  tenant: {
    id: string;
    fullName: string;
  };
  owner: { // O la parte que alquila, si el admin gestiona ambos
    id: string;
    fullName: string;
  };
  price: number; // Precio mensual o total, según la lógica de tu negocio
  currency: string;
  startDate: string; // Formato ISO, ej: '2024-01-01'
  endDate: string; // Formato ISO
  status: 'Activo' | 'Vencido' | 'Pendiente' | 'Cancelado';
  // En el mockup se menciona 'DOCUMENTO DIGITAL' (un enlace o ID para acceder al archivo)
  documentUrl: string; 
}

/**
 * Define la estructura de los parámetros de búsqueda y filtro.
 */
export interface ContractFilterParams {
    searchQuery: string;
    month: string; // 'none', '1', '2', etc.
    year: string; // 'none', '2023', '2024', etc.
    propertyType: string; // 'all', 'Casa', 'Departamento', etc.
    status: string; // 'all', 'Activo', 'Vencido', etc.
    sortOrder: 'recent' | 'old' | 'price_asc' | 'price_desc';
}