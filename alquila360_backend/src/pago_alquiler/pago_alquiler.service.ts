import { Injectable, NotFoundException,InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PagoAlquiler, EstadoPago } from '../entity/pago_alquiler.entity'; 
import { Contrato } from '../entity/contrato.entity';
import { RecordPaymentDto } from './Dto/create-pago_alquiler.dto';
import { ContratoService } from '../contrato/contrato.service'; // Asumiendo que quieres reutilizar el servicio
import { PaymentMethod } from './Dto/metodo-pago.enum';
import { PdfGeneratorService } from '../shared/pdf-generator/pdf-generator.service';
import {RecordMultiplePaymentsDto} from './Dto/record-multiple-payments.dto'
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PagoAlquilerService {
    constructor(

        @InjectRepository(PagoAlquiler)
        private pagoAlquilerRepository: Repository<PagoAlquiler>,
        
        @InjectRepository(Contrato)
        private contratoRepository: Repository<Contrato>,

        private readonly contratoService: ContratoService,

        private readonly pdfGeneratorService: PdfGeneratorService,
    ) {}

    //dey es mi bro

   async getCuotasPendientes(idInquilino: number, idPropiedad: number, fechaInicioContrato: Date): Promise<any> {
    // Reutilizamos el servicio que calcula deuda y multas
    const reporteDeuda = await this.contratoService.getDeudaNeta(
        idInquilino, 
        idPropiedad, 
        fechaInicioContrato
    );
    
    return {
        adelantoRestante: reporteDeuda.adelantoRestante,
        cuotasDisponibles: reporteDeuda.cuotasPendientesDetalle
            .filter(cuota => cuota.deudaNeta > 0)
            .map(cuota => ({
                fechaVencimiento: cuota.fechaVencimiento,
                montoBase: cuota.montoBase,
                multa: cuota.multa,
                deudaTotalConMulta: cuota.deudaNeta + cuota.multa, // O usa deudaNeta directamente si ya incluye la multa
                // Nota: Asegúrate de que tu getDeudaNeta devuelve la deuda correcta (con o sin multa)
                // Si deudaNeta ya incluye multa, solo devuelve cuota.deudaNeta
                estadoActual: cuota.estadoActual
            }))
        };
    }

async pagarMultiplesCuotas(
    dto: RecordMultiplePaymentsDto, 
    comprobanteFile?: Express.Multer.File // El archivo del comprobante subido
): Promise<{ cuota: PagoAlquiler, facturaPath: string | null }[]> {
    
    const { cuotas, montoPagadoTotal, metodoDePago, motivo, referenciaTransaccion } = dto;
    
    if (cuotas.length === 0) {
        throw new BadRequestException('Debe seleccionar al menos una cuota para pagar.');
    }
    
    const requiereVerificacion = (metodoDePago === PaymentMethod.TRANSFERENCIA || metodoDePago === PaymentMethod.QR);
    const estadoInicial = requiereVerificacion ? EstadoPago.PENDIENTE_VERIFICACION : EstadoPago.PAGADA;
    const cuotasPagadasResultado: { cuota: PagoAlquiler, facturaPath: string | null }[] = [];

    const { idInquilino, idPropiedad, fechaInicioContrato } = cuotas[0]; 

    
    const fechaInicioContratoString = fechaInicioContrato.substring(0, 10);
    const fechaInicioNormalizada = new Date(fechaInicioContratoString);// Usamos un Date normalizado a medianoche UTC
    
    // Ordenar las cuotas seleccionadas para procesar de la más antigua a la más reciente
    const cuotasOrdenadas = cuotas.sort((a, b) => new Date(a.fechaPago).getTime() - new Date(b.fechaPago).getTime());
    
    // a) Obtener el Reporte de Deuda (calcula el orden y multas)
    // Usamos la fecha normalizada para evitar errores 404
    const reporteDeuda = await this.contratoService.getDeudaNeta(idInquilino, idPropiedad, fechaInicioNormalizada);
    
    let deudaNetaTotalCalculada = 0;
    
    // b) Validar la Continuidad y calcular la deuda total (Tu lógica de validación es correcta)
    let pagosContinuos = true;
    for (const cuotaSeleccionada of cuotasOrdenadas) {
        
        const fechaCuotaSeleccionada = new Date(cuotaSeleccionada.fechaPago);
        
        const detalle = reporteDeuda.cuotasPendientesDetalle.find(d => 
            new Date(d.fechaVencimiento).getTime() === fechaCuotaSeleccionada.getTime()
        );

        if (!detalle || detalle.deudaNeta <= 0) {
            throw new BadRequestException(`La cuota de ${fechaCuotaSeleccionada.toISOString().substring(0, 10)} ya está pagada o no tiene deuda.`);
        }
        
        // La validación de continuidad usando el primer pendiente es correcta
        const primerPendiente = reporteDeuda.cuotasPendientesDetalle.find(d => d.deudaNeta > 0);

        if (primerPendiente && new Date(primerPendiente.fechaVencimiento).getTime() < fechaCuotaSeleccionada.getTime()) {
            pagosContinuos = false;
        }

        deudaNetaTotalCalculada += detalle.deudaNeta; 
    }
    
    if (!pagosContinuos) {
        throw new BadRequestException('Las cuotas deben pagarse en estricto orden cronológico (de la más antigua a la más reciente).');
    }
    
    // c) Validar Monto y Referencia (Correcto)
    if (montoPagadoTotal < deudaNetaTotalCalculada) {
        throw new BadRequestException(`El monto pagado es insuficiente. Deuda total (incluyendo multas): ${deudaNetaTotalCalculada.toFixed(2)}.`);
    }
    if (requiereVerificacion && (!referenciaTransaccion || !comprobanteFile)) {
        throw new BadRequestException(`El método de pago ${metodoDePago} requiere una referencia y un comprobante (archivo).`);
    }

    // 2. Procesamiento y Persistencia (Transacción) ------------------------------
    const queryRunner = this.pagoAlquilerRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let excesoTotal = montoPagadoTotal - deudaNetaTotalCalculada;
    let rutaComprobanteFinal: string | null = null;
    
    try {
        if (comprobanteFile) {
            rutaComprobanteFinal = await this.guardarComprobante(comprobanteFile);
        }

        for (const cuotaSeleccionada of cuotasOrdenadas) {
            const fechaCuota = new Date(cuotaSeleccionada.fechaPago);

            // 🛑 1. Ya NO SE NECESITA findOne + save: 
            // 🛑    Se actualiza directamente y se carga SOLO para el retorno/factura.

            // 2. Obtener la deuda neta de ESTA cuota
            const detalleCuota = reporteDeuda.cuotasPendientesDetalle.find(d => 
                new Date(d.fechaVencimiento).getTime() === fechaCuota.getTime()
            );

            if (!detalleCuota) throw new InternalServerErrorException('Error interno al re-calcular la cuota.');
            
            const deudaNeta = detalleCuota.deudaNeta;

            // 🟢 NUEVA LÓGICA: Actualizar la entidad PagoAlquiler directamente
            const updateResult = await queryRunner.manager.update(PagoAlquiler, 
                { // WHERE: La clave compuesta
                    idInquilino,
                    idPropiedad,
                    fechaInicioContrato: fechaInicioNormalizada,
                    fechaPago: fechaCuota
                },
                { // SET: Los campos a actualizar
                    estado: estadoInicial, 
                    montoPagado: deudaNeta, // El monto pagado es igual a la deuda neta calculada
                    multaPagada: detalleCuota.multa, 
                    metodoDePago: metodoDePago, 
                    motivo: motivo, 
                    fechaRegistroPago: new Date(),
                    referenciaTransaccion: referenciaTransaccion || null,
                    rutaComprobante: rutaComprobanteFinal
                }
            );

            if (updateResult.affected === 0) {
                 // Si no se actualizó, es porque no existe o ya estaba pagada, aunque esto debería ser atrapado arriba.
                 continue; 
            }
            
            // 4. Buscar la entidad actualizada para el retorno y la factura (Con sus relaciones)
            const cuotaGuardada = await queryRunner.manager.findOne(PagoAlquiler, {
                where: {
                    idInquilino,
                    idPropiedad,
                    fechaInicioContrato: fechaInicioNormalizada, 
                    fechaPago: fechaCuota
                },
                relations: ['contrato', 'contrato.inquilino'] // Importante para la serialización del retorno
            });

            if (!cuotaGuardada) {
                 throw new InternalServerErrorException('Error al recuperar la cuota después de la actualización.');
            }

            // 5. Generar la factura (PDF) INDIVIDUAL
            let facturaPath: string | null = null;
            if (estadoInicial === EstadoPago.PAGADA) {
                // Generar y guardar la ruta de la FACTURA
                facturaPath = await this.generarYGuardarFactura(cuotaGuardada, detalleCuota);
            }

            cuotasPagadasResultado.push({ cuota: cuotaGuardada, facturaPath });
        }
        
        // 6. Actualizar el Contrato (Mantenemos la corrección del redondeo)
        const contratoEntity = await queryRunner.manager
            .createQueryBuilder(Contrato, 'contrato')
            .where('contrato.idInquilino = :idInquilino', { idInquilino })
            .andWhere('contrato.idPropiedad = :idPropiedad', { idPropiedad })
            .andWhere("DATE_FORMAT(contrato.fechaInicio, '%Y-%m-%d') = :fechaInicioString", { 
                fechaInicioString: fechaInicioContratoString
            })
            .getOne();
        
        if (contratoEntity) {
            
            const adelantoBase = parseFloat(contratoEntity.adelanto?.toString() || '0') || 0; 
            const nuevoAdelantoTotal = adelantoBase + excesoTotal;
            const nuevoAdelantoRedondeado = Math.round(nuevoAdelantoTotal * 100) / 100;
            
            // 🟢 Corrección de decimal (Asignar el valor)
            contratoEntity.adelanto = nuevoAdelantoRedondeado; 
            
            await queryRunner.manager.save(contratoEntity);

        } else {
            throw new InternalServerErrorException('Contrato no encontrado durante la fase de actualización de adelanto.');
        }

        // 7. Intentar el Commit (Punto crítico)
        await queryRunner.commitTransaction();
        return cuotasPagadasResultado;

    } catch (error) {
        await queryRunner.rollbackTransaction();
        if (rutaComprobanteFinal) this.eliminarComprobante(rutaComprobanteFinal);
        
        console.error('--- ERROR CRÍTICO EN TRANSACCIÓN DE PAGO ---');
        console.error(error);
        if (error.status && error.status !== 500) {
            throw error;
        } else {
            throw new InternalServerErrorException('Error interno del servidor durante el procesamiento del pago.');
        }
    } finally {
        await queryRunner.release();
    }
}
        
    async pagarCuota(dto: RecordPaymentDto): Promise<PagoAlquiler> {
    const { 
        idInquilino, 
        idPropiedad, 
        fechaInicioContrato, 
        fechaPago, 
        montoPagado,
        metodoDePago, 
        motivo,
        referenciaTransaccion 
    } = dto;
    
    // 1. Determinar el estado inicial y las fechas
    const requiereVerificacion = (metodoDePago === PaymentMethod.TRANSFERENCIA || metodoDePago === PaymentMethod.QR);
    const estadoInicial = requiereVerificacion 
        ? EstadoPago.PENDIENTE_VERIFICACION 
        : EstadoPago.PAGADA;

    const fechaInicio = new Date(fechaInicioContrato);
    const fechaCuota = new Date(fechaPago);
    
    const fechaInicioString = fechaInicio.toISOString().substring(0, 10);
    const fechaCuotaString = fechaCuota.toISOString().substring(0, 10);

    // 2. Búsqueda de Contrato y Cuota
    const [contrato, cuota] = await Promise.all([
        this.contratoRepository
            .createQueryBuilder('contrato')
            .select(['contrato.adelanto', 'contrato.multaRetraso', 'contrato.idInquilino', 'contrato.idPropiedad', 'contrato.fechaInicio']) 
            .where('contrato.idInquilino = :idInquilino', { idInquilino })
            .andWhere('contrato.idPropiedad = :idPropiedad', { idPropiedad })
            .andWhere("DATE_FORMAT(contrato.fechaInicio, '%Y-%m-%d') = :fechaInicioString", { fechaInicioString })
            .getOne(),
        
        this.pagoAlquilerRepository
            .createQueryBuilder('cuota')
            .where('cuota.idInquilino = :idInquilino', { idInquilino })
            .andWhere('cuota.idPropiedad = :idPropiedad', { idPropiedad })
            .andWhere("DATE_FORMAT(cuota.fechaInicioContrato, '%Y-%m-%d') = :fechaInicioString", { fechaInicioString })
            .andWhere("DATE_FORMAT(cuota.fechaPago, '%Y-%m-%d') = :fechaCuotaString", { fechaCuotaString })
            .getOne(),
    ]);

    if (!cuota) throw new NotFoundException('Cuota no encontrada.');
    if (!contrato) throw new NotFoundException('Contrato asociado no encontrado.');
    if (cuota.estado === EstadoPago.PAGADA) throw new BadRequestException('Esta cuota ya fue pagada.');

    // 3. Obtener Deuda Neta y Validaciones
    const reporteDeuda = await this.contratoService.getDeudaNeta(idInquilino, idPropiedad, fechaInicio);

    const detalleCuota = reporteDeuda.cuotasPendientesDetalle.find(
        d => d.fechaVencimiento.getTime() === fechaCuota.getTime()
    );

    if (!detalleCuota) {
        throw new InternalServerErrorException('No se pudo calcular la deuda de la cuota.');
    }

    const deudaNeta = detalleCuota.deudaNeta;
    
    // Validar monto
    if (montoPagado < deudaNeta) {
        throw new BadRequestException(`El monto pagado es insuficiente. Deuda neta: ${deudaNeta.toFixed(2)}.`);
    }

    const requiereReferencia = (metodoDePago === PaymentMethod.TRANSFERENCIA || metodoDePago === PaymentMethod.QR);

    // Validar referencia (si aplica)
    if (requiereReferencia && (!referenciaTransaccion || referenciaTransaccion.trim() === '')) {
        throw new BadRequestException(`El método de pago ${metodoDePago} requiere una referencia de transacción válida.`);
    }
    
    
    const exceso = montoPagado - deudaNeta;
    
    cuota.estado = estadoInicial; 
    cuota.montoPagado = montoPagado;
    cuota.multaPagada = detalleCuota.multa; 
    cuota.metodoDePago = metodoDePago; 
    cuota.motivo = motivo; 
    cuota.fechaRegistroPago = new Date();
    cuota.referenciaTransaccion = referenciaTransaccion || null;


    await this.pagoAlquilerRepository.save(cuota);

    // 5. Lógica Post-Pago (solo si es PAGADA de inmediato, ej: EFECTIVO)
    if (estadoInicial === EstadoPago.PAGADA) {
        
        
        await this.generarYGuardarFactura(cuota, detalleCuota);

        contrato.adelanto = (contrato.adelanto || 0) + exceso;
        await this.contratoRepository.save(contrato);
    }
    
    return cuota;
}
    

    async verificarPago(
    idInquilino: number, 
    idPropiedad: number, 
    fechaInicioContrato: string, 
    fechaPago: string
): Promise<PagoAlquiler> {

    const fechaInicio = new Date(fechaInicioContrato);
    const fechaCuota = new Date(fechaPago);

    // 1. Obtener la Cuota y el Contrato
    const [contrato, cuota] = await Promise.all([
        this.contratoRepository.findOne({ 
            where: { idInquilino, idPropiedad, fechaInicio }, 
            // Aseguramos que traemos toda la entidad del contrato
        }),
        this.pagoAlquilerRepository.findOne({ 
            where: { 
                idInquilino, 
                idPropiedad, 
                fechaInicioContrato: fechaInicio,
                fechaPago: fechaCuota 
            } 
        }),
    ]);
    
    if (!cuota || !contrato) {
        throw new NotFoundException('Cuota o contrato no encontrado.');
    }

    if (cuota.estado !== EstadoPago.PENDIENTE_VERIFICACION) {
        throw new BadRequestException('Esta cuota no requiere verificación o ya está pagada.');
    }
    
    // 2. Recalcular deuda y exceso
    const reporteDeuda = await this.contratoService.getDeudaNeta(idInquilino, idPropiedad, fechaInicio);

    const detalleCuota = reporteDeuda.cuotasPendientesDetalle.find(
        d => d.fechaVencimiento.getTime() === fechaCuota.getTime()
    );

    if (!detalleCuota) {
        throw new InternalServerErrorException('No se pudo calcular la deuda de la cuota al verificar.');
    }

    const deudaNeta = detalleCuota.deudaNeta;
    const adelantoRestante = reporteDeuda.adelantoRestante; 
    
    // Usamos el montoPagado que se registró en pagarCuota
    const montoPagado = cuota.montoPagado || 0; 
    const exceso = montoPagado - deudaNeta; 

    // 3. Iniciar Transacción
    const queryRunner = this.pagoAlquilerRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // 3.1. Marcar el estado final de la Cuota
        cuota.estado = EstadoPago.PAGADA; 
        
        // 3.2. Generar Factura PDF
        // Este método guarda la ruta de la factura en cuota.rutaFactura
        await this.generarYGuardarFactura(cuota, detalleCuota); 
        
        // Guardamos la cuota con el nuevo estado y la ruta de la factura
        await queryRunner.manager.save(cuota);
        
        // 3.3. Aplicar efecto financiero al Contrato
        contrato.adelanto = (contrato.adelanto || 0) + exceso;
        await queryRunner.manager.save(contrato);
        
        // 3.4. Finalizar
        await queryRunner.commitTransaction();
        
        return cuota;

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
}



    async getComprobantePagoSubido(
        idInquilino: number, 
        idPropiedad: number, 
        fechaInicioContrato: string, 
        fechaPago: string
    ): Promise<{ buffer: Buffer, mimeType: string }> {
        
        const fechaInicio = new Date(fechaInicioContrato);
        const fechaCuota = new Date(fechaPago);

        // 1. Obtener la cuota
        const cuota = await this.pagoAlquilerRepository.findOne({ 
            where: { 
                idInquilino, 
                idPropiedad, 
                fechaInicioContrato: fechaInicio,
                fechaPago: fechaCuota 
            } 
        });

        if (!cuota || !cuota.rutaComprobante) {
            throw new NotFoundException('Comprobante subido no encontrado.');
        }

        // 2. Construir la ruta completa y leer el archivo
        const filePath = path.join(process.cwd(), 'uploads', 'comprobantes', cuota.rutaComprobante);
        
        try {
            const buffer = fs.readFileSync(filePath);
            // Intentar adivinar el tipo MIME (si el archivo es guardado con extensión, esto es más fácil)
            const extension = path.extname(cuota.rutaComprobante).toLowerCase();
            let mimeType = 'application/octet-stream';

            if (extension === '.pdf') mimeType = 'application/pdf';
            else if (extension === '.jpg' || extension === '.jpeg') mimeType = 'image/jpeg';
            else if (extension === '.png') mimeType = 'image/png';
            
            return { buffer, mimeType };

        } catch (error) {
            console.error('Error al leer el comprobante subido:', error);
            throw new InternalServerErrorException('Error al acceder al archivo del comprobante en el servidor.');
        }
    }


    

    async getFacturaPDF(
        idInquilino: number, 
        idPropiedad: number, 
        fechaInicioContrato: string, 
        fechaPago: string
    ): Promise<Buffer> {
        
        const fechaInicio = new Date(fechaInicioContrato);
        const fechaCuota = new Date(fechaPago);

        const cuota = await this.pagoAlquilerRepository.findOne({ 
            where: { 
                idInquilino, 
                idPropiedad, 
                fechaInicioContrato: fechaInicio,
                fechaPago: fechaCuota 
            } 
        });

        if (!cuota || cuota.estado !== EstadoPago.PAGADA) {
            throw new NotFoundException('Factura no encontrada. El pago no ha sido completado o verificado.');
        }

        // 1. Verificar la ruta de la FACTURA (Asumiendo que creaste la columna rutaFactura)
        if (!cuota.rutaFactura) { 
            throw new NotFoundException('La factura PDF no fue generada.');
        }
        
        // 2. Construir la ruta completa y leer el archivo (Asumiendo que se guardan en 'uploads/facturas')
        const filePath = path.join(process.cwd(), 'uploads', 'facturas', cuota.rutaFactura);
        
        try {
            return fs.readFileSync(filePath);
        } catch (error) {
            throw new InternalServerErrorException('Error al acceder al archivo PDF de la factura en el servidor.');
        }
    }
        

    async reversarPago(
    idInquilino: number, 
    idPropiedad: number, 
    fechaInicioContrato: string, 
    fechaPago: string
): Promise<PagoAlquiler> {
    
    const fechaInicio = new Date(fechaInicioContrato);
    const fechaCuota = new Date(fechaPago);

    // 1. Obtener la Cuota y el Contrato
    const [contrato, cuota] = await Promise.all([
        // Importante: Traer el ID y el adelanto para poder guardarlo
        this.contratoRepository.findOne({ 
            where: { idInquilino, idPropiedad, fechaInicio }, 
        }),
        this.pagoAlquilerRepository.findOne({ 
            where: { 
                idInquilino, 
                idPropiedad, 
                fechaInicioContrato: fechaInicio,
                fechaPago: fechaCuota 
            } 
        }),
    ]);

    if (!cuota) throw new NotFoundException('Cuota no encontrada.');
    if (!contrato) throw new NotFoundException('Contrato asociado no encontrado.');
    
    // 2. Validación de Estado
    if (cuota.estado !== EstadoPago.PAGADA) {
        throw new BadRequestException('Solo se pueden reversar pagos con estado PAGADA.');
    }

    // 3. Obtener la Deuda Neta para calcular el Exceso
    const reporteDeuda = await this.contratoService.getDeudaNeta(idInquilino, idPropiedad, fechaInicio);
    const detalleCuota = reporteDeuda.cuotasPendientesDetalle.find(
        d => d.fechaVencimiento.getTime() === fechaCuota.getTime()
    );

    if (!detalleCuota) {
        throw new InternalServerErrorException('Error en el cálculo de deuda para reversión.');
    }

    const deudaNeta = detalleCuota.deudaNeta;
    const excesoOriginal = (cuota.montoPagado || 0) - deudaNeta;
    
    // Variables para archivos que DEBEMOS eliminar
    const rutaFacturaParaEliminar = cuota.rutaFactura;
    // La rutaComprobante NO la eliminamos, solo la reseteamos en BD (porque puede ser compartida)

    // 4. Iniciar Transacción para garantizar atomicidad
    const queryRunner = this.pagoAlquilerRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // 4.1. Revertir el Adelanto (si hubo exceso)
        if (excesoOriginal > 0) {
            contrato.adelanto = Math.max(0, (contrato.adelanto ?? 0) - excesoOriginal);
            await queryRunner.manager.save(contrato);
        }

        // 4.2. Resetear los campos de la Cuota
        cuota.estado = EstadoPago.PENDIENTE; 
        cuota.montoPagado = null;           
        cuota.multaPagada = null;           
        cuota.metodoDePago = null;           
        cuota.motivo = null;                 
        cuota.referenciaTransaccion = null;  
        cuota.fechaRegistroPago = null;     
        
        // 4.3. Resetear las rutas de archivos
        cuota.rutaFactura = null;   // Factura (única, pero se borra físicamente después del commit)
        cuota.rutaComprobante = null; // Comprobante (compartida, solo se resetea la ref. en BD)
        
        // 4.4. Guardar la Cuota Reversada
        await queryRunner.manager.save(cuota);
        
        await queryRunner.commitTransaction();

        // 5. Borrado Físico de Factura (después del commit)
        if (rutaFacturaParaEliminar) {
            this.eliminarFactura(rutaFacturaParaEliminar);
        }
        
        return cuota;

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
}
    
    


    // ... dentro de PagoAlquilerService (Métodos Privados)
    
    private async guardarComprobante(file: Express.Multer.File): Promise<string> {
        const fileName = `${Date.now()}-${file.originalname}`;
        const uploadPath = path.join(process.cwd(), 'uploads', 'comprobantes', fileName);
        
        // Asegúrate de que el directorio exista
        if (!fs.existsSync(path.dirname(uploadPath))) {
            fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
        }
        
        await fs.promises.writeFile(uploadPath, file.buffer);
        return fileName; // Devolvemos solo el nombre de archivo
    }

    private eliminarComprobante(fileName: string): void {
        const filePath = path.join(process.cwd(), 'uploads', 'comprobantes', fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    // ... dentro de PagoAlquilerService (Métodos Privados)

    // Genera la factura de una sola cuota y guarda la ruta en el sistema de archivos
    private async generarYGuardarFactura(cuota: PagoAlquiler, detalleCuota: any): Promise<string> {
        
        // NOTA: NECESITAS UNA PROPIEDAD 'rutaFactura' EN LA ENTIDAD PagoAlquiler
        
        const datosFactura = {
            // Datos para la factura (Inquilino, Propiedad, detalles del pago)
            fechaEmision: new Date(),
            cuotaInfo: {
                fechaVencimiento: cuota.fechaPago,
                montoBase: parseFloat(detalleCuota.montoBase),
                multaAplicada: detalleCuota.multa,
                totalPagado: cuota.montoPagado,
            },
            // ... (otros datos del contrato que necesites)
        };
        
        // El pdfGeneratorService necesita un método para la factura
        const filePath = await this.pdfGeneratorService.generateInvoice(datosFactura);
        
        // Guardar la ruta en la cuota (Asegúrate de tener la columna `rutaFactura` en PagoAlquiler)
        cuota.rutaFactura = path.basename(filePath); 
        await this.pagoAlquilerRepository.save(cuota);
        
        return cuota.rutaFactura;
    }

       
    private eliminarFactura(fileName: string): void {
        const filePath = path.join(process.cwd(), 'uploads', 'facturas', fileName);
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (e) {
            console.error("No se pudo eliminar el archivo de Factura:", e);
        }
    }
        
}