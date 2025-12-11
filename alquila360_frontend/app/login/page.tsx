"use client";

import React, { useState} from "react"; // <-- Importar useState
import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from 'react';
import { Poppins } from "next/font/google";
import { useRouter } from 'next/navigation'; // <-- Importar useRouter para navegación
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

export default function LoginPage() {
  // 1. ESTADO DEL FORMULARIO
  const [ci, setCi] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // 2. FUNCIÓN DE MANEJO DE ENVÍO
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    try {
      // LLAMAR AL SERVICIO DE LOGIN
      const response = await AuthService.login({ ci: parseInt(ci), contrasena });

      // 3. MANEJO DE RESPUESTA EXITOSA
      if (response && response.token) {
        
        router.push('/publishedProp');
      } else {
        setError("Error desconocido al intentar iniciar sesión.");
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error de login:", err);

      let errorMessage = "Error de red. Asegúrese de que el backend esté encendido.";

      // Si hay una respuesta HTTP del backend (no solo un error de red)
      if (axiosError.response) {
        // Acceder al objeto de datos y usar el 'casting' de la interfaz
        const errorData = axiosError.response.data as BackendErrorResponse;

        // Usar el campo 'message' proporcionado por el backend
        if (errorData && errorData.message) {
          errorMessage = errorData.message; // Ej: "Contraseña incorrecta"
        } else {
             // Fallback si la estructura de error no es la esperada
             errorMessage = `Error ${axiosError.response.status}: Error de servidor.`;
         }
      }
      setError(errorMessage);
    }
  };


  return (
    <div className={poppins.className} style={{ minHeight: "100vh", position: "relative" }}>
      
      {/* 🎨 FONDO RECUPERADO */}
      <img
        src="/CBA.jpeg" // Asegúrate de que este archivo exista en tu carpeta /public
        alt="Fondo"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(2px) brightness(0.9)",
          zIndex: 0
        }}
      />

      {/* 🎨 HEADER RECUPERADO */}
      <header style={{
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
        zIndex: 10
      }}>
        <button style={{ fontSize: "24px", background: "none", border: "none", cursor: "pointer" }}>
          &#9776;
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <h1 style={{ fontWeight: 700, fontSize: "20px" }}>ALQUILA360</h1>
          <Image src="/LOGO.png" width={30} height={30} alt="Logo" /> {/* Asegúrate de que este archivo exista */}
        </div>

        <div style={{ width: "24px" }} />
      </header>

      {/* Formulario - Main Container */}
      <main style={{
        position: "relative",
        zIndex: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        paddingTop: "80px"
      }}>
        {/* 🎨 Contenedor del Formulario RECUPERADO */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: "40px",
          padding: "40px",
          maxWidth: "380px",
          width: "100%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "5px" }}>
                CARNET DE IDENTIDAD (CI)
              </label>
              <input
                type="number"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                style={{
                  width: "100%", // 🎨 Estilo de input recuperado
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  outline: "none"
                }}
                placeholder="1234567"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "5px" }}>
                CONTRASEÑA
              </label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                style={{
                  width: "100%", // 🎨 Estilo de input recuperado
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  outline: "none"
                }}
                placeholder="********"
                required
              />
            </div>

            {error && (
                <p style={{ color: 'red', fontSize: '12px', textAlign: 'center' }}>
                    {error}
                </p>
            )}

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "10px" }}>
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
                  textDecoration: "none"
              }}
              >
                 INGRESAR
              </button>

              <Link href="/register" style={{ fontSize: "10px", marginTop: "8px", color: "#555", textDecoration: "underline" }}>
                ¿No tienes cuenta? Registrarse
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}