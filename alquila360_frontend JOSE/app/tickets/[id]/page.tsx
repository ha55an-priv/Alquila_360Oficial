"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Para navegar
import { Star } from 'lucide-react'; // Icono de estrella
import Navbar from '@/components/Navbar'; // Tu componente Navbar
import { Dialog, DialogContent } from '@/components/ui/dialog'; // Para el modal de reseña
import { Textarea } from '@/components/ui/textarea'; // Para el área de reseña
import styles from './page.module.css'; // Tus estilos CSS Modules

// Importamos las interfaces y servicios
import { Ticket, TicketPriority, TicketStatus, TicketReviewPayload } from '@/app/interfaces/ticket.interface';
import { getTicketById, submitTicketReview } from '@/app/services/ticket.service';

// --- Componentes Reutilizables ---

// Componente para renderizar las estrellas de calificación interactivas
const InteractiveRatingStars: React.FC<{
  initialRating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}> = ({ initialRating, onRatingChange, disabled = false }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const currentRating = hoverRating || initialRating;

  return (
    <div className={styles.ratingStars}>
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <Star
          key={starIndex}
          className={`${styles.starIcon} ${currentRating >= starIndex ? styles.filled : ''}`}
          onMouseEnter={() => !disabled && setHoverRating(starIndex)}
          onMouseLeave={() => !disabled && setHoverRating(0)}
          onClick={() => !disabled && onRatingChange(starIndex)}
          style={{ cursor: disabled ? 'default' : 'pointer' }}
        />
      ))}
    </div>
  );
};

// Componente principal de la página de detalle del ticket
export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params; // ID del ticket de la URL
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para la reseña
  const [userRating, setUserRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Función para cargar el ticket
  const loadTicket = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTicket = await getTicketById(id);
      setTicket(fetchedTicket);
      // Inicializar la reseña con los datos existentes si los hay
      if (fetchedTicket.rating > 0) setUserRating(fetchedTicket.rating);
      if (fetchedTicket.reviewText) setReviewText(fetchedTicket.reviewText);
    } catch (err: any) {
      console.error("Error al cargar el ticket:", err);
      setError(err.message || 'Error desconocido al cargar el ticket.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Efecto para cargar el ticket cuando el ID cambia
  useEffect(() => {
    if (id) {
      loadTicket();
    }
  }, [id, loadTicket]);

  // Manejador para enviar la reseña
  const handleSubmitReview = async () => {
    if (userRating === 0) {
      alert('Por favor, selecciona una calificación.');
      return;
    }
    setIsSubmittingReview(true);
    setError(null);

    const payload: TicketReviewPayload = {
      rating: userRating,
      reviewText: reviewText.trim() === '' ? undefined : reviewText,
    };

    try {
      const updatedTicket = await submitTicketReview(id, payload);
      setTicket(updatedTicket); // Actualiza el ticket con la reseña enviada
      setIsReviewModalOpen(true); // Abre el modal de confirmación
    } catch (err: any) {
      console.error("Error al publicar la reseña:", err);
      setError(err.message || 'Error desconocido al publicar la reseña.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        {/* <Navbar /> */}
        <main className={styles.mainContent}>
          <div className="text-center py-20 text-gray-500">Cargando detalles del ticket...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        {/* <Navbar /> */}
        <main className={styles.mainContent}>
          <div className="text-center py-20 text-red-600">Error: {error}</div>
          <button className={styles.backButton} onClick={() => router.back()}>
            VOLVER
          </button>
        </main>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className={styles.container}>
        {/* <Navbar /> */}
        <main className={styles.mainContent}>
          <div className="text-center py-20 text-gray-500">Ticket no encontrado.</div>
          <button className={styles.backButton} onClick={() => router.back()}>
            VOLVER
          </button>
        </main>
      </div>
    );
  }

  // --- Renderizado del Ticket ---
  return (
    <div className={styles.container}>
      {/* <Navbar /> */} {/* Comentar si sigue dando el error de compilación */}

      <main className={styles.mainContent}>
        <div className={styles.ticketLayout}>
          
          {/* 1. Sección de Fotos */}
          <div className={styles.photoSection}>
            FOTOS (Pendiente de implementación)
            {/* Aquí puedes mapear `ticket.photos` para mostrar imágenes */}
          </div>

          {/* 2. Sección de Detalles del Ticket */}
          <div className={styles.detailsSection}>
            <p className={styles.ticketId}>ID TICKET: {ticket.id}</p>
            <h2 className={styles.propertyName}>Nombre de la Propiedad: {ticket.propertyName}</h2>
            <p className={styles.ticketType}>{ticket.type}</p>
            
            <div className={styles.priorityGroup}>
              <span className="font-medium text-gray-600">Prioridad:</span>
              <div 
                className={`${styles.priorityCircle} ${ticket.priority === 'ALTA' ? styles.priorityRed : ''}`}
                data-selected={ticket.priority === 'ALTA'}
                title="Prioridad Alta"
              />
              <div 
                className={`${styles.priorityCircle} ${ticket.priority === 'MEDIA' ? styles.priorityOrange : ''}`}
                data-selected={ticket.priority === 'MEDIA'}
                title="Prioridad Media"
              />
              <div 
                className={`${styles.priorityCircle} ${ticket.priority === 'BAJA' ? styles.priorityGreen : ''}`}
                data-selected={ticket.priority === 'BAJA'}
                title="Prioridad Baja"
              />
            </div>
            
            <p className={styles.ticketStatus}>Estado: {ticket.status}</p>

            <div className={styles.descriptionBox}>
              <p className="font-semibold mb-2">Descripción del ticket:</p>
              <p>{ticket.description}</p>
            </div>

            <button
              className={styles.backButton}
              onClick={() => router.push('/mis-tickets')}
            >
              VOLVER A LISTA DE TICKETS
            </button>
          </div>

          {/* 3. Sección de Reseña y Calificación */}
          <div className={styles.reviewSection}>
            <p className={styles.ratingLabel}>CALIFICACIÓN DE ASISTENCIA TÉCNICA</p>
            <InteractiveRatingStars
              initialRating={userRating}
              onRatingChange={setUserRating}
              disabled={ticket.status === 'ABIERTO' || ticket.status === 'EN PROGRESO'} // Deshabilita si el ticket no está cerrado
            />

            <label htmlFor="reviewTextarea" className={styles.ratingLabel}>Reseña de asistencia técnica</label>
            <Textarea
              id="reviewTextarea"
              className={styles.reviewTextarea}
              placeholder="Publica tu opinión..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              disabled={ticket.status === 'ABIERTO' || ticket.status === 'EN PROGRESO'}
            />

            <button 
              className={styles.publishButton}
              onClick={handleSubmitReview}
              disabled={isSubmittingReview || userRating === 0 || ticket.status === 'ABIERTO' || ticket.status === 'EN PROGRESO'}
            >
              {isSubmittingReview ? 'PUBLICANDO...' : 'PUBLICAR'}
            </button>
          </div>
        </div>
      </main>

      {/* Modal de confirmación "RESEÑA PUBLICADA" */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className={styles.modalContent}>
          <h2 className={styles.modalTitle}>RESEÑA PUBLICADA</h2>
          <div className={styles.modalActions}>
            <button className={styles.modalButton} onClick={() => setIsReviewModalOpen(false)}>
              CERRAR
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}