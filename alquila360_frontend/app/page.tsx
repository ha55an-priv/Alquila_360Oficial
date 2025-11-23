"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [zona, setZona] = useState("Cercado");

  return (
    <main style={{ position: "relative" }}>
      {/* HEADER */}
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
          <img src="/LOGO.png" alt="Logo" width={30} height={30} />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/login" style={{ textDecoration: "none", color: "#333", fontWeight: 500, fontSize: "14px" }}>Login</Link>
          <Link href="/register" style={{ textDecoration: "none", color: "#333", fontWeight: 500, fontSize: "14px" }}>Sign Up</Link>
        </div>
      </header>

      {/* HERO */}
      <section style={{
        position: "relative",
        zIndex: 5,
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "100px 20px 50px 20px",
        textAlign: "center",
        overflow: "hidden"
      }}>
        {/* Fondo solo del hero */}
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

        <div style={{
          backgroundColor: "rgba(0,0,0,0.55)",
          borderRadius: "20px",
          padding: "45px 30px",
          color: "white",
          maxWidth: "650px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1
        }}>
          <h2 style={{ fontSize: "42px", fontWeight: 700, marginBottom: "10px" }}>Descubre tu nuevo hogar</h2>
          <p style={{ fontSize: "16px", opacity: 0.9, marginBottom: "22px" }}>Encuentra departamentos y casas en cualquier zona de Cochabamba</p>

          <div style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "50px",
            padding: "8px 15px",
            maxWidth: "420px",
            margin: "0 auto",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)"
          }}>
            <span style={{ fontSize: "20px", marginRight: "10px" }}>🔍</span>
            <input
              type="text"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              placeholder="Buscar zona o barrio..."
              style={{ flex: 1, border: "none", outline: "none", fontSize: "15px", color: "#333" }}
            />
            <button style={{ border: "none", background: "none", fontSize: "18px", color: "#888", cursor: "pointer" }}>✖</button>
          </div>
        </div>
      </section>

      {/* POSTS */}
      <section style={{ position: "relative", zIndex: 1, padding: "50px 10%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "28px", fontWeight: 600, color: "#333" }}>Posts más recientes</h3>
          <Link href="/posts" style={{ fontSize: "14px", color: "#333", textDecoration: "none" }}>Ver más</Link>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "25px"
        }}>
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} style={{
              background: "#fff",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}>
              <div style={{
                height: "150px",
                backgroundImage: `url("/house.jpg")`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}></div>
              <div style={{ padding: "15px", textAlign: "left" }}>
                <h4 style={{ fontSize: "17px", fontWeight: 600, marginBottom: "5px" }}>Departamento en alquiler</h4>
                <p style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>Zona: {zona}</p>
                <span style={{ fontWeight: "bold", color: "#008080", fontSize: "15px" }}>Bs. {1500 + i * 100}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
