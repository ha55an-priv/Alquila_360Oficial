import { Module, Global } from '@nestjs/common';
import { PdfGeneratorModule } from './pdf-generator/pdf-generator.module';
// import { OtroServicioReutilizableModule } from './otra-carpeta/otro-servicio-reutilizable.module'; 

// Opcional: El decorador @Global() puede hacer que SharedModule esté disponible 
// en toda la aplicación sin importarlo en cada módulo. Úsalo con moderación.

@Module({
  imports: [
    // 1. Importa todos los módulos pequeños que quieres compartir
    PdfGeneratorModule,
    // OtroServicioReutilizableModule,
  ],
  exports: [
    // 2. Vuelve a exportar todo lo que importaste. 
    // Esto hace que los servicios de esos módulos estén disponibles para quien importe SharedModule.
    PdfGeneratorModule,
    // OtroServicioReutilizableModule,
  ]
})
export class SharedModule {}