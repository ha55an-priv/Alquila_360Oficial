import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { RegisterAdelantoDto } from './dto/adelanto-dto';
import { CuotaDetalladaInterface} from './interfaces/deuda-detalle.interface';
import { CuotaConMultaCalculada } from './interfaces/cuotaConMultaCalculada.interface';
import { Contrato } from '../entity/contrato.entity';
import { EstadoPago, PagoAlquiler } from '../entity/pago_alquiler.entity'; 
import { User } from '../entity/user.entity';
import { Propiedad } from '../entity/propiedad.entity';
import { PdfGeneratorService } from '../shared/pdf-generator/pdf-generator.service';
import { CallTracker } from 'assert/strict';
import { contains } from 'class-validator';


@Injectable()
export class ContratoService {
  constructor(
    
    @InjectRepository(Contrato)
    private contratoRepository: Repository<Contrato>,

    @InjectRepository(PagoAlquiler)
    private pagoAlquilerRepository: Repository<PagoAlquiler>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
    
    @InjectRepository(Propiedad)
    private propiedadRepository: Repository<Propiedad>,

    private readonly pdfGeneratorService: PdfGeneratorService,
    ) {}

    async createContrato(contratoDto: CreateContratoDto): Promise<Contrato> {
       
        const { idInquilino, idPropiedad, fechaInicio } = contratoDto;

        const inquilino = await this.userRepository.findOne({ where: { ci: idInquilino } as any });
        if (!inquilino) {
            throw new NotFoundException(`Inquilino con ID ${idInquilino} no encontrado.`);
        }

        const propiedad = await this.propiedadRepository.findOne({ where: { idPropiedad } as any });
        if (!propiedad) {
            throw new NotFoundException(`Propiedad con ID ${idPropiedad} no encontrada.`);
        }

        const fechaInicioContrato = new Date(fechaInicio); 
    
       
        const fechaInicioString = fechaInicioContrato.toISOString().substring(0, 10);

         const contratoExistente = await this.contratoRepository.findOne({
            where: {
                idInquilino,
                idPropiedad,
                fechaInicio: fechaInicioContrato,
            } as any,
        });

        if (contratoExistente) {
            throw new BadRequestException(
                `Ya existe un contrato para el Inquilino ${idInquilino} en la Propiedad ${idPropiedad} con fecha de inicio ${fechaInicio}.`
            );
        }
            
        const nuevoContrato = this.contratoRepository.create({
        ...contratoDto, 
        fechaInicio: new Date(contratoDto.fechaInicio),
        fechaFin: new Date(contratoDto.fechaFin),
    
        });
        let contratoGuardado: Contrato;

        try {
            contratoGuardado = await this.contratoRepository.save(nuevoContrato);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY' || (error.message && error.message.includes('Duplicate entry'))) {
                throw new BadRequestException(
                    `La base de datos ya contiene un contrato con esta clave compuesta (Inquilino, Propiedad, Fecha de Inicio).`
                );
            }
            throw error; 
        }
            
