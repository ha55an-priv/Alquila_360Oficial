"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X, ChevronDown, ChevronUp, Bell } from "lucide-react";
import styles from "./styles.module.css";
import ContrService from "../services/contr.service";

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

  // MODALES
  const [openPDF, setOpenPDF] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openNote, setOpenNote] = useState(false);

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

            {/* BOTONES */}
            <div className={styles.actions}>
              <button
                className={styles.contactBtn}
                onClick={() => setOpenPDF(true)}
              >
                Descargar PDF
              </button>

              <button
                className={styles.whatsappBtn}
                onClick={() => setOpenShare(true)}
              >
                Compartir
              </button>
            </div>

            {/* NOTA */}
            <div className={styles.opinionSection}>
              <h3>Observaciones</h3>

              <div className={styles.opinionForm}>
                <div className={styles.opinionInputWrapper}>
                  <Search className={styles.opinionIcon} />
                  <input type="text" placeholder="Escribe una nota..." />
                </div>

                <button
                  className={styles.submitOpinion}
                  onClick={() => setOpenNote(true)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================== MODAL PDF ========================== */}
      {openPDF && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2>Descargar PDF</h2>
            <p>¿Deseas descargar el contrato en formato PDF?</p>

            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setOpenPDF(false)}>
                Cancelar
              </button>
              <button className={styles.modalConfirm}>Descargar</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================== MODAL COMPARTIR ========================== */}
      {openShare && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2>Compartir contrato</h2>
            <p>Elige un método para compartir el contrato.</p>

            <div className={styles.modalActions}>
              <button className={styles.modalConfirm}>WhatsApp</button>
              <button className={styles.modalConfirm}>Correo</button>
            </div>

            <button className={styles.modalCancel} onClick={() => setOpenShare(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* ========================== MODAL NOTA ========================== */}
      {openNote && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2>Agregar nota</h2>

            <textarea
              className={styles.modalTextarea}
              placeholder="Escribe una observación..."
            ></textarea>

            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setOpenNote(false)}>
                Cancelar
              </button>
              <button className={styles.modalConfirm}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
