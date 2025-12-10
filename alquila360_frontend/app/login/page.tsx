"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import AuthService from "../services/auth.service";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function LoginPage() {
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
          maxWidth: "380px",
          width: "100%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}>
          <form style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
                 INGRESAR
              </Link>

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
