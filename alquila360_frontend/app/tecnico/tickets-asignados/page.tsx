"use client";

import React, { useEffect, useState } from "react";
import TechNavbar from "@/components/TechNavbar";
import styles from "./page.module.css";
import { obtenerTicketsAsignados } from "@/app/services/tecnico-ticket.service";
import { TicketTecnico } from "@/app/interfaces/tecnicoticket.interface";

const TicketsAsignadosPage = () => {
  const [tickets, setTickets] = useState<TicketTecnico[]>([]);
  const idTecnico = 1; // ⚠️ Cambiar según login

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerTicketsAsignados(idTecnico);
        setTickets(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const colores = {
    red: "#D13438",
    orange: "#E66A33",
    green: "#4FAE55",
  };

  const renderStars = (rating: number) => {
    return (
      <>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={i <= rating ? styles.starFilled : styles.starEmpty}>★</span>
        ))}
      </>
    );
  };

  return (
    <>
      <TechNavbar />

      <div className={styles.container}>
        <div className={styles.scrollContainer}>

          {tickets.map((t) => (
            <div key={t.id} className={styles.ticketCard}>
              
              {/* IZQUIERDA — Color del ticket */}
              <div
                //className={styles.ticketColor}
                //style={{ backgroundColor: colores[t.color]}}

              >
                TICKET #{t.id}
              </div>

              {/* CONTENIDO CENTRAL */}
              <div className={styles.ticketInfo}>
                <span className={styles.ticketLabel}>ID TICKET</span>
                <h3 className={styles.ticketProp}>{t.propiedad}</h3>

                <p className={styles.ticketTecnico}>TÉCNICO</p>
                <p>Prioridad: {t.prioridad}</p>
                <p>Estado: {t.estado}</p>
              </div>

              {/* DERECHA — Calificación */}
              <div className={styles.ratingSection}>
                <p className={styles.ratingTitle}>CALIFICACIÓN DE ASISTENCIA TÉCNICA</p>

                <div className={styles.starsContainer}>
                  {renderStars(t.calificacion)}
                </div>

                <button className={styles.viewBtn}>VER TICKET</button>
              </div>
            </div>
          ))}

        </div>

        {/* Scroll Bar personalizado */}
        <div className={styles.scrollBar}>
          <span className={styles.arrowUp}>▲</span>
          <span className={styles.bar}></span>
          <span className={styles.arrowDown}>▼</span>
        </div>
      </div>
    </>
  );
};

export default TicketsAsignadosPage;
