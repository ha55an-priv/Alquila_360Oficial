import { Module } from '@nestjs/common';
import { PdfGeneratorService } from './pdf-generator.service';

@Module({
  providers: [
    PdfGeneratorService // 1. Declara el servicio
  ],
  exports: [
    PdfGeneratorService // 2. Exporta el servicio para que otros módulos lo puedan usar
  ]
})
export class PdfGeneratorModule {}