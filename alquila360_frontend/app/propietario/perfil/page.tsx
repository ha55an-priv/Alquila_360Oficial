"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Navbar from "@/components/PropNavbar"; // Ajusta la ruta si es necesario
import { getOwnerProfile } from "@/app/services/owner.service";
import { OwnerProfile } from "@/app/interfaces/owner.interface";

const OwnerProfilePage = () => {
  const [owner, setOwner] = useState<OwnerProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOwnerProfile();
      setOwner(data);
    };
    fetchData();
  }, []);

  if (!owner) return <div className={styles.loading}>Cargando perfil...</div>;

  return (
    <>
      <Navbar />
      <main className={styles.profileContainer}>
        <h2 className={styles.sectionTitle}>DATOS PERSONALES</h2>
        <div className={styles.infoGrid}>
          <p><strong>CI:</strong> {owner.ci}</p>
          <p><strong>Nombre Completo:</strong> {owner.fullName}</p>
          <p><strong>Fecha de Nacimiento:</strong> {owner.birthDate}</p>
          <p><strong>Contacto:</strong> {owner.phone}</p>
          <p><strong>Email:</strong> {owner.email}</p>
        </div>

        <h2 className={styles.sectionTitle}>INFORMACIÓN DE PROPIEDADES</h2>
        <div className={styles.infoGrid}>
          <p><strong>Propiedades Registradas:</strong> {owner.totalProperties}</p>
          <p><strong>Contratos Activos:</strong> {owner.activeContracts}</p>
        </div>

        <h2 className={styles.sectionTitle}>CALIFICACIÓN RECIBIDA</h2>
        <div className={styles.rating}>
          {"★".repeat(owner.rating)}{"☆".repeat(5 - owner.rating)}
        </div>

        <h2 className={styles.sectionTitle}>REGISTROS</h2>
        <div className={styles.infoGrid}>
          <p><strong>Ingresos:</strong> Bs {owner.totalIncome}</p>
          <p><strong>Propiedades Alquiladas:</strong> {owner.rentedProperties}</p>
        </div>
      </main>
    </>
  );
};

export default OwnerProfilePage;