// src/role/role.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entity/rol.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  findAll() {
    return this.roleRepo.find();
  }

  findById(id: number) {
    return this.roleRepo.findOne({ where: { idRol: id } });
  }

  async create(nombre: string) {
  const role = this.roleRepo.create({ nombre });
  return await this.roleRepo.save(role);
}

  delete(id: number) {
    return this.roleRepo.delete(id);
  }
}
