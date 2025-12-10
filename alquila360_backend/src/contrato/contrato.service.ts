// src/contrato/contrato.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import {
  Contrato,
  EstadoContrato,
  TipoMulta,
} from '../entity/contrato.entity';
import {
  EstadoCuota,
  PagoAlquiler,
} from '../entity/pago_alquiler.entity';
import {
  Propiedad,
  EstadoPropiedad,
} from '../entity/propiedad.entity';


@Injectable()
export class ContratoService {
  constructor(
    @InjectRepository(Contrato)
    private contratoRepo: Repository<Contrato>,
    @InjectRepository(PagoAlquiler)
    private cuotaRepo: Repository<PagoAlquiler>,
    @InjectRepository(Propiedad)
    private propiedadRepo: Repository<Propiedad>,
  ) {}

  // ============================
  // CREAR CONTRATO + GENERAR CUOTAS + MARCAR PROPIEDAD RENTADA
  // ============================
  async create(dto: any) {
    const contrato = this.contratoRepo.create({
      idInquilino: dto.idInquilino,
      idPropiedad: dto.idPropiedad,
      fechaInicio: new Date(dto.fechaInicio),
      fechaFin: dto.fechaFin ? new Date(dto.fechaFin) : null,
      explicacion: dto.explicacion ?? null,
      precioMensual: dto.precioMensual,
      adelanto: dto.adelanto ?? null,

      // Garantía = un mes de alquiler (puedes sobreescribir vía dto.garantia)
      garantia: dto.garantia ?? dto.precioMensual,

      tipoMulta: dto.tipoMulta ?? TipoMulta.PORCENTAJE,
      multaRetraso: dto.multaRetraso ?? '1.00', // 1% diario por defecto

      estado: EstadoContrato.ACTIVO,
    });

    const savedContrato = await this.contratoRepo.save(contrato);

    // Generar cuotas mensuales si hay fecha fin
    if (savedContrato.fechaFin) {
      const cuotas = this.generarCuotasParaContrato(savedContrato);
      await this.cuotaRepo.save(cuotas);
    }

    // Marcar propiedad como RENTADO
    await this.actualizarEstadoPropiedad(
      savedContrato.idPropiedad,
      EstadoPropiedad.Rentado,
    );

    return this.findOne(savedContrato.idContrato);
  }

  async findAll() {
    return this.contratoRepo.find({
      relations: ['propiedad', 'inquilino', 'pagos'],
    });
  }

  async findOne(idContrato: number) {
    const contrato = await this.contratoRepo.findOne({
      where: { idContrato },
      relations: ['propiedad', 'inquilino', 'pagos'],
    });
    if (!contrato) throw new NotFoundException('Contrato no encontrado');
    return contrato;
  }

  // ============================
  // REGISTRAR PAGO DE UNA CUOTA
  // ============================
  async registrarPago(idPago: number, dto: any) {
    const cuota = await this.cuotaRepo.findOne({
      where: { idPago },
      relations: ['contrato'],
    });
    if (!cuota) throw new NotFoundException('Cuota no encontrada');

    const contrato = cuota.contrato;
    const fechaPago = dto.fechaPago
      ? new Date(dto.fechaPago)
      : new Date();

    cuota.fechaPago = fechaPago;
    cuota.metodoDePago = dto.metodoDePago ?? null;
    cuota.motivo = dto.motivo ?? 'Pago de alquiler';

    // Calcular multa si se pagó después de la fecha de vencimiento
    let multa = 0;
    const montoBase = Number(cuota.montoBase);

    if (fechaPago > cuota.fechaVencimiento && contrato.multaRetraso) {
      const diffMs =
        fechaPago.getTime() - cuota.fechaVencimiento.getTime();
      const diasMora = Math.floor(
        diffMs / (1000 * 60 * 60 * 24),
      );

      const valorMulta = Number(contrato.multaRetraso); // monto fijo o %
      if (contrato.tipoMulta === TipoMulta.MONTO_FIJO) {
        multa = valorMulta * diasMora;
      } else {
        // porcentaje diario (ej. 1% diario)
        const porcentaje = valorMulta / 100;
        multa = montoBase * porcentaje * diasMora;
      }
    }

    cuota.multaAplicada = multa ? multa.toFixed(2) : null;
    cuota.montoTotal = (montoBase + multa).toFixed(2);
    cuota.estado = EstadoCuota.PAGADO;

    await this.cuotaRepo.save(cuota);
    return cuota;
  }
  // ============================
  // CERRAR CONTRATO
  // (marcar VENCIDO + cuotas pendientes VENCIDO + propiedad Libre)
  // ============================
  async cerrarContrato(idContrato: number) {
    const contrato = await this.contratoRepo.findOne({
      where: { idContrato },
      relations: ['pagos'],
    });
    if (!contrato) {
      throw new NotFoundException('Contrato no encontrado');
    }

    contrato.estado = EstadoContrato.VENCIDO;

    // Si no tenía fechaFin, la ponemos ahora
    if (!contrato.fechaFin) {
      contrato.fechaFin = new Date();
    }

    // Marcar cuotas pendientes como VENCIDO
    for (const cuota of contrato.pagos || []) {
      if (cuota.estado === EstadoCuota.PENDIENTE) {
        cuota.estado = EstadoCuota.VENCIDO;
      }
    }

    await this.cuotaRepo.save(contrato.pagos || []);
    await this.contratoRepo.save(contrato);

    // Marcar propiedad como LIBRE
    await this.actualizarEstadoPropiedad(
      contrato.idPropiedad,
      EstadoPropiedad.Libre,
    );

    return this.findOne(idContrato);
  }

