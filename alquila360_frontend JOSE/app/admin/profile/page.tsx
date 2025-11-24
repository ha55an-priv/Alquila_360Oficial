"use client";

import React, { useState, useEffect } from 'react';
import { User, Activity, Loader2 } from 'lucide-react'; // Iconos de Lucide
import styles from './page.module.css'; // Importa tus estilos CSS Modules
import Navbar from '@/components/Navbar'; // Asume que tienes un Navbar adaptable
import { getAdminProfile } from '@/app/services/admin.service';
import { AdminProfile } from '@/app/interfaces/admin.interface';

// Función para formatear la fecha (si viene como 'YYYY-MM-DD')
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    // Intenta formatear la fecha al formato local (ej. dd/mm/yyyy)
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString; // Si falla, devuelve el string original
  }
};

export default function AdminProfilePage() {
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getAdminProfile();
        setAdminProfile(profile);
      } catch (err: any) {
        console.error("Error fetching admin profile:", err);
        setError(err.message || "No se pudo cargar el perfil del administrador.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Simulación de datos de actividad (estáticos para la decoración)
  const activityList = [
    'GESTIÓN DE CONTRATOS',
    'REPORTES',
    'HISTORIAL DE TICKETS',
    'HISTORIAL DE CONTRATOS',
    // Añadidos para llenar un poco más
    'MONITOREO DE PAGOS',
    'ASIGNACIÓN DE TÉCNICOS',
  ];

  if (isLoading) {
    return (
      <div className={styles.container}>
        {/* <Navbar /> */}
        <main className={styles.mainContent}>
          <div className="flex justify-center items-center py-20 text-gray-500">
            <Loader2 className="animate-spin mr-2" size={24} /> Cargando perfil...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        {/* <Navbar /> */}
        <main className={styles.mainContent}>
          <div className="text-center py-20 text-red-600">
            Error: {error}
          </div>
        </main>
      </div>
    );
  }

  const profileData = adminProfile!; // Usamos '!' ya que isLoading es false y error es null
  
  return (
    <div className={styles.container}>
      {/* Asegúrate de que el Navbar sea el de Administrador si tienes diferentes versiones.
        Lo dejo comentado para evitar errores de compilación con componentes no existentes.
      */}
      {/* <Navbar role="admin" /> */}

      <main className={styles.mainContent}>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Perfil del Administrador</h1>

        <div className={styles.profileLayout}>
          
          {/* 1. Sección Izquierda: Avatar y Rol */}
          <div className={styles.leftSection}>
            <div className={`${styles.card} w-full flex flex-col items-center justify-center`}>
              {/* Círculo del Avatar */}
              <div className={styles.avatar}>
                <User size={60} />
              </div>
              <h2 className={styles.avatarName}>{profileData.fullName}</h2>
              <p className="text-gray-600 font-medium mt-1">{profileData.role}</p>
            </div>
          </div>

          {/* 2. Sección Derecha: Datos Personales y Actividad */}
          <div className={styles.rightSection}>
            
            {/* Box 1: Datos Personales */}
            <div className={styles.dataBox}>
              <h3 className={styles.dataBoxTitle}>DATOS PERSONALES</h3>
              <ul className={styles.dataList}>
                <li className={styles.dataItem}>
                  <span className={styles.dataLabel}>CI:</span> {profileData.ci}
                </li>
                <li className={styles.dataItem}>
                  <span className={styles.dataLabel}>NOMBRE COMPLETO:</span> {profileData.fullName}
                </li>
                <li className={styles.dataItem}>
                  <span className={styles.dataLabel}>FECHA DE NACIMIENTO:</span> {formatDate(profileData.birthDate)}
                </li>
                <li className={styles.dataItem}>
                  <span className={styles.dataLabel}>CONTACTO:</span> {profileData.contactPhone}
                </li>
                <li className={styles.dataItem}>
                  <span className={styles.dataLabel}>EMAIL:</span> {profileData.email}
                </li>
              </ul>
            </div>

            {/* Box 2: Actividad del Administrador (Decoración) */}
            <div className={styles.dataBox}>
              <h3 className={styles.dataBoxTitle}>ACTIVIDAD DEL ADMINISTRADOR</h3>
              <ul className={styles.dataList}>
                {activityList.map((activity, index) => (
                  <li key={index} className={`${styles.dataItem} flex items-center`}>
                    <Activity size={16} className="text-gray-500 mr-2" />
                    {activity}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}