"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X, ChevronDown, ChevronUp, Bell } from "lucide-react";
import styles from "./styles.module.css";

interface Contract {
  id: number;
  tenant: string;
  owner: string;
  startDate: string;
  endDate: string;
  monthlyPrice: string;
  description: string;
  documentImages: string[];
}

export default function viewContract() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const contract: Contract = {
    id: 10,
    tenant: "Juan Pérez",
    owner: "María López",
    startDate: "01/01/2025",
    endDate: "01/01/2026",
    monthlyPrice: "Bs 1200",
    description: "Contrato de alquiler para un departamento céntrico.",
    documentImages: [
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=800&q=80"
    ]
  };

  const [selectedImage, setSelectedImage] = useState<string>(
    contract.documentImages[0]
  );

  return (
    <div className={styles.page}>
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
              placeholder="Buscar contratos..."
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

        <div className={styles.headerSubMenu}>
          <div className={styles.leftMenu}>
            <Link href="/newContract" className={styles.noStyleLink}>
              NUEVO CONTRATO
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

      <div className={styles.main}>
        <div className={styles.propertyContainer}>
          <div className={styles.gallery}>
            <div className={styles.thumbnails}>
              {contract.documentImages.map((img, i) => (
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

          <div className={styles.infoCard}>
            <h1 className={styles.name}>Contrato #{contract.id}</h1>

            <span className={styles.type}>Arrendatario: {contract.tenant}</span>
            <span className={styles.type}>Propietario: {contract.owner}</span>

            <span className={styles.price}>
              Precio mensual: {contract.monthlyPrice}
            </span>

            <p className={styles.description}>{contract.description}</p>

            <span className={styles.location}>
              Vigencia: {contract.startDate} → {contract.endDate}
            </span>

            <div className={styles.actions}>
              <button className={styles.contactBtn}>Descargar PDF</button>
              <button className={styles.whatsappBtn}>Compartir</button>
            </div>

            <div className={styles.opinionSection}>
              <h3>Observaciones</h3>

              <div className={styles.opinionForm}>
                <div className={styles.opinionInputWrapper}>
                  <Search className={styles.opinionIcon} />
                  <input type="text" placeholder="Escribe una nota..." />
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
