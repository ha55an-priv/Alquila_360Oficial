import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './pago.service';
import { PaymentsController } from './pago.controller';
import { PagoAlquiler } from '../entity/pago_alquiler.entity';
import { PagoTecnico } from '../entity/pagoTecnico.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PagoAlquiler, PagoTecnico]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
