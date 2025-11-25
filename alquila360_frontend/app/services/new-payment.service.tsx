import { NewPayment } from "@/app/interfaces/new-payment.interface";

export const registerNewPayment = async (payment: NewPayment): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append("price", payment.price.toString());
    formData.append("date", payment.date);
    formData.append("description", payment.description);
    formData.append("method", payment.method);
    if (payment.receipt) {
      formData.append("receipt", payment.receipt);
    }

    const response = await fetch("/api/payments/register", {
      method: "POST",
      body: formData,
    });

    return response.ok;
  } catch (error) {
    console.error("Error al registrar pago:", error);
    return false;
  }
};