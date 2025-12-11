import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-pago.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
