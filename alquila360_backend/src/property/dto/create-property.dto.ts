
import { IsNotEmpty, IsString, IsNumber, IsIn, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
  // 📝 Información básica

  @IsNotEmpty({ message: 'El título es obligatorio.' })
  @IsString({ message: 'El título debe ser texto.' })
  title: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @IsString({ message: 'La descripción debe ser texto.' })
  description: string;

  @IsNotEmpty({ message: 'El tipo de propiedad es obligatorio.' })
  @IsString({ message: 'El tipo debe ser texto.' })
  @IsIn(['Apartamento', 'Casa', 'Local', 'Oficina', 'Bodega'], { message: 'Tipo de propiedad no válido.' })
  type: string; 

  // 📍 Ubicación

  @IsNotEmpty({ message: 'La dirección es obligatoria.' })
  @IsString({ message: 'La dirección debe ser texto.' })
  address: string;

  @IsNotEmpty({ message: 'La ciudad es obligatoria.' })
  @IsString({ message: 'La ciudad debe ser texto.' })
  city: string;

  @IsOptional() // Hacemos el código postal opcional, pero si existe, debe ser texto
  @IsString({ message: 'El código postal debe ser texto.' })
  zipCode?: string;

  // 📐 Detalles (Usamos @Type(() => Number) para asegurar que NestJS trate el valor como número)

  @IsNotEmpty({ message: 'El número de habitaciones es obligatorio.' })
  @IsNumber({}, { message: 'Debe ser un número válido.' })
  @Min(1, { message: 'Debe tener al menos una habitación.' })
  @Type(() => Number)
  bedrooms: number;

  @IsNotEmpty({ message: 'El número de baños es obligatorio.' })
  @IsNumber({}, { message: 'Debe ser un número válido.' })
  @Min(1, { message: 'Debe tener al menos un baño.' })
  @Type(() => Number)
  bathrooms: number;

  @IsNotEmpty({ message: 'El área en m² es obligatoria.' })
  @IsNumber({}, { message: 'Debe ser un número válido.' })
  @Min(10, { message: 'El área mínima es de 10 m².' })
  @Type(() => Number)
  area: number; 

  // 💰 Precio

  @IsNotEmpty({ message: 'El precio es obligatorio.' })
  @IsNumber({}, { message: 'El precio debe ser un número válido.' })
  @Min(1, { message: 'El precio debe ser mayor a cero.' })
  @Type(() => Number)
  price: number;
}