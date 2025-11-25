// /app/mis-tickets/page.tsx (Código completo y actualizado)

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Star, StarHalf } from 'lucide-react';
import styles from './page.module.css'; 

import Navbar from '@/components/Navbar'; // <-- IMPORTAMOS EL NAVBAR
import { Ticket, TicketStatus, TicketPriority, TicketListResponse } from '@/app/interfaces/ticket.interface'; 
import { fetchUserTickets } from '@/app/services/ticket.service'; 
import Link from 'next/link';

// --- Componentes Reutilizables ---

// Función para obtener la clase de color basada en la prioridad o estado
const getPriorityClasses = (priority: TicketPriority) => {
  switch (priority) {
    case 'ALTA': return styles.priorityAlta;
    case 'MEDIA': return styles.priorityMedia;
    case 'BAJA': return styles.priorityBaja;
    default: return 'bg-gray-400 text-white';
  }
};

// Componente para renderizar las estrellas de calificación
const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center text-yellow-400 space-x-0.5">
      {Array(fullStars).fill(0).map((_, i) => (
        <Star key={`full-${i}`} className="w-5 h-5 fill-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf key="half" className="w-5 h-5 fill-yellow-400" />}
      {Array(emptyStars).fill(0).map((_, i) => (
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      ))}
    </div>
  );
};

// Componente Tarjeta de Ticket (ACTUALIZADO CON TUS NUEVOS ESTILOS)
const TicketCard: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const priorityClasses = getPriorityClasses(ticket.priority);
  
  return (
    <div className={styles.ticketCard}>
      
      {/* Columna de TICKET # (Bloque de Color) */}
      <div className={`${styles.ticketNumberCol} ${priorityClasses}`}>
        <h3 className="text-xl font-bold uppercase">TICKET #{ticket.ticketNumber}</h3>
      </div>

      {/* Columna de Detalles (Flexible) */}
      <div className={styles.ticketDetailsCol}>
        
        {/* Lado Izquierdo: Info del Ticket */}
        <div className={styles.ticketInfoGroup}>
          <p className={styles.ticketIdText}>ID TICKET: {ticket.id}</p>
          <h4 className={styles.ticketPropertyText}>{ticket.propertyName}</h4>
          <p className={styles.ticketTypeText}>{ticket.type}</p>
          
          <div className="flex gap-4 mt-2">
            <p className={styles.ticketPriorityText}>
              Prioridad: <span className="font-semibold">{ticket.priority}</span>
            </p>
            <p className={styles.ticketPriorityText}>
              Estado: <span className="font-semibold">{ticket.status}</span>
            </p>
          </div>
          
        </div>

        {/* Lado Derecho: Calificación y Botón */}
        <div className={styles.ratingAndButton}>
          <p className={styles.ratingLabel}>CALIFICACIÓN DE ASISTENCIA TÉCNICA</p>
          <RatingStars rating={ticket.rating || 0} /> 
          
          <Link href={`/tickets/${ticket.id}`} passHref>
            <button className={styles.viewTicketButton}>
              VER ESTADO
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};


// --- Componente Principal ---

export default function MisTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: TicketListResponse = await fetchUserTickets();
      // Simulación de datos si la respuesta está vacía (solo para visualización del mockup)
      if (response.tickets.length === 0) {
        setTickets([
          { id: '1', ticketNumber: 1, propertyName: 'Nombre de la Propiedad', type: 'TÉCNICO', priority: 'ALTA', status: 'ABIERTO', rating: 3.5, description: '...' },
          { id: '2', ticketNumber: 2, propertyName: 'Nombre de la Propiedad', type: 'TÉCNICO', priority: 'MEDIA', status: 'EN PROGRESO', rating: 2.0, description: '...' },
          { id: '3', ticketNumber: 3, propertyName: 'Nombre de la Propiedad', type: 'TÉCNICO', priority: 'BAJA', status: 'CERRADO', rating: 4.5, description: '...' },
        ] as unknown as Ticket[]);
      } else {
         setTickets(response.tickets || []);
      }
    } catch (err: any) {
      console.error("Error al cargar tickets:", err);
      setError(err.message || 'Error desconocido al cargar tickets.');
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  return (
    <div className={styles.container}>
      <Navbar /> {/* <-- AÑADIMOS EL NAVBAR AQUÍ */}

      <main className={styles.mainContent}>
        
        <h1 className={styles.title}>
          Mis Tickets Creados
        </h1>

        <div className={styles.listWrapper}>
          {error && (
            <div className="text-center py-4 px-6 text-red-700 bg-red-100 rounded-lg border border-red-300">
              Error al cargar: {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Cargando tickets...</div>
          ) : tickets.length === 0 && !error ? ( // Si no hay error pero la lista está vacía
            <div className="text-center py-10 px-6 text-gray-700 bg-white rounded-lg shadow-sm border border-gray-200">
              Error al cargar. Error al cargar los tickets. <br/>
              No has creado ningún ticket. <Link href="/create-ticket" className="text-amber-600 hover:underline font-medium">¡Crea uno ahora!</Link>
            </div>
          ) : (
            <div>
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}