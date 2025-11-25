"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TechNavbar from "@/components/TechNavbar";
import styles from "./page.module.css";
import { obtenerTicketsAsignados} from "@/app/services/tecnico-ticket.service";
import { TicketTecnico } from "@/app/interfaces/tecnicoticket.interface";

const DetalleTicketPage = () => {
  const [ticket, setTicket] = useState<TicketTecnico | null>(null);
  const searchParams = useSearchParams();
  const ticketId = Number(searchParams.get("id"));

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await obtenerTicketsAsignados(ticketId);
        setTicket(data.find((t) => t.id === ticketId) || null);
      } catch (err) {
        console.error(err);
      }
    };

    if (ticketId) fetchTicket();
  }, [ticketId]);

  const colores = {
    red: "#D13438",
    orange: "#E66A33",
    green: "#4FAE55",
  };

  const renderStars = (rating: number) => (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </>
  );

  if (!ticket) return <p className={styles.loading}>Cargando ticket...</p>;

  return (
    <>
      <TechNavbar />

      <div className={styles.container}>
        <div className={styles.ticketHeader}>
          <h2>TICKET #{ticket.id}</h2>
          <span /*className={styles.priority} style={{ backgroundColor: colores[ticket.color] }}*/>
            Prioridad: {ticket.prioridad}
          </span>
        </div>

        <div className={styles.ticketBody}>
          <div className={styles.leftColumn}>
            <div className={styles.imagePlaceholder}>FOTOS</div>
          </div>

          <div className={styles.rightColumn}>
            <h3 className={styles.propiedad}>{ticket.propiedad}</h3>
            <p><strong>Técnico:</strong> {ticket.tecnico}</p>
            <p><strong>Estado:</strong> {ticket.estado}</p>

            <div className={styles.descripcion}>
              <h4>Descripción del ticket</h4>
              <p>{ticket.descripcion}</p>
            </div>

            <div className={styles.ratingSection}>
              <p className={styles.ratingTitle}>Calificación de asistencia técnica</p>
              <div className={styles.starsContainer}>{renderStars(ticket.calificacion)}</div>
              <p className={styles.reseñas}><strong>Reseñas:</strong> {ticket.calificacion || "Sin reseñas"}</p>
            </div>

            <div className={styles.actions}>
              <button className={styles.backBtn}>VOLVER A LISTA DE TICKETS</button>
              <button className={styles.updateBtn}>ACTUALIZAR TICKET</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetalleTicketPage;