"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronDown, Bell } from 'lucide-react';
import styles from './prop-navbar.module.css';

import logoAlquila360 from '@/public/LG360.png';

const Navbar = () => {
  return (
    <nav className={styles.navbarContainer}>
      {/* 1. Encabezado superior con logo, búsqueda y perfil */}
      <div className={styles.navbarTop}>
        {/* Logo y título */}
        <div className={styles.logoGroup}>
          <Image
            src={logoAlquila360}
            alt="Logo Alquila360"
            width={60}
            height={60}
            className={styles.brandLogo}
          />
          <h1 className={styles.logoText}>ALQUILA360</h1>
        </div>

        {/* Barra de búsqueda */}
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="CERCADO"
            className={styles.searchInput}
          />
          <button className={styles.searchClear}>&times;</button>
        </div>

        {/* Perfil y notificaciones */}
        <div className={styles.profileGroup}>
          <div className={styles.profileIcon} />
          <span className={styles.profileText}>PROPIETARIO</span>
          <ChevronDown className={styles.dropdownIcon} />
          <div className={styles.notificationIcon}>
            <Bell className="w-5 h-5 text-gray-700" />
            <span className={styles.notificationDot} />
          </div>
        </div>
      </div>

      {/* 2. Enlaces de navegación */}
      <div className={styles.navLinksBar}>
        <Link href="/propietario/new-property" className={styles.navLink}>
          NUEVA PROPIEDAD
        </Link>
        <Link href="/propietario/my-property" className={`${styles.navLink} ${styles.activeLink}`}>
          MIS PROPIEDADES
        </Link>
        <Link href="/propietario/my-contracts" className={styles.navLink}>
          MIS CONTRATOS
        </Link>
        <Link href="/propietario/perfil" className={styles.navLink}>
          PERFIL
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;