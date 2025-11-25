export interface NewPayment {
  price: number;
  date: string;
  description: string;
  method: "TRANSFERENCIA" | "QR";
  receipt?: File;
}