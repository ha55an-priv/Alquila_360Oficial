"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import { getTenantProfile } from "@/app/services/tenant.service";
import { TenantProfile } from "@/app/interfaces/tenant.interface";

const TenantProfilePage = () => {
  const [tenant, setTenant] = useState<TenantProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTenantProfile();
      setTenant(data);
    };
    fetchData();
  }, []);

  if (!tenant) return <div className={styles.loading}>Cargando perfil...</div>;

  return (
    <>
      <Navbar />
      <main className={styles.profileContainer}>
        <h2 className={styles.sectionTitle}>DATOS PERSONALES</h2>
        <div className={styles.infoGrid}>
          <p><strong>CI:</strong> {tenant.ci}</p>
          <p><strong>Nombre Completo:</strong> {tenant.fullName}</p>
          <p><strong>Fecha de Nacimiento:</strong> {tenant.birthDate}</p>
          <p><strong>Contacto:</strong> {tenant.phone}</p>
          <p><strong>Email:</strong> {tenant.email}</p>
        </div>

        <h2 className={styles.sectionTitle}>INFORMACIÓN DE CONTRATOS</h2>
        <div className={styles.infoGrid}>
          <p><strong>Contratos Finalizados:</strong> {tenant.finishedContracts}</p>
          <p><strong>Propiedades Alquiladas:</strong> {tenant.rentedProperties}</p>
          <p><strong>Cuotas Pendientes:</strong> {tenant.pendingPayments}</p>
          <p><strong>Tickets Abiertos:</strong> {tenant.openTickets}</p>
        </div>

        <h2 className={styles.sectionTitle}>MÉTODO DE PAGO REGISTRADO</h2>
        <div className={styles.infoGrid}>
          <p><strong>Método:</strong> {tenant.paymentMethod}</p>
          <p><strong>Estado:</strong> {tenant.paymentStatus}</p>
        </div>
      </main>
    </>
  );
};

export default TenantProfilePage;