        await this.generarCuotasMensuales(contratoGuardado);
        return contratoGuardado;
    }

    async getAll(): Promise<Contrato[]> {
    
    return this.contratoRepository.find();
    }

    async getOne(idInquilino: number, idPropiedad: number, fechaInicio: Date): Promise<Contrato> {
    
    const fechaInicioString = fechaInicio.toISOString().substring(0, 10);
    const contrato = await this.contratoRepository
        .createQueryBuilder('contrato')
    
        .where('contrato.idInquilino = :idInquilino', { idInquilino })
        .andWhere('contrato.idPropiedad = :idPropiedad', { idPropiedad })
       
        .andWhere("DATE_FORMAT(contrato.fechaInicio, '%Y-%m-%d') = :fechaInicioString", { 
          fechaInicioString: fechaInicioString // Usamos el string simple
        })
        .getOne();

        if (!contrato) {
            throw new NotFoundException(`Contrato no encontrado para las claves proporcionadas.`);
        }
        
        return contrato;
    }
    async getOneById(idInquilino: number): Promise<Contrato[]> {
    
    const contrato = await this.contratoRepository
        .createQueryBuilder('contrato')
        .where('contrato.idInquilino = :idInquilino', { idInquilino })
        .getMany()

        if (!contrato) {
            throw new NotFoundException(`Contrato no encontrado para el id seleccionado.`);
        }
        return contrato;
    }
    
    async update(
            idInquilino: number, 
            idPropiedad: number, 
            fechaInicio: Date, 
            updateDto: UpdateContratoDto
      ): Promise<Contrato> {

        const contrato = await this.getOne(idInquilino, idPropiedad, fechaInicio); // Reutiliza el findOne para verificar existencia
        
        const contratoActualizado = this.contratoRepository.merge(contrato, updateDto);
        
        return this.contratoRepository.save(contratoActualizado);
    }
   

    async delete(idInquilino: number, idPropiedad: number, fechaInicio: Date): Promise<void> {        // TypeORM manejará la eliminación en cascada (CASCADE) si configuraste la relación correctamente

        const fechaInicioString = fechaInicio.toISOString().substring(0, 10);
        const resultado = await this.contratoRepository
        .createQueryBuilder() 
        .delete()
        .from(Contrato) 
        .where('idInquilino = :idInquilino', { idInquilino })
        .andWhere('idPropiedad = :idPropiedad', { idPropiedad })
        .andWhere("DATE_FORMAT(F_ini, '%Y-%m-%d') = :fechaInicioString", { 
          fechaInicioString: fechaInicioString
        })
        .execute();

        if (resultado.affected === 0) {
            throw new NotFoundException(`Contrato no encontrado para eliminar.`);
        }
    }


    async registrarAdelanto(dto: RegisterAdelantoDto): Promise<Contrato> {
    const { idInquilino, idPropiedad, fechaInicioContrato, montoAdelanto } = dto;

    const fechaInicioDate = new Date(fechaInicioContrato);
    const contrato = await this.getOne(idInquilino, idPropiedad, new Date(fechaInicioContrato));

    const adelantoActual = parseFloat(contrato.adelanto as any) || 0; 
    
    const nuevoTotalAdelanto = adelantoActual + montoAdelanto; 

    contrato.adelanto = nuevoTotalAdelanto;

    return this.contratoRepository.save(contrato);
}
    
    private async generarCuotasMensuales(contrato: Contrato): Promise<void> {
    const { fechaInicio, fechaFin, precioMensual, idInquilino, idPropiedad } = contrato;
    const cuotas: PagoAlquiler[] = [];
    
    // --- LÓGICA DE FECHA CORREGIDA ---

    // Clonamos la fecha de inicio.
    let fechaGeneradora = new Date(fechaInicio); 
    
    // Almacenamos el día de inicio original para usarlo como día de vencimiento.
    // Ejemplo: Si es 2024-05-31, el diaDeVencimiento será 31.
    const diaDeVencimientoOriginal = fechaGeneradora.getDate(); 
    
    // Para evitar el bug del setMonth(31), movemos la fecha al día 1.
    fechaGeneradora.setDate(1); 
    
    // Ya que queremos generar la cuota para el PRIMER mes después de la fechaInicio,
    // debemos avanzar un mes antes de empezar el bucle.
    fechaGeneradora.setMonth(fechaGeneradora.getMonth() + 1);
    
    // Iteramos hasta que la fecha generada exceda la fecha de fin del contrato
    while (fechaGeneradora <= fechaFin) { 
        
        // 1. Clonar la fecha base (ej: 2024-06-01)
        let fechaVencimientoCuota = new Date(fechaGeneradora);

        // 2. Calcular el último día del mes actual (ej: Junio tiene 30)
        const ultimoDiaDelMes = new Date(
            fechaVencimientoCuota.getFullYear(), 
            fechaVencimientoCuota.getMonth() + 1, // Mes siguiente
            0 // Día 0 = el último día del mes anterior (el actual)
        ).getDate();
        
        // 3. El día de vencimiento será el mínimo entre el día original (ej: 31) y el último día del mes (ej: 30)
        //    Esto asegura que 31/Mayo -> 30/Junio -> 31/Julio
        const diaCuotaFinal = Math.min(diaDeVencimientoOriginal, ultimoDiaDelMes);
        
        fechaVencimientoCuota.setDate(diaCuotaFinal); 
        // ---------------------------------

        const nuevaCuota = this.pagoAlquilerRepository.create({
            idInquilino: idInquilino,
            idPropiedad: idPropiedad,
            fechaInicioContrato: fechaInicio, // Clave compuesta

            fechaPago: fechaVencimientoCuota, // La fecha de vencimiento C O R R E G I D A
            monto: precioMensual,
            estado: EstadoPago.PENDIENTE, // Estado inicial
        });
        
        cuotas.push(nuevaCuota);
        
        // Avanzar la base (que está en el día 1) un mes más
        fechaGeneradora.setMonth(fechaGeneradora.getMonth() + 1);
    }
    await this.pagoAlquilerRepository.save(cuotas);
}

    // Tu función _calcularMultasYEstado, modificada para simplificar:

