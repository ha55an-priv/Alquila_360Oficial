"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";

const NewPaymentPage = () => {
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [method, setMethod] = useState<"TRANSFERENCIA" | "QR" | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handleSubmit = () => {
    // Simulación de envío
    setPaymentConfirmed(true);
  };

  const handleReset = () => {
    setPaymentConfirmed(false);
    setShowQR(false);
    setMethod(null);
  };

  return (
    <>
      <Navbar />
      <main className={styles.pageContainer}>
        {!paymentConfirmed ? (
          <>
            <h2 className={styles.pageTitle}>Tipo de pago</h2>

            <div className={styles.formGroup}>
              <label>PRECIO</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Monto en Bs"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Fecha de registro</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Descripción del pago</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Pago mensual de alquiler"
                className={styles.textarea}
              />
            </div>

            <h3 className={styles.sectionTitle}>MÉTODO DE PAGO</h3>
            <div className={styles.methodButtons}>
              <button
                className={`${styles.methodButton} ${
                  method === "TRANSFERENCIA" ? styles.active : ""
                }`}
                onClick={() => {
                  setMethod("TRANSFERENCIA");
                  setShowQR(false);
                }}
              >
                TRANSFERENCIA
              </button>
              <button
                className={`${styles.methodButton} ${
                  method === "QR" ? styles.active : ""
                }`}
                onClick={() => {
                  setMethod("QR");
                  setShowQR(true);
                }}
              >
                PAGO QR
              </button>
            </div>

            {method === "QR" && showQR && (
              <div className={styles.qrContainer}>
                <h3 className={styles.qrTitle}>QR GENERADO</h3>
                <div className={styles.qrBox}>
                  <img src="/qr-placeholder.png" alt="Código QR" className={styles.qrImage} />
                </div>
                <p className={styles.qrDetails}>MONTO: Bs {price || "0.00"}</p>
                <p className={styles.qrDetails}>FECHA: {date || "DD/MM/AA"}</p>
                <button className={styles.qrPayButton} onClick={handleSubmit}>
                  PAGAR
                </button>
              </div>
            )}

            <div className={styles.formGroup}>
              <label>AÑADIR COMPROBANTE DE PAGO</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                className={styles.fileInput}
              />
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.backButton}>VOLVER A LISTA DE PAGOS</button>
              <button className={styles.submitButton} onClick={handleSubmit}>
                REGISTRAR PAGO
              </button>
            </div>
          </>
        ) : (
          <div className={styles.confirmationBox}>
            <h2 className={styles.confirmationTitle}>PAGO REGISTRADO</h2>
            <button className={styles.resetButton} onClick={handleReset}>
              VOLVER A REGISTRO DE PAGO
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default NewPaymentPage;