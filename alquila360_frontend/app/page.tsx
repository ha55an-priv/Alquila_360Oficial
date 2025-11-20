"use client";

import { useState } from "react";
import Link from "next/link";  

export default function Home() {
  const [zona, setZona] = useState("Cercado");

  return (
    <main className="home-page">
      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <button className="menu-btn">☰</button>
          <h1 className="logo">
            ALQUILA<span>360</span>
          </h1>
        </div>
        <div className="header-right">
          <Link href="/login" className="login">
            Login
          </Link>
          <Link href="/register" className="signup">
            Sign Up
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="overlay">
          <h2>Descubre tu nuevo hogar</h2>
          <p>Encuentra departamentos y casas en cualquier zona de Cochabamba</p>

          <div className="search-box">
            <span className="icon">🔍</span>
            <input
              type="text"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              placeholder="Buscar zona o barrio..."
            />
            <button className="clear-btn">✖</button>
          </div>
        </div>
      </section>

      {/* POSTS */}
      <section className="recent-posts">
        <h3>Posts más recientes</h3>
        <div className="posts-grid">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="post-card">
              <div className="post-img"></div>
              <div className="post-info">
                <h4>Departamento en alquiler</h4>
                <p>Zona: {zona}</p>
                <span className="price">Bs. {1500 + i * 100}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