private _calcularMultasYEstado(cuotas: PagoAlquiler[], multaRate: number): CuotaConMultaCalculada[] {
    const hoy = new Date();
    const hoyNormalizado = new Date(hoy.setHours(0, 0, 0, 0));

    // Esta función ya no necesita calcular la multa, pero determina el estado para el detalle
    return cuotas.map(cuota => {
        
        const montoBase = parseFloat(cuota.monto as any); 
        const fechaVencimientoObj = new Date(cuota.fechaPago); 
        
        // Calcular la multa usando la nueva función
        const multa = this.calcularMulta(fechaVencimientoObj, multaRate, montoBase);
        
        let estadoCalculado = cuota.estado;
        
        // Si estaba PENDIENTE y venció, marcarla como VENCIDA
        if (cuota.estado === EstadoPago.PENDIENTE && fechaVencimientoObj.getTime() < hoyNormalizado.getTime()) {
            estadoCalculado = EstadoPago.VENCIDA;
        }

        return {
            ...cuota, 
            multaCalculada: multa,
            montoTotal: montoBase + multa, 
            estadoCalculado: estadoCalculado,
        };
    });
}


     async generarContratoPDF(idInquilino: number, idPropiedad: number, fechaInicio: Date): Promise<Buffer> {
        
        // 1. Obtener y validar el contrato (Esta parte se queda en el ContratoService)
        const fechaInicioString = fechaInicio.toISOString().substring(0, 10);
    
    // 2. Usar QueryBuilder para comparar solo la fecha (ignorando la hora/zona horaria)
    const contrato = await this.contratoRepository
        .createQueryBuilder('contrato')
        .leftJoinAndSelect('contrato.inquilino', 'inquilino') // Carga las relaciones necesarias
        .leftJoinAndSelect('contrato.propiedad', 'propiedad') // Carga las relaciones necesarias
        .leftJoinAndSelect('contrato.pagos', 'pagos') // Carga las relaciones necesarias
        .where('contrato.idInquilino = :idInquilino', { idInquilino })
        .andWhere('contrato.idPropiedad = :idPropiedad', { idPropiedad })
        .andWhere("DATE_FORMAT(contrato.fechaInicio, '%Y-%m-%d') = :fechaInicioString", { 
            fechaInicioString: fechaInicioString 
        })
        .getOne(); 

        if (!contrato) {
            throw new NotFoundException('Contrato no encontrado.');
        }
        const format = (date: Date | null) => 
            date ? new Date(date).toLocaleDateString('es-ES') : 'N/A';

        // 2. Mapear y formatear los datos para el PDF (El ContratoService sabe cómo deben lucir sus datos)
        const datosParaPDF = { 
            fechaFirma: format(new Date()),
            
            inquilino: {
                nombreCompleto: contrato.inquilino.name, // O el campo que tenga el nombre
                ci: contrato.inquilino.ci,
    
            },
            propiedad: {
                idPropiedad : contrato.propiedad.idPropiedad,
                tipo : contrato.propiedad.tipo,
                calle: contrato.propiedad.calle,
                numero_Vivienda : contrato.propiedad.numViv,
                ciudad: contrato.propiedad.ciudad,
                descripcion: contrato.propiedad.descripcion
            },


            precio: contrato.precioMensual,

            fechaInicio: format(contrato.fechaInicio), 
            fechaFin: format(contrato.fechaFin),
            
            adelanto: contrato.adelanto || 0, 
            multaRetraso: contrato.multaRetraso, 
            
            explicacion: contrato.explicacion, 
            
            pagosProgramados: contrato.pagos.map(p => ({
                ...p, 
                fechaPago: format(p.fechaPago) // Formatea fechas de pagos
            })),
        };
        // 3. Delegar la generación del PDF al servicio especializado
        try {
            return this.pdfGeneratorService.generateContrato(datosParaPDF); // 🟢 LLAMADA AL SERVICIO
        } catch (error) {
            // Re-lanzar un error más amigable si el generador falla
            throw new InternalServerErrorException('No se pudo completar la generación del PDF del contrato.');
        }
    }

    async getDeudaNeta(idInquilino: number, idPropiedad: number, fechaInicio: Date): Promise<any> {
    
    let deudaNetaTotal = 0;
    let cuotasDetalladas: CuotaDetalladaInterface[] = []; 

    // 1. Buscamos el contrato, incluyendo todos los pagos relacionados
    const fechaInicioContratoDb = new Date(fechaInicio);
    const fechaInicioDbString = fechaInicioContratoDb.toISOString().substring(0, 10);
    
    // Simplificamos la consulta, solo necesitamos UNA
    const contrato = await this.contratoRepository
        .createQueryBuilder('contrato')
        .leftJoinAndSelect('contrato.pagos', 'pagos')
        .where('contrato.idInquilino = :idInquilino', { idInquilino })
        .andWhere('contrato.idPropiedad = :idPropiedad', { idPropiedad })
        .andWhere("DATE_FORMAT(contrato.fechaInicio, '%Y-%m-%d') = :fechaInicioString", { 
            fechaInicioString: fechaInicioDbString 
        })
        .orderBy('pagos.fechaPago', 'ASC')
        .getOne();
        
    if (!contrato) {
        throw new NotFoundException(`Contrato no encontrado para las claves proporcionadas.`);
    }

    // 2. Mapear pagos existentes para acceso rápido (por fecha de vencimiento)
    // Usamos la fecha de vencimiento normalizada para la clave del Map.
    const pagosExistentesMap = new Map<number, PagoAlquiler>(
        contrato.pagos.map(pago => {
            const fechaPagoNormalizada = new Date(pago.fechaPago);
            fechaPagoNormalizada.setHours(0, 0, 0, 0); // Normalizamos a medianoche UTC
            return [fechaPagoNormalizada.getTime(), { ...pago, fechaPago: fechaPagoNormalizada }];
        })
    );
    
    // 3. Generar la lista completa de cuotas teóricas del contrato
    const cuotasTeoricas = this._generarCuotasTeoricas(
        new Date(contrato.fechaInicio), 
        new Date(contrato.fechaFin), 
        parseFloat(contrato.precioMensual as any)
    );
    
    // 4. Inicializar y Aplicar Lógica Secuencial
    let adelantoRestante = parseFloat(contrato.adelanto as any) || 0;
    const multaRate = parseFloat(contrato.multaRetraso as any) || 0;

    for (const cuotaTeorica of cuotasTeoricas) {
        
        const fechaVencimientoTime = cuotaTeorica.fechaPago.getTime();
        const pagoExistente = pagosExistentesMap.get(fechaVencimientoTime);
        
        let montoBase = parseFloat(cuotaTeorica.monto as any); 

        // 🛑 PUNTO CRÍTICO: Si la cuota ya fue marcada como PAGADA, la EXCLUIMOS.
        if (pagoExistente && pagoExistente.estado === EstadoPago.PAGADA) {
            // Cuota resuelta. No afecta la deuda ni el adelanto.
            continue; 
        }

        // Si la cuota no está pagada (PENDIENTE, VENCIDA o PENDIENTE_VERIFICACION)
        
        // a. Calcular Multa
        // Si está PENDIENTE_VERIFICACION o PENDIENTE/VENCIDA, calculamos la multa al vuelo.
        const multaCalculada = this.calcularMulta(cuotaTeorica.fechaPago, multaRate, montoBase);
        
        let montoPendiente = montoBase + multaCalculada;
        let montoCubiertoPorAdelanto = 0;

        // b. Aplicar Adelanto
        if (adelantoRestante > 0) {
            montoCubiertoPorAdelanto = Math.min(montoPendiente, adelantoRestante);
            adelantoRestante -= montoCubiertoPorAdelanto;
            montoPendiente -= montoCubiertoPorAdelanto;
        }

        // c. Determinar Estado y Acumular Deuda
        let estadoFinal: EstadoPago;

        if (pagoExistente && pagoExistente.estado === EstadoPago.PENDIENTE_VERIFICACION) {
             estadoFinal = EstadoPago.PENDIENTE_VERIFICACION;
        } else if (montoPendiente <= 0) {
            estadoFinal = EstadoPago.PAGADA; // Cubierta por adelanto
        } else {
            estadoFinal = (cuotaTeorica.fechaPago < new Date()) ? EstadoPago.VENCIDA : EstadoPago.PENDIENTE;
        }
        
        // Solo sumamos a la deuda neta si queda un monto pendiente (> 0)
        deudaNetaTotal += montoPendiente; 
        
        cuotasDetalladas.push({
        fechaVencimiento: cuotaTeorica.fechaPago,
        
        montoBase: parseFloat(montoBase.toFixed(2)),
        multa: parseFloat(multaCalculada.toFixed(2)),
        cubiertoPorAdelanto: parseFloat(montoCubiertoPorAdelanto.toFixed(2)),
        deudaNeta: parseFloat(montoPendiente.toFixed(2)),
        estadoActual: estadoFinal, 
});
    }

    const deudaFinalFormateada = parseFloat(deudaNetaTotal.toFixed(2));

    const { pagos, ...contratoSinPagos } = contrato;

    return {
        contrato : contratoSinPagos,
        deudaNetaTotal: deudaFinalFormateada,
        adelantoRestante: parseFloat(adelantoRestante.toFixed(2)),
        cuotasPendientesDetalle: cuotasDetalladas,
    };
}
    private _generarCuotasTeoricas(fechaInicio: Date, fechaFin: Date, precioMensual: number): PagoAlquiler[] {
    
    const cuotas: PagoAlquiler[] = [];
    
    let fechaGeneradora = new Date(fechaInicio); 
    const diaDeVencimientoOriginal = fechaGeneradora.getDate(); 
    fechaGeneradora.setDate(1); 
    fechaGeneradora.setMonth(fechaGeneradora.getMonth() + 1);
    
    while (fechaGeneradora <= fechaFin) { 
        let fechaVencimientoCuota = new Date(fechaGeneradora);

        const ultimoDiaDelMes = new Date(
            fechaVencimientoCuota.getFullYear(), 
            fechaVencimientoCuota.getMonth() + 1,
            0 
        ).getDate();
        
        const diaCuotaFinal = Math.min(diaDeVencimientoOriginal, ultimoDiaDelMes);
        fechaVencimientoCuota.setDate(diaCuotaFinal); 
        
        // Creamos la cuota teórica (no la guardamos, solo la usamos para la lista)
        // Usamos valores dummy para idInquilino/idPropiedad ya que no se guardará
        const nuevaCuota = this.pagoAlquilerRepository.create({
            idInquilino: 0, 
            idPropiedad: 0,
            fechaInicioContrato: fechaInicio, 
            fechaPago: fechaVencimientoCuota,
            monto: precioMensual,
            estado: EstadoPago.PENDIENTE, // Estado inicial forzado para el cálculo
        });
        
        cuotas.push(nuevaCuota);
        fechaGeneradora.setMonth(fechaGeneradora.getMonth() + 1);
    }
    return cuotas;
}

private calcularMulta(fechaVencimiento: Date, multaRate: number, montoBase: number): number {
    
    // Función auxiliar para normalizar la fecha a medianoche UTC
    const getUTCMidnight = (date: Date): Date => {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    };

    const hoy = new Date();
    const hoyUTC = getUTCMidnight(hoy);
    const fechaVencimientoUTC = getUTCMidnight(fechaVencimiento);

    // Solo calculamos multa si la fecha de vencimiento ya pasó (es decir, la cuota está vencida)
    if (fechaVencimientoUTC.getTime() < hoyUTC.getTime()) {
        const diffTime = hoyUTC.getTime() - fechaVencimientoUTC.getTime();
        // Días de retraso (redondeamos por si hay fracciones de día)
        const diasRetraso = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        if (diasRetraso > 0) {
            let multa = diasRetraso * (montoBase * multaRate); 
            return parseFloat(multa.toFixed(2));
        }
    }
    return 0; // No hay multa o no ha vencido
}

}

