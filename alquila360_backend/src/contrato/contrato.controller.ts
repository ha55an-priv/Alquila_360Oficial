import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  Res, 
  Query, 
  ParseIntPipe, 
  NotFoundException,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import type { Response } from 'express';
import { ContratoService } from './contrato.service';
import { RegisterAdelantoDto} from './dto/adelanto-dto';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';


@Controller('contratos')
export class ContratoController {
    constructor(private readonly contratoService: ContratoService) {}
    @Post()
        async create(@Body() createContratoDto: CreateContratoDto) {
        return this.contratoService.createContrato(createContratoDto);
     }

    @Get()
        async findAll() {
        return this.contratoService.getAll();
    }
   
    @Get(':idInquilino/:idPropiedad/:fechaInicio')
        async findOne(
            @Param('idInquilino', ParseIntPipe) idInquilino: number,
            @Param('idPropiedad', ParseIntPipe) idPropiedad: number,
            @Param('fechaInicio') fechaInicioString: string,
        ) {
    // Convertimos el string de la URL a Date
        const fechaInicio = new Date(fechaInicioString);
        if (isNaN(fechaInicio.getTime())) {
         throw new NotFoundException('Fecha de inicio inválida');
        }
        return this.contratoService.getOne(idInquilino, idPropiedad, fechaInicio);
    }

    @Get('byId/:idInquilino')
        async findOneById(
            @Param('idInquilino', ParseIntPipe) idInquilino: number
        ) {
        return this.contratoService.getOneById(idInquilino);
    }

    @Patch(':idInquilino/:idPropiedad/:fechaInicio')
        async update(
            @Param('idInquilino', ParseIntPipe) idInquilino: number,
            @Param('idPropiedad', ParseIntPipe) idPropiedad: number,
            @Param('fechaInicio') fechaInicioString: string,
            @Body() updateContratoDto: UpdateContratoDto,
        ) {
        const fechaInicio = new Date(fechaInicioString);
        return this.contratoService.update(idInquilino, idPropiedad, fechaInicio, updateContratoDto);
    }

    @Delete(':idInquilino/:idPropiedad/:fechaInicio')
        async remove(
            @Param('idInquilino', ParseIntPipe) idInquilino: number,
            @Param('idPropiedad', ParseIntPipe) idPropiedad: number,
            @Param('fechaInicio') fechaInicioString: string,
        ) {

        
        const fechaInicio = new Date(fechaInicioString);
        return this.contratoService.delete(idInquilino, idPropiedad, fechaInicio);
    }
    
    @Post('adelanto')
    @HttpCode(HttpStatus.OK) 
        registrarAdelanto(@Body() registerAdvanceDto: RegisterAdelantoDto) {
            return this.contratoService.registrarAdelanto(registerAdvanceDto);
    }

    @Get('deuda/:idInquilino/:idPropiedad/:fechaInicio')
        async getDeudaNeta(
        @Param('idInquilino', ParseIntPipe) idInquilino: number,
        @Param('idPropiedad', ParseIntPipe) idPropiedad: number,
        @Param('fechaInicio') fechaInicioString: string,
        ) {
        const fechaInicio = new Date(fechaInicioString);
        if (isNaN(fechaInicio.getTime())) {
            throw new NotFoundException('Fecha de inicio inválida');
        }

        return this.contratoService.getDeudaNeta(idInquilino, idPropiedad, fechaInicio);
    }

    @Get('pdf/:idInquilino/:idPropiedad/:fechaInicio')
        async descargarPDF(
            @Param('idInquilino', ParseIntPipe) idInquilino: number,
            @Param('idPropiedad', ParseIntPipe) idPropiedad: number,
            @Param('fechaInicio') fechaInicioString: string,
            @Res() res: Response 
        ) {

        const fechaInicio = new Date(fechaInicioString);
        if (isNaN(fechaInicio.getTime())) {
            throw new NotFoundException('Fecha de inicio inválida');
        }

        const pdfBuffer = await this.contratoService.generarContratoPDF(idInquilino, idPropiedad, fechaInicio);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=Contrato_${idInquilino}_${idPropiedad}.pdf`,
            'Content-Length': pdfBuffer.length,
        });

        // Enviar el buffer
        res.end(pdfBuffer);
    }
    
}