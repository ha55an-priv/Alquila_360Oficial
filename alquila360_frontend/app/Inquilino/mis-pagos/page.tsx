"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import { getTenantPayments } from "@/app/services/tenant-payment.service";
import { TenantPayment } from "@/app/interfaces/tenant-payment.interface";

const TenantPaymentsPage = () => {
  const [payments, setPayments] = useState<TenantPayment[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const data = await getTenantPayments();
      setPayments(data);
    };
    fetchPayments();
  }, []);

  return (
    <>
      <Navbar />
      <main className={styles.pageContainer}>
        <h2 className={styles.pageTitle}>Mis Pagos</h2>

        {payments.length === 0 ? (
          <p className={styles.emptyMessage}>No tienes pagos registrados aún.</p>
        ) : (
          <div className={styles.paymentList}>
            {payments.map((payment) => (
              <div key={payment.id} className={styles.paymentCard}>
                <div className={styles.documentLabel}>D PAGO</div>

                <div className={styles.paymentInfo}>
                  <p><strong>Tipo de pago:</strong> {payment.type}</p>
                  <p><strong>Precio:</strong> Bs {payment.amount}</p>
                  <p><strong>Estado:</strong> {payment.status}</p>
                  <p><strong>Fecha de registro:</strong> {payment.date}</p>
                </div>

                <div className={styles.actionButtons}>
                  <button className={styles.viewButton}>VER PAGO</button>
                  <span className={styles.receiptTag}>COMPROBANTE</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.newPaymentSection}>
          <button className={styles.newPaymentButton}>NUEVO PAGO</button>
        </div>
      </main>
    </>
  );
};

export default TenantPaymentsPage;