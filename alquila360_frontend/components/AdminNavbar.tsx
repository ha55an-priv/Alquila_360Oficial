// /components/AdminNavbar.tsx

"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Bell } from 'lucide-react';
import styles from './admin-navbar.module.css';

// Importa la imagen de tu logo
import logoAlquila360 from '@/public/LG360.png'; 

const AdminNavbar = () => {
  return (
    // NOTA: La imagen de fondo se maneja en el CSS usando background-image: url('/admin-bg.jpg');
    <nav className={styles.navbarContainer}>
      
      <div className={styles.navbarTop}>
        {/* Lado Izquierdo: Logo y Título */}
        <div className={styles.logoGroup}>
          <Image
            src={logoAlquila360}
            alt="Logo Alquila360"
            width={50}
            height={50}
            className={styles.brandLogo} 
            priority // Para cargarla rápido
          />
          <h1 className={styles.logoText}>ALQUILA360</h1>
        </div>

        {/* Centro vacío */}
        <div className={styles.emptyCenter} />

        {/* Lado Derecho: Perfil y Notificaciones */}
        <div className={styles.profileGroup}>
          <div className={styles.profileIcon} /> 
          <span className={styles.profileText}>ADMINISTRADOR</span>
          <ChevronDown className={styles.dropdownIcon} />
          
          <div className={styles.notificationIcon}>
            <Bell className={styles.bellIcon} />
            <span className={styles.notificationDot} />
          </div>
        </div>
      </div>

      {/* Barra de Enlaces de Navegación */}
      <div className={styles.navLinksBar}>
        <Link href="/admin/contracts" className={styles.navLink}>
          HISTORIAL DE CONTRATOS
        </Link>
        <Link href="/admin/ticket" className={`${styles.navLink} ${styles.activeLink}`}>
          GESTION DE TICKETS
        </Link>
        <Link href="/admin/payments" className={styles.navLink}>
          GESTION DE PAGOS
        </Link>
        <Link href="/admin/reportes" className={styles.navLink}>
          REPORTES
        </Link>
        <Link href="/admin/profile" className={styles.navLink}>
          PERFIL
        </Link>
      </div>
    </nav>
  );
};

// 🎯 ASEGÚRATE DE USAR ESTA EXPORTACIÓN POR DEFECTO
export default AdminNavbar;