// components/Navbar.tsx
'use client'; 

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Asumiremos que tienes iconos de lucide-react o similar
import { Search, ChevronDown, Bell } from 'lucide-react'; 

// URL de ejemplo para la imagen de fondo (debería ser cargada estáticamente)
const BACKGROUND_IMAGE_URL = '/images/navbar-bg.png'; 

export default function Navbar() {
  return (
    // Contenedor principal con la imagen de fondo y superposición oscura
    <header 
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }} 
      className="bg-cover bg-center text-white shadow-lg"
    >
      {/* Capa de opacidad para mejorar la legibilidad del texto */}
      <div className="bg-black bg-opacity-30 p-4 pb-12"> 
        
        {/* Fila Superior: Logo, Búsqueda, Perfil */}
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          
          {/* Logo y Título */}
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-wider">ALQUILA360</h1>
            {/* Puedes añadir el icono del logo aquí */}
            <span className="text-yellow-500 text-2xl">🔥</span> 
          </div>

          {/* Barra de Búsqueda */}
          <div className="flex-grow max-w-md mx-8 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800" />
            <Input 
              placeholder="CERCADO" 
              className="pl-10 pr-8 py-2 w-full text-black rounded-lg border-none focus:ring-2 focus:ring-yellow-500"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 cursor-pointer">
              &times; {/* Icono de "X" para borrar */}
            </span>
          </div>

          {/* Perfil/Usuario */}
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback className="bg-gray-700 text-white">IN</AvatarFallback>
            </Avatar>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-gray-700/50">
                  INQUILINO <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => console.log('Ver Perfil')}>Mi Perfil</DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log('Cerrar Sesión')}>Cerrar Sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Fila Inferior: Enlaces de Navegación */}
        <div className="flex items-center justify-between max-w-7xl mx-auto mt-4">
          <div className="flex space-x-6">
            <Button variant="link" className="text-white font-semibold border-b-2 border-yellow-500 px-0 rounded-none">
              CREAR TICKET
            </Button>
            <Button variant="link" className="text-white font-semibold">MIS CONTRATOS</Button>
            <Button variant="link" className="text-white font-semibold">PAGOS</Button>
            <Button variant="link" className="text-white font-semibold">PERFIL</Button>
          </div>

          {/* Notificaciones */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white p-2 rounded-full hover:bg-gray-700/50">
                <Bell className="w-5 h-5" />
                <span className="sr-only">Notificaciones</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Tienes 2 notificaciones</DropdownMenuItem>
              <DropdownMenuItem>Ver todas</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  );
}