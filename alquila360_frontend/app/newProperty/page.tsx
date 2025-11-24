"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Bell, ChevronDown, ChevronUp, Upload } from "lucide-react";
import styles from "./styles.module.css";

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
  };

  return (
    <div className={styles["new-property-page"]}>
      <header className={styles["new-property-header"]}>
        <div
          className={styles["new-property-header-overlay"]}
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className={styles["new-property-header-content"]}>
          <div
            className={styles["new-property-logo"]}
            onClick={() => router.push("/home")}
            style={{ cursor: "pointer" }}
          >
            <span className={styles["new-property-logo-text"]}>ALQUILA360</span>
            <div className={styles["new-property-logo-icon"]}>
              <div className={styles["new-property-logo-bars"]}>
                <div className={styles["new-property-logo-bar"]}></div>
                <div className={styles["new-property-logo-bar"]}></div>
                <div className={styles["new-property-logo-bar"]}></div>
              </div>
            </div>
          </div>

          <div className={styles["new-property-search-container"]}>
            <Search className={styles["new-property-search-icon"]} />
            <input
              type="text"
              placeholder="CERCADO"
              className={styles["new-property-search-input"]}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className={styles["new-property-search-clear"]}
                onClick={clearSearch}
                aria-label="Limpiar búsqueda"
              >
                <X />
              </button>
            )}
          </div>

          <div className={styles["new-property-user-menu"]}>
            <button
              className={styles["new-property-user-button"]}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className={styles["new-property-user-avatar"]}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="currentColor" />
                  <path
                    d="M6 21c0-3.314 2.686-6 6-6s6 2.686 6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <span className={styles["new-property-user-text"]}>PROPIETARIO</span>
              {showUserMenu ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>

        <div className={styles["new-property-secondary-header"]}>
          <div className={styles["new-property-nav-left"]}>
            <button className={`${styles["new-property-nav-link"]} ${styles.active}`}>
              NUEVA PROPIEDAD
            </button>
            <button
              className={styles["new-property-nav-link"]}
              onClick={() => router.push("/my-properties")}
            >
              MIS PROPIEDADES
            </button>
          </div>
          <div className={styles["new-property-favorites"]}>
            <button className={styles["new-property-nav-link"]}>MIS CONTRATOS</button>
            <button className={styles["new-property-nav-link"]}>FAVORITOS</button>
            <button className={styles["new-property-notification-button"]}>
              <Bell size={18} />
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </header>

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
              <label htmlFor="photo-upload" className={styles["new-property-photo-label"]}>
                <Upload size={48} className={styles["new-property-upload-icon"]} />
                <p className={styles["new-property-upload-text"]}>AÑADIR FOTOS...</p>
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
                <label className={styles["new-property-form-label"]}>UBICACIÓN</label>
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
                <label className={styles["new-property-form-label"]}>TIPO DE PROPIEDAD</label>
                <div className={styles["new-property-select-wrapper"]}>
                  <select
                    className={styles["new-property-form-select"]}
                    value={tipoPropiedad}
                    onChange={(e) => setTipoPropiedad(e.target.value)}
                    required
                  >
                    <option value="">Seleccione el tipo</option>
                    <option value="casa">Casa</option>
                    <option value="departamento">Departamento</option>
                    <option value="local">Local</option>
                    <option value="campo">Campo</option>
                    <option value="oficina">Oficina</option>
                    <option value="otro">Otro</option>
                  </select>
                  <ChevronDown className={styles["new-property-select-icon"]} />
                </div>
              </div>

              <div className={styles["new-property-form-group"]}>
                <label className={styles["new-property-form-label"]}>DESCRIPCIÓN</label>
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
                  <label className={styles["new-property-form-label"]}>PRECIO</label>
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

              <button type="submit" className={styles["new-property-submit-button"]}>
                PUBLICAR
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
