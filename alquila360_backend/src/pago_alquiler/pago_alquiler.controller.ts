import { 
    Controller, 
    Post, 
    Body, 
    Put, 
    Get, 
    Param, 
    Res, 
    HttpCode, 
    UsePipes, 
    ValidationPipe,
    UseInterceptors,
    HttpStatus, // Para manejo de archivos
    UploadedFile,
    BadRequestException // Para manejo de archivos
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { PagoAlquilerService } from './pago_alquiler.service';
import { RecordPaymentDto } from './Dto/create-pago_alquiler.dto';
import { RecordMultiplePaymentsDto } from './Dto/record-multiple-payments.dto'; // Importar DTO de múltiples pagos
import { IdentificadorCuotaDto } from './Dto/identificador-cuota.dto'; 
import { PagoAlquiler } from '../entity/pago_alquiler.entity';


@Controller('pagos-alquiler')
@UsePipes(new ValidationPipe({ transform: true }))
export class PagoAlquilerController {
    constructor(private readonly pagoAlquilerService: PagoAlquilerService) {}

    // -----------------------------------------------------------------
    // 1. REGISTRO DE PAGO ÚNICO (POST /pagos-alquiler)
    // Usado típicamente para registrar un pago en EFECTIVO de una sola cuota.
    // -----------------------------------------------------------------
    @Post()
    @HttpCode(201)
    async registrarPagoUnico(@Body() dto: RecordPaymentDto): Promise<PagoAlquiler> {
        return this.pagoAlquilerService.pagarCuota(dto);
    }

    // -----------------------------------------------------------------
    // 2. REGISTRO DE PAGOS MÚLTIPLES (POST /pagos-alquiler/multiple)
    // Usado por el Inquilino para pagar varias cuotas con Transferencia/QR.
    // -----------------------------------------------------------------
    @Post('multiple')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('comprobante')) // 'comprobante' es el nombre del campo del archivo en el formulario
    async registrarPagosMultiples(
        @Body() body : any, 
        @UploadedFile() comprobanteFile?: Express.Multer.File,
    ): Promise<{ cuota: PagoAlquiler, facturaPath: string | null }[]> {
        
        let pagoDto: RecordMultiplePaymentsDto;

    try {
        // 1. Parsear el JSON (que llega como string en el campo 'datosPago')
        if (body.datosPago) {
            pagoDto = JSON.parse(body.datosPago);
        } else {
            // Si no se usó 'datosPago', o el JSON está mal, lanza error.
            throw new BadRequestException('Falta el campo de datos JSON (datosPago) en el formulario.');
        }

    } catch (e) {
        // Captura errores de JSON.parse()
        throw new BadRequestException('Formato de datos de pago JSON inválido.');
    }

    // 3. Pasar el DTO parseado y el archivo al servicio
    return this.pagoAlquilerService.pagarMultiplesCuotas(pagoDto, comprobanteFile);
    }

    // -----------------------------------------------------------------
    // 3. VERIFICACIÓN MANUAL DE PAGO (PUT /pagos-alquiler/verificar)
    // Usado por el Administrador para confirmar pagos PENDIENTE_VERIFICACION.
    // -----------------------------------------------------------------
    @Put('verificar') 
    async verificarPago(@Body() dto: IdentificadorCuotaDto): Promise<PagoAlquiler> {
        return this.pagoAlquilerService.verificarPago(
            dto.idInquilino,
            dto.idPropiedad,
            dto.fechaInicioContrato,
            dto.fechaPago,
        );
    }
    
    // -----------------------------------------------------------------
    // 4. REVERSIÓN DE PAGO (PUT /pagos-alquiler/reversar)
    // Usado por el Administrador para deshacer un pago PAGADO.
    // -----------------------------------------------------------------
    @Put('reversar') 
    async reversarPago(@Body() dto: IdentificadorCuotaDto): Promise<PagoAlquiler> {
        return this.pagoAlquilerService.reversarPago(
            dto.idInquilino,
            dto.idPropiedad,
            dto.fechaInicioContrato,
            dto.fechaPago,
        );
    }

    // -----------------------------------------------------------------
    // 5. DESCARGA DEL ARCHIVO DE COMPROBANTE SUBIDO (GET /pagos-alquiler/comprobante/...)
    // Recupera el archivo PDF/imagen subido por el inquilino (rutaComprobante).
    // -----------------------------------------------------------------
    @Get('comprobante/:idInquilino/:idPropiedad/:fechaInicio/:fechaPago')
    async getComprobanteSubido(
        @Param('idInquilino') idInquilino: string,
        @Param('idPropiedad') idPropiedad: string,
        @Param('fechaInicio') fechaInicioContrato: string,
        @Param('fechaPago') fechaPago: string,
        @Res({ passthrough: true }) res: Response,
    ): Promise<Buffer> {
        
        const { buffer, mimeType } = await this.pagoAlquilerService.getComprobantePagoSubido(
            +idInquilino,
            +idPropiedad,
            fechaInicioContrato,
            fechaPago,
        );

        // Usamos el Content-Type dinámico basado en el archivo subido
        res.set({
            'Content-Type': mimeType, 
            'Content-Disposition': `attachment; filename="comprobante-subido-${fechaPago}.${mimeType.split('/')[1]}"`,
            'Content-Length': buffer.length,
        });

        return buffer; 
    }
    
    // -----------------------------------------------------------------
    // 6. DESCARGA DE LA FACTURA GENERADA (GET /pagos-alquiler/factura/...)
    // Recupera el archivo PDF binario generado por el sistema (rutaFactura).
    // -----------------------------------------------------------------
    @Get('factura/:idInquilino/:idPropiedad/:fechaInicio/:fechaPago')
    async getFacturaGenerada(
        @Param('idInquilino') idInquilino: string,
        @Param('idPropiedad') idPropiedad: string,
        @Param('fechaInicio') fechaInicioContrato: string,
        @Param('fechaPago') fechaPago: string,
        @Res({ passthrough: true }) res: Response,
    ): Promise<Buffer> {
        
        const pdfBuffer = await this.pagoAlquilerService.getFacturaPDF(
            +idInquilino,
            +idPropiedad,
            fechaInicioContrato,
            fechaPago,
        );
        
        // Configurar las cabeceras para forzar la descarga del PDF de la factura
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="factura-${fechaPago}.pdf"`,
            'Content-Length': pdfBuffer.length,
        });

        return pdfBuffer; 
    }
}