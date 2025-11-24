import { IPayment } from '@/app/interfaces/payment.interface'; // Usamos la ruta absoluta en el servicio (Mock)

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
export const PaymentService = {
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