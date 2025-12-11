"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Bell, ChevronDown, ChevronUp, Upload } from "lucide-react";
import styles from "./styles.module.css";
import PropService from "../services/prop.service";

export default function NewProperty() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [ubicacion, setUbicacion] = useState("");
  const [tipoPropiedad, setTipoPropiedad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [ci, setCi] = useState("");
  const [contacto1, setContacto1] = useState("");
  const [contacto2, setContacto2] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);

  /* NUEVO → estado del modal */
  const [showModal, setShowModal] = useState(false);

  const clearSearch = () => setSearchTerm("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFotos([...fotos, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Publicando propiedad:", {
      ubicacion,
      tipoPropiedad,
      descripcion,
      precio,
      ci,
      contacto1,
      contacto2,
      fotos: fotos.length,
    });

    setShowModal(true);
  };

  return (
    <div className={styles.page} style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerOverlay} />

        <div className={styles.headerContent}>
          <div className={styles.logo} onClick={() => router.push("/home")}>
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
              <button className={styles.clearBtn} onClick={clearSearch}>
                <X size={18} />
              </button>
            )}
          </div>

          <button
            className={styles.userBtn}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className={styles.userAvatar}></div>
            <span>PROPIETARIO</span>
            {showUserMenu ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        {/* SUBMENU */}
        <div className={styles.headerSubMenu}>
          <div className={styles.leftMenu}>
            <button className={`${styles.noStyleLink}`}>
              NUEVA PROPIEDAD
            </button>
          </div>

          <div className={styles.rightMenu}>
            <button
              className={styles.noStyleLink}
              onClick={() => router.push("/listProperty")}
            >
              MIS PROPIEDADES
            </button>

            <button
              className={styles.noStyleLink}
              onClick={() => router.push("/contractList")}
            >
              MIS CONTRATOS
            </button>

            <span>PERFIL</span>
            <Bell className={styles.bellIcon} />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className={styles["new-property-main"]}>
        <div className={styles["new-property-container"]}>
          <div className={styles["new-property-left"]}>
            <div className={styles["new-property-photo-upload"]}>
              <input
                type="file"
                id="photo-upload"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <label
                htmlFor="photo-upload"
                className={styles["new-property-photo-label"]}
              >
                <Upload
                  size={48}
                  color="#ffffff"
                  className={styles["new-property-upload-icon"]}
                />
                <p className={styles["new-property-upload-text"]}>
                  AÑADIR FOTOS...
                </p>
              </label>
              {fotos.length > 0 && (
                <div className={styles["new-property-photos-preview"]}>
                  <p className={styles["new-property-photos-count"]}>
                    {fotos.length} foto(s) seleccionada(s)
                  </p>
                </div>
              )}
            </div>

            <div className={styles["new-property-contact-section"]}>
              <h3 className={styles["new-property-contact-title"]}>CONTACTO</h3>
              <div className={styles["new-property-contact-inputs"]}>
                <input
                  type="text"
                  placeholder="Teléfono 1"
                  className={styles["new-property-contact-input"]}
                  value={contacto1}
                  onChange={(e) => setContacto1(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Teléfono 2"
                  className={styles["new-property-contact-input"]}
                  value={contacto2}
                  onChange={(e) => setContacto2(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles["new-property-right"]}>
            <form onSubmit={handleSubmit} className={styles["new-property-form"]}>
              <div className={styles["new-property-form-group"]}>
                <label className={styles["new-property-form-label"]}>
                  UBICACIÓN
                </label>
                <input
                  type="text"
                  className={styles["new-property-form-input"]}
                  placeholder="Ingrese la ubicación"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  required
                />
              </div>

              <div className={styles["new-property-form-group"]}>
                <label className={styles["new-property-form-label"]}>
                  TIPO DE PROPIEDAD
                </label>
                <div className={styles["new-property-select-wrapper"]}>
                  <select
                    className={styles["new-property-form-select"]}
                    value={tipoPropiedad}
                    onChange={(e) => setTipoPropiedad(e.target.value)}
                    required
                  >
                    <option value="">Seleccione</option>
                    <option value="casa">Casa</option>
                    <option value="departamento">Departamento</option>
                    <option value="local">Local</option>
                    <option value="campo">Campo</option>
                    <option value="oficina">Oficina</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className={styles["new-property-form-group"]}>
                <label className={styles["new-property-form-label"]}>
                  DESCRIPCIÓN
                </label>
                <textarea
                  className={styles["new-property-form-textarea"]}
                  placeholder="Ingrese la descripción de la propiedad"
                  rows={4}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                />
              </div>

              <div className={styles["new-property-form-row"]}>
                <div className={styles["new-property-form-group"]}>
                  <label className={styles["new-property-form-label"]}>
                    PRECIO
                  </label>
                  <input
                    type="number"
                    className={styles["new-property-form-input"]}
                    placeholder="Bs."
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                  />
                </div>
                <div className={styles["new-property-form-group"]}>
                  <label className={styles["new-property-form-label"]}>CI</label>
                  <input
                    type="text"
                    className={styles["new-property-form-input"]}
                    placeholder="Cédula de identidad"
                    value={ci}
                    onChange={(e) => setCi(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className={styles["new-property-submit-button"]}
              >
                PUBLICAR
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 🚨 NUEVO → MODAL AL PUBLICAR 🚨 */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2>Propiedad publicada correctamente</h2>

            <button
              className={styles.modalButton}
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
