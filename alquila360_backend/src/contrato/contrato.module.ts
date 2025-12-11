import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contrato} from 'src/entity/contrato.entity';
import { User } from 'src/entity/user.entity';
import { Propiedad } from 'src/entity/propiedad.entity';
import { ContratoService} from './contrato.service';
import { ContratoController} from './contrato.controller';
import { PagoAlquiler } from 'src/entity/pago_alquiler.entity';
import { PdfGeneratorModule } from 'src/shared/pdf-generator/pdf-generator.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contrato,
      User, 
      Propiedad, 
      PagoAlquiler,
       
    ]),
    PdfGeneratorModule,
  ],
 controllers: [ContratoController],
  providers: [ContratoService],
  exports: [ContratoService],
})
export class ContratoModule {}