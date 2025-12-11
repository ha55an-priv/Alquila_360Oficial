import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entity/user.entity';
import { Role } from '../entity/rol.entity';
import { EmailUsuario } from '../entity/emailUsuario.entity';
import { TelefonoUsuario } from '../entity/telefonoUsuario.entity';
import { Propiedad } from '../entity/propiedad.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(EmailUsuario) private emailRepository: Repository<EmailUsuario>,
    @InjectRepository(TelefonoUsuario) private telefonoRepository: Repository<TelefonoUsuario>,
    @InjectRepository(Propiedad) private propiedadRepository: Repository<Propiedad>,
  ) {}

  async findAll(page?: number, limit?: number, sort?: string, order?: 'ASC' | 'DESC') {
    const skip = page && limit ? (page - 1) * limit : 0;
    const take = limit || 10;

    const query = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.emails', 'emails')
      .leftJoinAndSelect('user.telefonos', 'telefonos')
      .leftJoinAndSelect('user.propiedades', 'propiedades');

    if (sort) {
      query.orderBy(`user.${sort}`, order || 'ASC');
    }

    query.skip(skip).take(take);

    const [users, total] = await query.getManyAndCount();

    return {
      users,
      total,
      page: page || 1,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findOne(ci: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { ci },
      relations: [
        'roles', 'emails', 'telefonos', 'propiedades',
        'contratosInquilino', 'metodosPago',
        'ticketsReportados', 'ticketsAtendidos',
        'pagosRecibidos', 'resenasCreadas', 'resenasRecibidas'
      ],
    });

    if (!user) throw new NotFoundException(`Usuario con CI ${ci} no encontrado`);
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { ci: createUserDto.ci } });
    if (existingUser) throw new ConflictException('El usuario ya existe');

    const hashedPassword = await bcrypt.hash(createUserDto.contrasena, 10);

    const user = this.userRepository.create({
      ci: createUserDto.ci,
      name: createUserDto.name,
      fechaNacimiento: createUserDto.fechaNacimiento ? new Date(createUserDto.fechaNacimiento) : null,
      contrasena: hashedPassword,
      activacion: createUserDto.activacion ?? true,
    });

    if (createUserDto.rolesId?.length) {
      const roles = await this.roleRepository.find({ where: { idRol: In(createUserDto.rolesId) } });
      user.roles = roles;
    }

    const savedUser = await this.userRepository.save(user);

    if (createUserDto.emails?.length) {
      const emails = createUserDto.emails.map(email => this.emailRepository.create({ idUsuario: savedUser.ci, email, usuario: savedUser }));
      await this.emailRepository.save(emails);
    }

    if (createUserDto.telefonos?.length) {
      const telefonos = createUserDto.telefonos.map(t => this.telefonoRepository.create({ idUsuario: savedUser.ci, telefono: t, usuario: savedUser }));
      await this.telefonoRepository.save(telefonos);
    }

    if (createUserDto.propiedadIds?.length) {
      const propiedades = await this.propiedadRepository.find({ where: { idPropiedad: In(createUserDto.propiedadIds) } });
      savedUser.propiedades = propiedades;
      await this.userRepository.save(savedUser);
    }

    return this.findOne(savedUser.ci);
  }

  async update(ci: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(ci);

    if (updateUserDto.name !== undefined) user.name = updateUserDto.name;
    if (updateUserDto.fechaNacimiento !== undefined) user.fechaNacimiento = updateUserDto.fechaNacimiento ? new Date(updateUserDto.fechaNacimiento) : null;
    if (updateUserDto.activacion !== undefined) user.activacion = updateUserDto.activacion;
    if (updateUserDto.contrasena?.trim()) user.contrasena = await bcrypt.hash(updateUserDto.contrasena, 10);

    if (updateUserDto.rolesId?.length) {
      const roles = await this.roleRepository.find({ where: { idRol: In(updateUserDto.rolesId) } });
      user.roles = roles;
    }

    if (updateUserDto.emails) {
      await this.emailRepository.delete({ idUsuario: ci });
      const emails = updateUserDto.emails.map(email => this.emailRepository.create({ idUsuario: ci, email, usuario: user }));
      await this.emailRepository.save(emails);
    }

    if (updateUserDto.telefonos) {
      await this.telefonoRepository.delete({ idUsuario: ci });
      const telefonos = updateUserDto.telefonos.map(t => this.telefonoRepository.create({ idUsuario: ci, telefono: t, usuario: user }));
      await this.telefonoRepository.save(telefonos);
    }

    if (updateUserDto.propiedadIds?.length) {
      const propiedades = await this.propiedadRepository.find({ where: { idPropiedad: In(updateUserDto.propiedadIds) } });
      user.propiedades = propiedades;
    }

    await this.userRepository.save(user);
    return this.findOne(ci);
  }

  async remove(ci: number): Promise<void> {
    const result = await this.userRepository.delete(ci);
    if (result.affected === 0) throw new NotFoundException(`Usuario con CI ${ci} no encontrado`);
  }

  async getUsersByRole(roleName: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('roles.nombre = :roleName', { roleName })
      .getMany();
  }

  async getTechnicians() { return this.getUsersByRole('TECNICO'); }
  async getTenants() { return this.getUsersByRole('INQUILINO'); }
  async getOwners() { return this.getUsersByRole('PROPIETARIO'); }
  async countUsers(): Promise<number> { return this.userRepository.count(); }
}