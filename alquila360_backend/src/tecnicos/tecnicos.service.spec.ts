import { Test, TestingModule } from '@nestjs/testing';
import { TecnicosService } from './tecnicos.service';

describe('TecnicosService', () => {
  let service: TecnicosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TecnicosService],
    }).compile();

    service = module.get<TecnicosService>(TecnicosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
