import { DataSource } from "typeorm";

// IMPORTAR TODAS TUS ENTIDADES AQUÍ
import { User } from "./entity/user.entity"; 
import { TelefonoUsuario } from "./entity/telefonoUsuario.entity";
import { EmailUsuario } from "./entity/emailUsuario.entity"; 
import { Role } from "./entity/rol.entity";
import { Propiedad } from "./entity/propiedad.entity";
import { Contrato } from "./entity/contrato.entity";
import { MetodoPago } from "./entity/metodoPago.entity";
import { PagoAlquiler } from "./entity/pago_alquiler.entity";
import { Ticket } from "./entity/ticket.entity";
import { Problema } from "./entity/problema.entity";
import { Resena } from "./entity/resena.entity";
import { PagoTecnico } from "./entity/pagoTecnico.entity";
// Asegúrate de que las rutas sean correctas, ej: "./entity/User"

const AppDataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3308,
    username: "alquila360_admin",
    password: "123456789",
    database: "alquila360",
    
    // LISTAR TODAS LAS ENTIDADES CREADAS
    entities: [
        User,
        EmailUsuario,
        TelefonoUsuario, 
        Role, 
        Propiedad, 
        Contrato, 
        MetodoPago, 
        PagoAlquiler, 
        Ticket, 
        Problema, 
        Resena, 
        PagoTecnico
    ],
    
    synchronize: true, // Esto es clave para crear/actualizar las tablas
    logging: true, // Cambia a 'true' para ver las consultas SQL (útil para debug)
});

export default AppDataSource;