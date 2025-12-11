import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contrato, EstadoContrato, TipoMulta } from 'src/entity/contrato.entity';
import { User } from 'src/entity/user.entity';
import { Propiedad, EstadoPropiedad } from 'src/entity/propiedad.entity';
import { PagoAlquiler } from 'src/entity/pago_alquiler.entity';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { CancelContratoDto } from './dto/cancel-contrato.dto';
import { QueryHelpers } from 'src/utils/query-helpers';

@Injectable()
export class ContratoService {
  constructor(
    @InjectRepository(Contrato)
    private readonly contratoRepo: Repository<Contrato>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Propiedad)
    private readonly propiedadRepo: Repository<Propiedad>,
    @InjectRepository(PagoAlquiler)
    private readonly pagoRepo: Repository<PagoAlquiler>,
  ) {}

  async create(dto: CreateContratoDto): Promise<Contrato> {
    // Validar inquilino
    const inquilino = await this.userRepo.findOne({ where: { ci: dto.idInquilino } });
    if (!inquilino) throw new NotFoundException(`Inquilino con ID ${dto.idInquilino} no encontrado`);

    // Validar propiedad
    const propiedad = await this.propiedadRepo.findOne({ where: { idPropiedad: dto.idPropiedad } });
    if (!propiedad) throw new NotFoundException(`Propiedad con ID ${dto.idPropiedad} no encontrada`);
    if (propiedad.estado === EstadoPropiedad.Rentado) throw new BadRequestException('Propiedad ya rentada');

    // Validar fechas
    const fechaInicio = new Date(dto.fechaInicio);
    const fechaFin = dto.fechaFin ? new Date(dto.fechaFin) : null;
    if (fechaFin && fechaFin < fechaInicio) {
      throw new BadRequestException('La fecha de fin no puede ser anterior a la fecha de inicio');
    }

    const contrato = this.contratoRepo.create({
      ...dto,
      fechaInicio,
      fechaFin,
      inquilino,
      propiedad,
      estado: dto.estado || EstadoContrato.ACTIVO,
    });

    // Marcar propiedad como rentada
    propiedad.estado = EstadoPropiedad.Rentado;
    await this.propiedadRepo.save(propiedad);

    return this.contratoRepo.save(contrato);
  }

  async findAll(
  page?: number,
  limit?: number,
  sort?: string,
  order?: 'asc' | 'desc',
): Promise<Contrato[]> {
  const { page: p, limit: l } = QueryHelpers.normalizePage(page, limit);

  // Campos válidos para ordenar
  const validSortFields = ['idContrato', 'fechaInicio', 'fechaFin', 'precioMensual', 'estado'];
  if (sort && !validSortFields.includes(sort)) {
    throw new BadRequestException(`Campo de ordenamiento no válido: ${sort}`);
  }

  // Helper para convertir 'asc'/'desc' a 'ASC'/'DESC'
  const formatOrder = (o?: 'asc' | 'desc'): 'ASC' | 'DESC' => {
    if (!o) return 'ASC';
    return o.toUpperCase() as 'ASC' | 'DESC';
  };

  // Orden por defecto o por parámetro
  const orderBy = sort
    ? { [sort]: formatOrder(order) }
    : { fechaInicio: 'DESC' as 'ASC' | 'DESC' };

  return this.contratoRepo.find({
    relations: ['inquilino', 'propiedad', 'pagos'],
    skip: (p - 1) * l,
    take: l,
    order: orderBy,
  });
}


  async findOne(id: number): Promise<Contrato> {
    const contrato = await this.contratoRepo.findOne({
      where: { idContrato: id },
      relations: ['inquilino', 'propiedad', 'pagos'],
    });
    if (!contrato) throw new NotFoundException(`Contrato con ID ${id} no encontrado`);
    return contrato;
  }

  async update(id: number, dto: UpdateContratoDto): Promise<Contrato> {
    const contrato = await this.findOne(id);

    // Validar y actualizar inquilino
    if (dto.idInquilino && dto.idInquilino !== contrato.idInquilino) {
      const inquilino = await this.userRepo.findOne({ where: { ci: dto.idInquilino } });
      if (!inquilino) throw new NotFoundException(`Inquilino con ID ${dto.idInquilino} no encontrado`);
      contrato.inquilino = inquilino;
      contrato.idInquilino = inquilino.ci;
    }

    // Validar y actualizar propiedad
    if (dto.idPropiedad && dto.idPropiedad !== contrato.idPropiedad) {
      const propiedad = await this.propiedadRepo.findOne({ where: { idPropiedad: dto.idPropiedad } });
      if (!propiedad) throw new NotFoundException(`Propiedad con ID ${dto.idPropiedad} no encontrada`);
      if (propiedad.estado === EstadoPropiedad.Rentado) throw new BadRequestException('Propiedad ya rentada');

      // Liberar propiedad anterior
      if (contrato.propiedad) {
        contrato.propiedad.estado = EstadoPropiedad.Libre;
        await this.propiedadRepo.save(contrato.propiedad);
      }

      contrato.propiedad = propiedad;
      contrato.idPropiedad = propiedad.idPropiedad;
      propiedad.estado = EstadoPropiedad.Rentado;
      await this.propiedadRepo.save(propiedad);
    }

    Object.assign(contrato, dto);

    if (dto.fechaInicio) contrato.fechaInicio = new Date(dto.fechaInicio);
    if (dto.fechaFin) {
      const fechaFin = new Date(dto.fechaFin);
      if (fechaFin < contrato.fechaInicio) throw new BadRequestException('La fecha de fin no puede ser anterior a la fecha de inicio');
      contrato.fechaFin = fechaFin;
    }

    return this.contratoRepo.save(contrato);
  }

  async cancel(id: number, dto: CancelContratoDto): Promise<Contrato> {
    const contrato = await this.findOne(id);
    if (contrato.estado === EstadoContrato.CANCELADO)
      throw new BadRequestException('Contrato ya cancelado');

    contrato.estado = EstadoContrato.CANCELADO;
    contrato.explicacion = contrato.explicacion
      ? contrato.explicacion + ' | ' + (dto.motivo || 'Cancelado')
      : dto.motivo || 'Cancelado';

    if (contrato.propiedad) {
      contrato.propiedad.estado = EstadoPropiedad.Libre;
      await this.propiedadRepo.save(contrato.propiedad);
    }

    return this.contratoRepo.save(contrato);
  }

  async remove(id: number): Promise<void> {
    const contrato = await this.findOne(id);
    if (contrato.pagos.length > 0) throw new BadRequestException('No se puede eliminar contrato con pagos');

    if (contrato.propiedad) {
      contrato.propiedad.estado = EstadoPropiedad.Libre;
      await this.propiedadRepo.save(contrato.propiedad);
    }

    await this.contratoRepo.remove(contrato);
  }
}