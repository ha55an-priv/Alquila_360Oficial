"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Star, StarHalf } from 'lucide-react';
import styles from './page.module.css'; 

import Navbar from '@/components/Navbar'; 
import { Ticket, TicketStatus, TicketPriority, TicketListResponse } from '@/app/interfaces/ticket.interface'; 
import { fetchUserTickets } from '@/app/services/ticket.service'; // Importamos el nuevo servicio
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

// Componente Tarjeta de Ticket
const TicketCard: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const priorityClasses = getPriorityClasses(ticket.priority);
  
  return (
    <div className={styles.ticketCard}>
      
      {/* Columna de TICKET # */}
      <div className={`${styles.ticketNumberCol} ${priorityClasses}`}>
        <h3 className="text-xl font-bold uppercase">TICKET #{ticket.ticketNumber}</h3>
      </div>

      {/* Columna de Detalles */}
      <div className={styles.ticketDetailsCol}>
        <div className={styles.ticketInfoGroup}>
          <p className="text-sm font-medium text-gray-500">ID TICKET: {ticket.id}</p>
          <h4 className="text-lg font-semibold text-gray-800">{ticket.propertyName}</h4>
          <p className="text-md font-bold text-gray-900">{ticket.type}</p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 
              ${ticket.priority === 'ALTA' ? 'bg-red-100 text-red-700' : 
                ticket.priority === 'MEDIA' ? 'bg-orange-100 text-orange-700' : 
                'bg-green-100 text-green-700'}`}
          >
            Prioridad: {ticket.priority}
          </span>
          <span className="text-xs text-gray-600 mt-0.5">Estado: {ticket.status}</span>
        </div>

        {/* Calificación y Botón */}
        <div className={styles.ratingAndButton}>
          <p className="text-sm font-medium text-gray-600">CALIFICACIÓN DE ASISTENCIA TÉCNICA</p>
          <RatingStars rating={ticket.rating} />
          <Link href={`/tickets/${ticket.id}`} passHref>
            <button className={styles.viewTicketButton}>
              VER TICKET
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

  // Ahora usamos la función del servicio
  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: TicketListResponse = await fetchUserTickets();
      setTickets(response.tickets || []);
    } catch (err: any) {
      // Capturamos el error de la función de servicio
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
      {/* <Navbar /> */}

      <main className={styles.mainContent}>
        
        <h1 className={styles.title}>
          Mis Tickets Creados
        </h1>

        <div className={styles.listWrapper}>
          {error && (
            <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg border border-red-200">
              Error al cargar: {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Cargando tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No has creado ningún ticket. <Link href="/create-ticket" className="text-amber-600 hover:underline">¡Crea uno ahora!</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>

        {/* Scrollbar de ejemplo del mockup (Simulado con un div de margen) */}
        <div className="h-10"></div>
        
      </main>
    </div>
  );
}