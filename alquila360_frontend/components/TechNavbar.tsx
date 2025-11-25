"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Bell } from 'lucide-react';
import styles from './tech-navbar.module.css';

import logoAlquila360 from '@/public/LG360.png';

const NavbarTecnico = () => {
  return (
    <nav className={styles.navbarContainer}>
      
      {/* Top section */}
      <div className={styles.navbarTop}>

        {/* Logo + título */}
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

        {/* Perfil */}
        <div className={styles.profileGroup}>
          <div className={styles.profileIcon} />
          <span className={styles.profileText}>TECNICO</span>
          <ChevronDown className={styles.dropdownIcon} />

          <div className={styles.notificationIcon}>
            <Bell className="w-5 h-5 text-gray-700" />
            <span className={styles.notificationDot} />
          </div>
        </div>

      </div>

      {/* Navigation Links */}
      <div className={styles.navLinksBar}>
        <Link href="/tecnico/tickets-asignados" className={`${styles.navLink} ${styles.activeLink}`}>
          TICKETS ASIGNADOS
        </Link>

        <Link href="/tecnico/perfil" className={styles.navLink}>
          PERFIL
        </Link>
      </div>

    </nav>
  );
};

export default NavbarTecnico;
