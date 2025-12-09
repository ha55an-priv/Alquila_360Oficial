"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X, ChevronDown, ChevronUp, Bell } from "lucide-react";
import styles from "./styles.module.css";

interface Property {
  id: number;
  type: string;
  name: string;
  price: string;
  description: string;
  location: string;
  images: string[];
}

export default function ViewProperty() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const property: Property = {
    id: 1,
    type: "Departamento",
    name: "Departamento en zona céntrica",
    price: "Bs 1200",
    description:
      "Hermoso departamento con 3 habitaciones, cocina equipada y balcón.",
    location: "Calle Falsa 123",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
    ],
  };

  const [selectedImage, setSelectedImage] = useState<string>(property.images[0]);

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

          <button
            className={styles.userBtn}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className={styles.userAvatar}></div>
            <span>USUARIO</span>
            {showUserMenu ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        {/* SUBMENU */}
        <div className={styles.headerSubMenu}>
          <div className={styles.leftMenu}>
            <Link href="/newProperty" className={styles.noStyleLink}>
              NUEVA PROPIEDAD
            </Link>
          </div>

          <div className={styles.rightMenu}>
            <Link href="/listProperty" className={styles.noStyleLink}>
              MIS PROPIEDADES
            </Link>

            <Link href="/contractList" className={styles.noStyleLink}>
              MIS CONTRATOS
            </Link>

            <span>PERFIL</span>
            <Bell className={styles.bellIcon} />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className={styles.main}>
        <div className={styles.propertyContainer}>
          {/* GALERÍA */}
          <div className={styles.gallery}>
            <div className={styles.thumbnails}>
              {property.images.map((img, i) => (
                <div
                  key={i}
                  className={`${styles.thumbnail} ${
                    selectedImage === img ? styles.activeThumb : ""
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} />
                </div>
              ))}
            </div>

            <div className={styles.mainImage}>
              <img src={selectedImage} />
            </div>
          </div>

          {/* INFO */}
          <div className={styles.infoCard}>
            <span className={styles.type}>{property.type}</span>
            <h1 className={styles.name}>{property.name}</h1>
            <span className={styles.price}>{property.price}</span>
            <p className={styles.description}>{property.description}</p>
            <span className={styles.location}>{property.location}</span>

            <div className={styles.actions}>
              <button className={styles.contactBtn}>Contactar</button>
              <button className={styles.whatsappBtn}>WhatsApp</button>
            </div>

            {/* Opinión */}
            <div className={styles.opinionSection}>
              <h3>Deja tu opinión</h3>

              <div className={styles.opinionForm}>
                <div className={styles.opinionInputWrapper}>
                  <Search className={styles.opinionIcon} />
                  <input type="text" placeholder="Escribe un comentario..." />
                </div>

                <button className={styles.submitOpinion}>+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
