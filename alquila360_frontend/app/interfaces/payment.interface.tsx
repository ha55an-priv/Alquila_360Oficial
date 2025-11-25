export interface IPayment {
  id: string; // ID del pago (e.g., "PAGO-001")
  type: string; // Tipo de pago (e.g., "Alquiler mensual", "Gasto de reparación")
  amount: number; // Monto del pago
  status: 'pending' | 'completed' | 'failed'; // Estado del pago
  date: string; // Fecha de registro del pago (formato "YYYY-MM-DD")
  propertyName: string; // Nombre o descripción de la propiedad asociada
  contractId: string; // ID del contrato asociado
  payerName: string; // Nombre de la persona que realiza el pago (Inquilino/Administrador)
}