  // ============================
  // ESTADO DE CUENTA DEL INQUILINO
  // ============================
  async obtenerEstadoCuentaInquilino(ciInquilino: number) {
    // 1) Actualizar cuotas vencidas antes de calcular
    await this.actualizarCuotasVencidas();

    // 2) Buscar todos los contratos de este inquilino
    const contratos = await this.contratoRepo.find({
      where: { idInquilino: ciInquilino },
      relations: ['pagos', 'propiedad'],
    });

    let totalDeuda = 0;
    let totalMultas = 0;
    let cuotasPendientes = 0;
    let cuotasVencidas = 0;

    const contratosDetalle = contratos.map((contrato) => {
      const pagosDetalle = (contrato.pagos || []).map((pago) => {
        const montoBase = Number(pago.montoBase);
        const multa = Number(pago.multaAplicada || 0);
        const total = Number(pago.montoTotal);

        if (pago.estado === EstadoCuota.PENDIENTE) {
          cuotasPendientes++;
          totalDeuda += total;
          totalMultas += multa;
        } else if (pago.estado === EstadoCuota.VENCIDO) {
          cuotasVencidas++;
          totalDeuda += total;
          totalMultas += multa;
        }

        return {
          idPago: pago.idPago,
          numeroCuota: pago.numeroCuota,
          fechaVencimiento: pago.fechaVencimiento,
          fechaPago: pago.fechaPago,
          montoBase,
          multaAplicada: multa,
          montoTotal: total,
          estado: pago.estado,
        };
      });

      return {
        idContrato: contrato.idContrato,
        propiedad: contrato.propiedad,
        estadoContrato: contrato.estado,
        fechaInicio: contrato.fechaInicio,
        fechaFin: contrato.fechaFin,
        pagos: pagosDetalle,
      };
    });

    const moroso = cuotasVencidas >= 3;

    return {
      inquilino: ciInquilino,
      totalDeuda: Number(totalDeuda.toFixed(2)),
      totalMultas: Number(totalMultas.toFixed(2)),
      cuotasPendientes,
      cuotasVencidas,
      moroso,
      contratos: contratosDetalle,
    };
  }

  // ============================
  // ¿ES INQUILINO MOROSO?
  // (>= 3 cuotas vencidas)
  // ============================
  async esInquilinoMoroso(ciInquilino: number): Promise<boolean> {
    // Primero actualizamos cuotas vencidas
    await this.actualizarCuotasVencidas();

    const contratos = await this.contratoRepo.find({
      where: { idInquilino: ciInquilino },
      relations: ['pagos'],
    });

    let cuotasVencidas = 0;

    for (const contrato of contratos) {
      for (const pago of contrato.pagos || []) {
        if (pago.estado === EstadoCuota.VENCIDO) {
          cuotasVencidas++;
          if (cuotasVencidas >= 3) {
            return true;
          }
        }
      }
    }

    return false;
  }

  // ============================
  // Helpers internos
  // ============================

  private generarCuotasParaContrato(contrato: Contrato): PagoAlquiler[] {
    const cuotas: PagoAlquiler[] = [];
    const inicio = new Date(contrato.fechaInicio);
    const fin = new Date(contrato.fechaFin!);

    let n = 1;
    let current = new Date(inicio);

    while (current <= fin) {
      const vencimiento = new Date(current);

      const cuota = this.cuotaRepo.create({
        idContrato: contrato.idContrato,
        numeroCuota: n++,
        fechaVencimiento: vencimiento,
        fechaPago: null,
        montoBase: contrato.precioMensual,
        multaAplicada: null,
        montoTotal: contrato.precioMensual,
        estado: EstadoCuota.PENDIENTE,
        metodoDePago: null,
        motivo: null,
      });

      cuotas.push(cuota);

      current = this.addMonths(inicio, n - 1);
    }

    return cuotas;
  }

  private addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }

  private async actualizarEstadoPropiedad(
    idPropiedad: number,
    estado: EstadoPropiedad,
  ) {
    const propiedad = await this.propiedadRepo.findOne({
      where: { idPropiedad },
    });
    if (!propiedad) return;
    propiedad.estado = estado;
    await this.propiedadRepo.save(propiedad);
  }

  // Marcar cuotas PENDIENTE como VENCIDO si ya pasó la fecha
  private async actualizarCuotasVencidas() {
    const hoy = new Date();

    const cuotasPendientes = await this.cuotaRepo.find({
      where: {
        estado: EstadoCuota.PENDIENTE,
        fechaVencimiento: LessThan(hoy),
      },
    });

    if (!cuotasPendientes.length) return;

    for (const cuota of cuotasPendientes) {
      cuota.estado = EstadoCuota.VENCIDO;
    }

    await this.cuotaRepo.save(cuotasPendientes);
  }
}
