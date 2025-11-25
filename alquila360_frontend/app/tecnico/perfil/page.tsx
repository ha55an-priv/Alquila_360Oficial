"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import TechNavbar from "@/components/TechNavbar";
import { Tecnico } from "@/app/interfaces/tecnico.interface";
import { getTecnicoById } from "@/app/services/tecnico.service";
import { Star } from "lucide-react";

const PerfilTecnicoPage = () => {
  const [tecnico, setTecnico] = useState<Tecnico | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTecnicoById(1); // <-- ID de prueba
        setTecnico(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  if (!tecnico) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  return (
    <>
      <TechNavbar />

      <div className={styles.container}>
        {/* Panel Izquierdo */}
        <div className={styles.leftPanel}>
          <div className={styles.avatar}></div>
          <h2 className={styles.roleText}>TÉCNICO</h2>
        </div>

        {/* Panel Central */}
        <div className={styles.centerPanel}>
          <h3 className={styles.sectionTitle}>DATOS PERSONALES</h3>

          <ul className={styles.detailsList}>
            <li>CI: {tecnico.ci}</li>
            <li>NOMBRE COMPLETO: {tecnico.nombreCompleto}</li>
            <li>FECHA DE NACIMIENTO: {tecnico.fechaNacimiento}</li>
            <li>CONTACTO: {tecnico.contacto}</li>
            <li>EMAIL: {tecnico.email}</li>
          </ul>
        </div>

        {/* Panel Derecho */}
        <div className={styles.rightPanel}>
          <div className={styles.box}>
            <h3 className={styles.sectionTitle}>ACTIVIDAD DEL TÉCNICO</h3>
            <ul>
              <li>TICKETS ASIGNADOS: {tecnico.ticketsAsignados}</li>
            </ul>
          </div>

          <div className={styles.box}>
            <h3 className={styles.sectionTitle}>CALIFICACIÓN RECIBIDA</h3>

            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={26}
                  color={i <= tecnico.calificacion ? "#fbbf24" : "#d1d5db"}
                  fill={i <= tecnico.calificacion ? "#fbbf24" : "none"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PerfilTecnicoPage;
