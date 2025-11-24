'use client'; 

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';

// Importamos el servicio y las interfaces
import { createTicket } from '@/app/services/ticket.service';
// Si no quieres importar la interfaz, puedes definir el tipo de payload aquí, pero es mejor importarlo
// import { CreateTicketPayload, TicketResponse } from '@/app/interfaces/ticket.interface';

// Importamos los estilos específicos de la página
import styles from './page.module.css'; 

// Definición interna de tipos para el estado del formulario
interface TicketFormState {
  nombreDelProblema: string;
  descripcion: string;
  prioridad: 'baja' | 'media' | 'alta';
  // Nota: Aquí se pueden incluir los archivos/fotos si manejas el estado de subida
}

export default function CreateTicketPage() {
  const [formData, setFormData] = useState<TicketFormState>({
    nombreDelProblema: '',
    descripcion: '',
    prioridad: 'media', // Prioridad inicial: Naranja/Media
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
        prioridad: formData.prioridad,
        // fotos: [], // Si no hay fotos, enviar array vacío o omitir
      };

      // 2. Llamar al servicio (asumimos que existe y maneja la autenticación)
      await createTicket(payload);
      
      // 3. Manejo de éxito
      console.log('Ticket creado con éxito.');
      setIsModalOpen(true);
      
      // Opcional: Limpiar el formulario después del envío exitoso
      // setFormData({ nombreDelProblema: '', descripcion: '', prioridad: 'media' });

    } catch (error) {
      // 4. Manejo de error
      console.error('Fallo al crear el ticket:', error instanceof Error ? error.message : 'Error desconocido');
      // Aquí se podría usar un componente de alerta/toast para notificar al usuario.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> 

      {/* Contenedor principal */}
      <main className={styles.mainContent}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.ticketLayout}>
            
            {/* 1. Columna de Fotos y Prioridad */}
            <div className={styles.photosPrioritySection}>
              <div className={styles.photoCard}>
                <p className="text-gray-500">AÑADIR FOTOS</p>
                {/* Lógica para subir archivos */}
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">SELECCIONAR PRIORIDAD</p>
                <div className={styles.priorityGroup}>
                  {/* Botones de Prioridad - Rojo (Alta) */}
                  <button 
                    type="button" 
                    className={`${styles.priorityButton} ${styles.red}`} 
                    onClick={() => handlePriorityChange('alta')} 
                    style={{ border: formData.prioridad === 'alta' ? '3px solid black' : 'none' }}
                    title="Prioridad Alta"
                  />
                  {/* Botones de Prioridad - Naranja (Media) */}
                  <button 
                    type="button" 
                    className={`${styles.priorityButton} ${styles.orange}`} 
                    onClick={() => handlePriorityChange('media')} 
                    style={{ border: formData.prioridad === 'media' ? '3px solid black' : 'none' }}
                    title="Prioridad Media"
                  />
                  {/* Botones de Prioridad - Verde (Baja) */}
                  <button 
                    type="button" 
                    className={`${styles.priorityButton} ${styles.green}`} 
                    onClick={() => handlePriorityChange('baja')} 
                    style={{ border: formData.prioridad === 'baja' ? '3px solid black' : 'none' }}
                    title="Prioridad Baja"
                  />
                </div>
              </div>
            </div>

            {/* 2. Columna de Información y Descripción */}
            <div className={styles.infoDescriptionSection}>
              
              <div className={styles.infoGrid}>
                {/* Campos de Información Estática/Display */}
                <p>NOMBRE INQUILINO: **[Usuario Actual]**</p>
                <p>NOMBRE PROPIEDAD: **[Propiedad Asignada]**</p>
                
                {/* Input para Nombre del Problema */}
                <input 
                    type="text" 
                    placeholder="NOMBRE DEL PROBLEMA"
                    value={formData.nombreDelProblema}
                    onChange={(e) => setFormData(prev => ({...prev, nombreDelProblema: e.target.value}))}
                    className="p-2 border border-gray-300 rounded-md" 
                />
                
                <div className={styles.ticketNumberCard}>
                  TICKET # (GENERADO)
                </div>
              </div>

              {/* Área de Descripción */}
              <div>
                <label htmlFor="descripcion" className="text-sm font-semibold mb-2 block">
                  AÑADIR DESCRIPCIÓN
                </label>
                <Textarea 
                  id="descripcion" 
                  className={styles.descriptionArea}
                  rows={10} 
                  placeholder="Describe el problema detalladamente..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({...prev, descripcion: e.target.value}))}
                />
              </div>

              {/* Botones de Acción */}
              <div className={styles.actions}>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => { /* Lógica de navegación a Ver Tickets */ }}
                >
                  VER TICKETS
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'CREANDO...' : 'CREAR TICKET'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Modal de confirmación "TICKET CREADO" */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] p-8 text-center">
          <h2 className="text-xl font-bold">TICKET CREADO</h2>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
            <Button onClick={() => setIsModalOpen(false)}>
              CERRAR
            </Button>
            <Button variant="outline" onClick={() => { 
              // Lógica para navegar a la lista de tickets
              setIsModalOpen(false); 
            }}>
              VER TICKETS
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}