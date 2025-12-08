"use client";

import { useState } from "react";
import { Search, X, Bell } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
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

export default function PropertyDetailPage() {

  const property: Property = {
    id: 1,
    type: "Departamento",
    name: "Departamento en zona céntrica",
    price: "Bs 1200",
    description: "Hermoso departamento con 3 habitaciones, cocina equipada y balcón.",
    location: "Calle Falsa 123",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80", 
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", 
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80", 
    ],
  };
       const [selectedImage, setSelectedImage] = useState<string>(property.images[0]);
       const [searchValue, setSearchValue] = useState("");
      const [showUserMenu, setShowUserMenu] = useState(false); 

  return (
    <div className={styles["property-detail-page"]}>
      {/* HEADER */}
      <header className={styles["property-detail-header"]}>
        <div className={styles["property-detail-header-content"]}>
          <div className={styles["property-detail-logo"]}>
          <div className={styles.logo}>
          <img src="/LOGO.png" alt="Logo" className={styles.logoImg} />
          <span className={styles.logoText}>ALQUILA360</span>
          </div>

          </div>

          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
            type="text"
            placeholder="Buscar propiedades..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={styles.searchInput}
          />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className={styles.clearButton}
              >
                <X size={18} />
              </button>
          )}
        </div>

          <div className={styles["property-detail-user-menu"]}>
            <button className={styles["property-detail-user-button"]}>
              <div className={styles["property-detail-user-avatar"]}></div>
              <span className={styles["property-detail-user-text"]}>USUARIO</span>
              {showUserMenu ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>
        </div>

        <div className={styles["property-detail-secondary-header"]}>
          <button className={styles["property-detail-nav-link"]}>PROPIEDADES</button>
          <button className={styles["property-detail-nav-link"]}>FAVORITOS</button>
          <button className={styles["property-detail-notification-button"]}>
            <Bell size={16} /> 
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className={styles["property-detail-main"]}>
        <div className={styles["property-detail-container"]}>
          {/* LEFT - GALLERY */}
          <div className={styles["property-detail-gallery"]}>
            <div className={styles["property-detail-thumbnails"]}>
              {property.images.map((img) => (
                <div
                  key={img}
                  className={`${styles["property-detail-thumbnail"]} ${
                    selectedImage === img ? styles.active : ""
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt="thumbnail" />
                </div>
              ))}
            </div>

            <div className={styles["property-detail-main-image"]}>
              <img src={selectedImage} alt="selected" />
            </div>
          </div>

          {/* RIGHT - PROPERTY INFO */}
          <div className={styles["property-detail-info"]}>
            <div className={styles["property-detail-info-card"]}>
              <span className={styles["property-detail-type"]}>{property.type}</span>
              <h1 className={styles["property-detail-name"]}>{property.name}</h1>
              <span className={styles["property-detail-price"]}>{property.price}</span>
              <p className={styles["property-detail-description-text"]}>
                {property.description}
              </p>
              <span className={styles["property-detail-location"]}>{property.location}</span>

              {/* ACTION BUTTONS */}
              <div className={styles["property-detail-actions"]}>
                <button className={styles["property-detail-contact-button"]}>
                  Contactar
                </button>
                <button className={styles["property-detail-whatsapp-button"]}>
                  WhatsApp
                </button>
              </div>

              {/* OPINION FORM */}
              <div className={styles["property-detail-opinion-section"]}>
                <h3 className={styles["property-detail-opinion-title"]}>Deja tu opinión</h3>
                <div className={styles["property-detail-opinion-form"]}>
                  <div className={styles["property-detail-opinion-input-wrapper"]}>
                    <Search className={styles["property-detail-opinion-icon"]} />
                    <input
                      type="text"
                      placeholder="Escribe un comentario..."
                      className={styles["property-detail-opinion-input"]}
                    />
                  </div>
                  <button className={styles["property-detail-opinion-submit"]}>+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}