// src/property/dto/create-property.dto.ts

import { IsNotEmpty, IsString, IsNumber, IsIn, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoPropiedad } from 'src/entity/propiedad.entity'; 

export class CreatePropertyDto {
    

    @IsNotEmpty({ message: 'La descripción es obligatoria.' })
    @IsString({ message: 'La descripción debe ser texto.' })
    descripcion: string; 

  
    @IsNotEmpty({ message: 'El tipo de propiedad es obligatorio.' })
    @IsString({ message: 'El tipo debe ser texto.' })
    @IsIn(['Apartamento', 'Casa', 'Local', 'Oficina', 'Bodega'], { message: 'Tipo de propiedad no válido.' })
    tipo: string; 

 
    @IsOptional()
    @IsIn(Object.values(EstadoPropiedad), { message: 'Estado de propiedad no válido.' })
    estado: EstadoPropiedad = EstadoPropiedad.Libre; 

 
    @IsNotEmpty({ message: 'La ciudad es obligatoria.' })
    @IsString({ message: 'La ciudad debe ser texto.' })
    ciudad: string; 


    @IsNotEmpty({ message: 'La calle/dirección es obligatoria.' })
    @IsString({ message: 'La calle/dirección debe ser texto.' })
    calle: string;

   
    @IsOptional() 
    @IsNumber({}, { message: 'El número de vivienda debe ser un número válido.' })
    @Type(() => Number)
    numViv?: number; 

   
}