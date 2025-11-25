import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tecnico } from './tecnico.entity';

@Injectable()
export class TecnicosService {
  constructor(
    @InjectRepository(Tecnico)
    private readonly tecnicoRepository: Repository<Tecnico>,
  ) {}

  create(data: any) {
    const tecnico = this.tecnicoRepository.create(data);
    return this.tecnicoRepository.save(tecnico);
  }

  findAll() {
    return this.tecnicoRepository.find();
  }
}

