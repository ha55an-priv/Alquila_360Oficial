"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import * as AuthService from "../services/auth.service";
import { AxiosError } from "axios";

interface BackendErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RegisterPage() {
  const router = useRouter();

  // ESTADO DEL FORM
  const [ci, setCi] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");           // por ahora decorativo
  const [fechaNac, setFechaNac] = useState("");     // por ahora decorativo
  const [role, setRole] = useState("");             // por ahora decorativo
  const [contrasena, setContrasena] = useState("");
  const [contrasena2, setContrasena2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones básicas
    if (contrasena !== contrasena2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const ciNumber = parseInt(ci, 10);
    if (Number.isNaN(ciNumber)) {
      setError("CI inválido.");
      return;
    }

    try {
      // NOTA: por ahora ignoramos email, fechaNac y role porque el backend
      // solo recibe: ci, name, contrasena, roles?.
      // El backend asigna el rol por defecto (Inquilino).
      const response = await AuthService.register({
        ci: ciNumber,
        name,
        contrasena,
      });

      setSuccess(response.message || "Usuario registrado correctamente.");

      // Redirigir a login después de un pequeño delay
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error de registro:", err);

      let errorMessage =
        "Error de red. Asegúrese de que el backend esté encendido.";

      if (axiosError.response) {
        const data = axiosError.response.data as BackendErrorResponse;
        if (data && data.message) {
          errorMessage = data.message; // ej: "Ya existe un usuario con ese CI"
        } else {
          errorMessage = `Error ${axiosError.response.status}: Error de servidor.`;
        }
      }

      setError(errorMessage);
    }
  };

  return (
    <div
      className={poppins.className}
      style={{ minHeight: "100vh", position: "relative" }}
    >
      {/* Fondo */}
      <img
        src="/CBA.jpeg"
        alt="Fondo"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(2px) brightness(0.9)",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          zIndex: 10,
        }}
      >
        <button
          style={{
            fontSize: "24px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          &#9776;
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <h1 style={{ fontWeight: 700, fontSize: "20px" }}>ALQUILA360</h1>
          <Image src="/LOGO.png" width={30} height={30} alt="Logo" />
        </div>

        <div style={{ width: "24px" }} />
      </header>

      {/* Formulario */}
      <main
        style={{
          position: "relative",
          zIndex: 5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          paddingTop: "80px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.95)",
            borderRadius: "40px",
            padding: "40px",
            maxWidth: "420px",
            width: "100%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <h2
              style={{
                textAlign: "center",
                fontWeight: 700,
                fontSize: "16px",
                marginBottom: "10px",
              }}
            >
              CREAR CUENTA
            </h2>

            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                CARNET DE IDENTIDAD (CI)
              </label>
              <input
                type="number"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  outline: "none",
                }}
                placeholder="1234567"
                required
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                NOMBRE COMPLETO
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  outline: "none",
                }}
                placeholder="Nombre completo"
                required
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                CORREO ELECTRÓNICO
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  outline: "none",
                }}
                placeholder="usuario@correo.com"
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                FECHA DE NACIMIENTO
              </label>
              <input
                type="date"
                value={fechaNac}
                onChange={(e) => setFechaNac(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                ROL / CREDENCIAL
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  outline: "none",
                }}
              >
                <option value="">Selecciona una opción</option>
                <option value="administrador">ADMINISTRADOR</option>
                <option value="propietario">PROPIETARIO</option>
                <option value="inquilino">INQUILINO</option>
                <option value="tecnico">TÉCNICO</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                CONTRASEÑA
              </label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  outline: "none",
                }}
                placeholder="********"
                required
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                REPETIR CONTRASEÑA
              </label>
              <input
                type="password"
                value={contrasena2}
                onChange={(e) => setContrasena2(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  outline: "none",
                }}
                placeholder="********"
                required
              />
            </div>

            {error && (
              <p
                style={{
                  color: "red",
                  fontSize: "12px",
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}

            {success && (
              <p
                style={{
                  color: "green",
                  fontSize: "12px",
                  textAlign: "center",
                }}
              >
                {success}
              </p>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <button
                type="submit"
                style={{
                  backgroundColor: "#008080",
                  color: "#fff",
                  fontWeight: 600,
                  borderRadius: "12px",
                  padding: "12px 30px",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-block",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                REGISTRARSE
              </button>

              <Link
                href="/login"
                style={{
                  fontSize: "10px",
                  marginTop: "8px",
                  color: "#555",
                  textDecoration: "underline",
                }}
              >
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
