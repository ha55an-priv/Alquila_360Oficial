"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RegisterPage() {
  return (
    <div className={poppins.className} style={{ minHeight: "100vh", position: "relative" }}>
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
          zIndex: 0
        }}
      />

      {/* Header */}
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
          <Image src="/LOGO.png" width={30} height={30} alt="Logo" />
        </div>

        <div style={{ width: "24px" }} />
      </header>

      {/* Formulario */}
      <main style={{
        position: "relative",
        zIndex: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        paddingTop: "80px"
      }}>
        <div style={{
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: "40px",
          padding: "40px",
          maxWidth: "420px",
          width: "100%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}>
          <form style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ textAlign: "center", fontWeight: 700, fontSize: "16px", marginBottom: "10px" }}>
              CREAR CUENTA
            </h2>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "5px" }}>
                NOMBRE COMPLETO
              </label>
              <input
                type="text"
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  outline: "none"
                }}
                placeholder="Nombre completo"
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "5px" }}>
                CORREO ELECTRÓNICO
              </label>
              <input
                type="email"
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  outline: "none"
                }}
                placeholder="usuario@correo.com"
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "5px" }}>
                FECHA DE NACIMIENTO
              </label>
              <input
                type="date"
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  outline: "none"
                }}
                placeholder="DD/MM/YYYY"
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "5px" }}>
                ROL / CREDENCIAL
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  outline: "none"
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
              <label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "5px" }}>
                CONTRASEÑA
              </label>
              <input
                type="password"
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  outline: "none"
                }}
                placeholder="********"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "10px" }}>
              <Link
              href="/publishedProp"
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
                REGISTRARSE
              </Link>

              <Link href="/login" style={{ fontSize: "10px", marginTop: "8px", color: "#555", textDecoration: "underline" }}>
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
