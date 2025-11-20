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
    <div className={`relative min-h-screen w-full flex flex-col ${poppins.className}`}>
      <img
        src="/CBA.jpeg"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover z-0 filter blur-sm brightness-90"
      />

      <header className="site-header fixed top-0 left-0 w-full h-[32px] px-2 flex items-center justify-between bg-white shadow-sm z-20 text-sm">
        <button
          aria-label="menu"
          className="p-0 m-0 bg-transparent text-black text-lg leading-none border-none"
        >
          &#9776;
        </button>

        <div className="flex-1 flex justify-center items-center gap-1">
          <h2 className="text-xs font-semibold tracking-wide text-black">
            ALQUILA360
          </h2>

          <Image
            src="/LOGO.png"
            width={30}
            height={30}
            alt="Logo Alquila360"
            className="object-contain"
          />
        </div>

        <div className="w-6" />
      </header>

      <main className="relative z-20 flex-1 flex items-center justify-center px-4 pt-20">
        <div className="bg-[#d9d7d7]/90 w-full max-w-[420px] rounded-[40px] px-8 py-10 shadow-lg flex items-center justify-center min-h-[320px]">
          <form className="w-full flex flex-col gap-6 max-w-[360px]">
            <h2 className="text-center text-base font-bold text-gray-800">
              CREAR CUENTA
            </h2>

            <div>
              <label className="block text-[14px] font-medium mb-2 text-gray-700 tracking-wide">
                NOMBRE COMPLETO
              </label>
              <input
                type="text"
                className="w-full bg-[#f3f1f1] rounded-xl py-3 px-4 text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium mb-2 text-gray-700 tracking-wide">
                CORREO ELECTRÓNICO
              </label>
              <input
                type="email"
                className="w-full bg-[#f3f1f1] rounded-xl py-3 px-4 text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium mb-2 text-gray-700 tracking-wide">
                CONTRASEÑA
              </label>
              <input
                type="password"
                className="w-full bg-[#f3f1f1] rounded-xl py-3 px-4 text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium mb-2 text-gray-700 tracking-wide">
                CONFIRMAR CONTRASEÑA
              </label>
              <input
                type="password"
                className="w-full bg-[#f3f1f1] rounded-xl py-3 px-4 text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              />
            </div>

            <div className="w-full flex flex-col items-center mt-4">
              <button
                type="submit"
                className="bg-gray-700 text-white font-semibold rounded-xl py-3 px-16 shadow-md hover:bg-gray-800 transition"
              >
                REGISTRARSE
              </button>

              <Link
                href="/"
                className="text-[10px] text-gray-600 hover:underline mt-2 visited:text-gray-600"
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
