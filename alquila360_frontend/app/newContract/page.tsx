"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Bell, ChevronDown, ChevronUp, Upload } from "lucide-react";
import styles from "./styles.module.css";
import ContrService from "../services/contr.service";

export default function newContract() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [inicioContrato, setInicioContrato] = useState("");
  const [finContrato, setFinContrato] = useState("");
  const [tipoContrato, setTipoContrato] = useState("");
  const [montoMensual, setMontoMensual] = useState("");
  const [ciArrendatario, setCiArrendatario] = useState("");
  const [nombreArrendatario, setNombreArrendatario] = useState("");
  const [nombrePropietario, setNombrePropietario] = useState("");
  const [documentos, setDocumentos] = useState<File[]>([]);

  // 🔹 Estado del modal
  const [showModal, setShowModal] = useState(false);

  const clearSearch = () => setSearchTerm("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocumentos([...documentos, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Creando contrato:", {
      inicioContrato,
      finContrato,
      tipoContrato,
      montoMensual,
      ciArrendatario,
      nombreArrendatario,
      nombrePropietario,
      documentos: documentos.length,
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
              placeholder="Buscar contratos..."
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
            <span style={{ fontFamily: "Poppins, sans-serif" }}>USUARIO</span>
            {showUserMenu ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        <div className={styles.headerSubMenu}>
          <div className={styles.leftMenu}>
            <button className={styles.noStyleLink}>NUEVO CONTRATO</button>
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

            <span style={{ fontFamily: "Poppins, sans-serif" }}>PERFIL</span>
            <Bell className={styles.bellIcon} />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className={styles["new-contract-main"]}>
        <div className={styles["new-contract-container"]}>
          {/* IZQUIERDA: subir documentos */}
          <div className={styles["new-contract-left"]}>
            <div className={styles["new-contract-photo-upload"]}>
              <input
                type="file"
                id="document-upload"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <label
                htmlFor="document-upload"
                className={styles["new-contract-photo-label"]}
              >
                <Upload
                  size={48}
                  color="#ffffff"
                  className={styles["new-contract-upload-icon"]}
                />
                <p className={styles["new-contract-upload-text"]}>
                  AÑADIR DOCUMENTOS...
                </p>
              </label>

              {documentos.length > 0 && (
                <div className={styles["new-contract-photos-preview"]}>
                  <p className={styles["new-contract-photos-count"]}>
                    {documentos.length} archivo(s) seleccionado(s)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* DERECHA: formulario */}
          <div className={styles["new-contract-right"]}>
            <form
              onSubmit={handleSubmit}
              className={styles["new-contract-form"]}
            >
              <div className={styles["new-contract-form-group"]}>
                <label className={styles["new-contract-form-label"]}>
                  NOMBRE ARRENDATARIO
                </label>
                <input
                  type="text"
                  className={styles["new-contract-form-input"]}
                  placeholder="Ingrese nombre del arrendatario"
                  value={nombreArrendatario}
                  onChange={(e) => setNombreArrendatario(e.target.value)}
                  required
                />
              </div>

              <div className={styles["new-contract-form-group"]}>
                <label className={styles["new-contract-form-label"]}>
                  NOMBRE PROPIETARIO
                </label>
                <input
                  type="text"
                  className={styles["new-contract-form-input"]}
                  placeholder="Ingrese nombre del propietario"
                  value={nombrePropietario}
                  onChange={(e) => setNombrePropietario(e.target.value)}
                  required
                />
              </div>

              <div className={styles["new-contract-form-row"]}>
                <div className={styles["new-contract-form-group"]}>
                  <label className={styles["new-contract-form-label"]}>
                    CI ARRENDATARIO
                  </label>
                  <input
                    type="text"
                    className={styles["new-contract-form-input"]}
                    placeholder="Cédula de identidad"
                    value={ciArrendatario}
                    onChange={(e) => setCiArrendatario(e.target.value)}
                    required
                  />
                </div>
                <div className={styles["new-contract-form-group"]}>
                  <label className={styles["new-contract-form-label"]}>
                    MONTO MENSUAL
                  </label>
                  <input
                    type="number"
                    className={styles["new-contract-form-input"]}
                    placeholder="Bs."
                    value={montoMensual}
                    onChange={(e) => setMontoMensual(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles["new-contract-form-group"]}>
                <label className={styles["new-contract-form-label"]}>
                  FECHA INICIO
                </label>
                <input
                  type="date"
                  className={styles["new-contract-form-input"]}
                  value={inicioContrato}
                  onChange={(e) => setInicioContrato(e.target.value)}
                  required
                />
              </div>

              <div className={styles["new-contract-form-group"]}>
                <label className={styles["new-contract-form-label"]}>
                  FECHA FIN
                </label>
                <input
                  type="date"
                  className={styles["new-contract-form-input"]}
                  value={finContrato}
                  onChange={(e) => setFinContrato(e.target.value)}
                  required
                />
              </div>

              <div className={styles["new-contract-form-group"]}>
                <label className={styles["new-contract-form-label"]}>
                  OBSERVACIONES
                </label>
                <textarea
                  className={styles["new-contract-form-textarea"]}
                  placeholder="Ingrese observaciones"
                  rows={4}
                  value={documentos.length > 0 ? "Documentos adjuntos" : ""}
                  readOnly
                />
              </div>

              <button
                type="submit"
                className={styles["new-contract-submit-button"]}
              >
                CREAR CONTRATO
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2>Contrato creado exitosamente</h2>
            <button
              className={styles.modalButton}
              onClick={() => setShowModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
