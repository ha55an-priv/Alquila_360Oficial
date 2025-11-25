// app/create-ticket/page.tsx (CÓDIGO COMPLETO Y ACTUALIZADO)

'use client'; 

import React, { useState } from 'react';
import Link from 'next/link'; // Importamos Link para la navegación de botones
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';

// Importamos el servicio y las interfaces (asegúrate de que estas rutas sean correctas)
import { createTicket } from '@/app/services/ticket.service';
// import { CreateTicketPayload, TicketResponse } from '@/app/interfaces/ticket.interface';

// Importamos los estilos específicos de la página
import styles from './page.module.css'; 

// Definición interna de tipos para el estado del formulario
interface TicketFormState {
  nombreDelProblema: string;
  descripcion: string;
  prioridad: 'baja' | 'media' | 'alta';
  // Agrega un campo para la imagen, si planeas manejar la subida
  // imageFile: File | null; 
}

export default function CreateTicketPage() {
  const [formData, setFormData] = useState<TicketFormState>({
    nombreDelProblema: '',
    descripcion: '',
    prioridad: 'media', // Prioridad inicial: Naranja/Media
    // imageFile: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Para deshabilitar el botón

  // Función para actualizar la prioridad
  const handlePriorityChange = (newPriority: 'baja' | 'media' | 'alta') => {
    setFormData(prev => ({...prev, prioridad: newPriority}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // 1. Crear el payload con los datos mínimos requeridos por el servicio
      const payload = {
        nombrePropiedadId: 'ID_DE_PROPIEDAD_ASIGNADA', // **IMPORTANTE: Reemplazar con el valor real**
        nombreDelProblema: formData.nombreDelProblema,
        descripcion: formData.descripcion,
        prioridad: formData.prioridad, // Enviar 'baja' | 'media' | 'alta' tal como espera CreateTicketPayload
        // fotos: [], // Si no hay fotos, enviar array vacío o omitir
      };

      // 2. Llamar al servicio (asumimos que existe y maneja la autenticación)
      await createTicket(payload);
      
      // 3. Manejo de éxito
      console.log('Ticket creado con éxito.');
      setIsModalOpen(true);
      
      // Opcional: Limpiar el formulario después del envío exitoso
      setFormData({ nombreDelProblema: '', descripcion: '', prioridad: 'media' });

    } catch (error) {
      // 4. Manejo de error
      console.error('Fallo al crear el ticket:', error instanceof Error ? error.message : 'Error desconocido');
      // Aquí se podría usar un componente de alerta/toast para notificar al usuario.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}> {/* Usamos una clase CSS Module para el contenedor de la página */}
      <Navbar /> 

      {/* Contenedor principal del formulario */}
      <main className={styles.mainContent}>
        <form onSubmit={handleSubmit} className={styles.formCard}> {/* Cambiamos a formCard para el fondo blanco */}
          <div className={styles.ticketLayout}>
            
            {/* 1. Columna Izquierda: Fotos y Prioridad */}
            <div className={styles.leftColumn}>
              <div className={styles.photoUploadBox}>
                <p className={styles.photoUploadText}>AÑADIR FOTOS</p>
                {/* Aquí podrías añadir un input type="file" */}
                {/* <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" /> */}
              </div>

              <div className={styles.prioritySelection}>
                <p className={styles.label}>SELECCIONAR PRIORIDAD</p>
                <div className={styles.priorityButtonsGroup}>
                  {/* Botones de Prioridad */}
                  {['alta', 'media', 'baja'].map((p) => (
                    <button 
                      key={p}
                      type="button" 
                      className={`${styles.priorityDot} ${styles[p]} ${formData.prioridad === p ? styles.selectedPriority : ''}`} 
                      onClick={() => handlePriorityChange(p as 'baja' | 'media' | 'alta')} 
                      title={`Prioridad ${p}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Columna Derecha: Información y Descripción */}
            <div className={styles.rightColumn}>
              
              {/* Grupo de Entradas de Información */}
              <div className={styles.infoFieldsGroup}>
                <div className={styles.infoField}>
                  <label className={styles.infoLabel}>NOMBRE INQUILINO:</label>
                  <p className={styles.infoValue}>**[Usuario Actual]**</p>
                </div>
                
                <div className={styles.infoField}>
                  <label className={styles.infoLabel}>NOMBRE PROPIEDAD:</label>
                  <p className={styles.infoValue}>**[Propiedad Asignada]**</p>
                </div>

                <div className={`${styles.infoField} ${styles.problemInput}`}>
                  <input 
                    type="text" 
                    placeholder="NOMBRE DEL PROBLEMA"
                    value={formData.nombreDelProblema}
                    onChange={(e) => setFormData(prev => ({...prev, nombreDelProblema: e.target.value}))}
                    className={styles.textInput}
                    aria-label="Nombre del Problema"
                  />
                </div>
                
                {/* Tarjeta de Ticket # (Generado) */}
                <div className={styles.ticketNumberBox}>
                  TICKET # (GENERADO)
                </div>
              </div>

              {/* Área de Descripción */}
              <div className={styles.descriptionSection}>
                <label htmlFor="descripcion" className={styles.label}>
                  AÑADIR DESCRIPCIÓN
                </label>
                <Textarea 
                  id="descripcion" 
                  className={styles.descriptionTextarea}
                  rows={6} // Reducimos filas para que se ajuste mejor al mockup
                  placeholder="Describe el problema detalladamente..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({...prev, descripcion: e.target.value}))}
                  aria-label="Descripción del problema"
                />
              </div>

              {/* Contenedor de Botones de Acción */}
              <div className={styles.actionButtons}>
                <Link href="/mis-tickets" passHref>
                  <Button asChild className={`${styles.actionButton} ${styles.viewTicketsButton}`}>
                    <span>VER TICKETS</span>
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting} className={`${styles.actionButton} ${styles.createTicketButton}`}>
                  {isSubmitting ? 'CREANDO...' : 'CREAR TICKET'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Modal de confirmación "TICKET CREADO" */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={styles.dialogContent}>
          <h2 className={styles.dialogTitle}>TICKET CREADO</h2>
          <div className={styles.dialogActions}>
            <Button onClick={() => setIsModalOpen(false)} className={styles.dialogButton}>
              CERRAR
            </Button>
            <Link href="/mis-tickets" passHref>
              <Button asChild variant="outline" className={`${styles.dialogButton} ${styles.dialogOutlineButton}`}>
                <span>VER TICKETS</span>
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}