// /components/Navbar.tsx (CÓDIGO COMPLETO)

"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Importamos el componente Image
import { Search, ChevronDown, Bell } from 'lucide-react';
import styles from './navbar.module.css';

// ⚠️ IMPORTACIÓN DEL LOGO:
// Ajusta esta ruta si tu logo no se llama 'logo-alquila360.png'
// o si está en otra subcarpeta (ej: '@/public/images/logo-alquila360.png')
import logoAlquila360 from '@/public/LG360.png'; 

const Navbar = () => {
  return (
    <nav className={styles.navbarContainer}>
      {/* 1. Capa de opacidad y fondo de imagen */}
      {/* El ::before en CSS maneja la opacidad */}

      <div className={styles.navbarTop}>
        {/* Lado Izquierdo: Logo y Título */}
        <div className={styles.logoGroup}>
          
          {/* Componente Image para el logo, con optimización de Next.js */}
          <Image
            src={logoAlquila360}
            alt="Logo Alquila360"
            width={60} // Ajusta el tamaño según tu preferencia
            height={60}
            className={styles.brandLogo} 
          />
          
          <h1 className={styles.logoText}>ALQUILA360</h1>
        </div>

        {/* Centro: Barra de Búsqueda */}
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="CERCADO" 
            className={styles.searchInput}
          />
          <button className={styles.searchClear}>&times;</button>
        </div>

        {/* Lado Derecho: Perfil y Notificaciones */}
        <div className={styles.profileGroup}>
          <div className={styles.profileIcon} /> 
          <span className={styles.profileText}>INQUILINO</span>
          <ChevronDown className={styles.dropdownIcon} />
          <div className={styles.notificationIcon}>
            <Bell className="w-5 h-5 text-gray-700" />
            <span className={styles.notificationDot} />
          </div>
        </div>
      </div>

      {/* 2. Barra de Enlaces de Navegación */}
      <div className={styles.navLinksBar}>
        <Link href="/create-ticket" className={styles.navLink}>
          CREAR TICKET
        </Link>
        <Link href="/mis-tickets" className={`${styles.navLink} ${styles.activeLink}`}>
          MIS TICKET
        </Link>
        <Link href="/mis-contratos" className={styles.navLink}>
          MIS CONTRATOS
        </Link>
        <Link href="/pagos" className={styles.navLink}>
          PAGOS
        </Link>
        <Link href="/perfil" className={styles.navLink}>
          PERFIL
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;