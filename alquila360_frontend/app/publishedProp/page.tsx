"use client";

import { useState } from "react";
import { Search, X, ChevronDown, ChevronUp, Bell } from "lucide-react";
import styles from "./styles.module.css";
import Link from "next/link";

// ...

<div className={styles.propertyButtonWrapper}>
  <Link href="/viewProperty">
    <button className={styles.viewButton}>VER PROPIEDAD</button>
  </Link>
</div>


interface Property {
  id: number;
  type: string;
  name: string;
  price: string;
  description: string;
  location: string;
  image: string;
}

const mockProperties: Property[] = [
  {
    id: 1,
    type: "Casa",
    name: "Casa Moderna en Zona Norte",
    price: "Bs. 3,500/mes",
    description: "Hermosa casa de 3 habitaciones con patio amplio y garaje para 2 vehículos.",
    location: "Cochabamba",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400",
  },
  {
    id: 2,
    type: "Departamento",
    name: "Departamento Céntrico",
    price: "Bs. 2,800/mes",
    description: "Departamento de 2 habitaciones en pleno centro de la ciudad.",
    location: "Cercado",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
  },
  {
    id: 3,
    type: "Campo",
    name: "Terreno Agrícola",
    price: "Bs. 5,000/mes",
    description: "Amplio terreno agrícola con acceso a agua y electricidad.",
    location: "Quillacollo",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400",
  },
];

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerOverlay} />

        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <img src="/LOGO.png" alt="Logo" className={styles.logoImg} />
            <span>ALQUILA360</span>
          </div>

          {/* BUSCADOR */}
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar propiedades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className={styles.clearBtn}
                onClick={() => setSearchTerm("")}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* USUARIO */}
          <button
            className={styles.userBtn}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className={styles.userAvatar}></div>
            <span>USUARIO</span>
            {showUserMenu ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        <div className={styles.headerSubMenu}>
          <div className={styles.leftMenu}>PROPIEDADES</div>
          <div className={styles.rightMenu}>
            <span>FAVORITOS</span>
            <Bell className={styles.bellIcon} />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className={styles.main}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <h2>INMUEBLES</h2>
          <p>Nro de resultados</p>

          <h3>INMUEBLES</h3>
          <ul>
            <li>Casas (Nro de casas)</li>
            <li>Departamentos (Nro de departamentos)</li>
            <li>Locales (Nro de locales)</li>
            <li>Campos (Nro de campos)</li>
            <li>Oficinas (Nro de oficinas)</li>
            <li>Otros (Nro de otros)</li>
          </ul>

          <h3>UBICACIÓN</h3>
          <ul>
            <li>Santa Cruz</li>
            <li>Cochabamba</li>
            <li>La Paz</li>
            <li>Tarija</li>
            <li>Potosí</li>
            <li>Oruro</li>
            <li>Beni</li>
            <li>Pando</li>
            <li>Chuquisaca</li>
          </ul>
          
          {/* PRECIO MIN/MAX */}
          <div className={styles.propertiesFilterSection}>
            <h3 className={styles.propertiesFilterTitle}>PRECIO</h3>
            <p className={styles.propertiesPriceSubtitle}>Mínimo - Máximo</p>

          <div className={styles.propertiesPriceInputs}>
            <input
              type="number"
              placeholder="Mínimo"
              className={styles.propertiesPriceInput}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Máximo"
              className={styles.propertiesPriceInput}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          </div>
        </aside>

        {/* LISTA DE PROPIEDADES */}
        <section className={styles.propertiesList}>
          {mockProperties.map((p) => (
            <div key={p.id} className={styles.propertyItem}>
              <div className={styles.propertyImage}>
                <img src={p.image} alt={p.name} />
              </div>

              <div className={styles.propertyInfo}>
                <p className={styles.type}>{p.type}</p>
                <h3 className={styles.name}>{p.name}</h3>
                <p className={styles.price}>{p.price}</p>
                <p className={styles.desc}>{p.description}</p>
                <p className={styles.location}>{p.location}</p>
              </div>

              <div className={styles.propertyButtonWrapper}>
                <Link href="/viewProperty">
                <button className={styles.viewButton}>VER PROPIEDAD</button>
                </Link>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
