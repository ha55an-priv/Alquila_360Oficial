// src/types/express-request.d.ts o similar

import { User } from 'src/entity/user.entity'; // Ajusta la ruta a tu entidad User

declare module 'express' {
  // Extiende la interfaz Request de Express
  export interface Request {

    user?: {
      ci: number; // O number | string, dependiendo del tipo de tu CI
      // roles?: string[];
    };
  }
}