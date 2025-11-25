import { Test, TestingModule } from '@nestjs/testing';
import { TecnicosController } from './tecnicos.controller';

describe('TecnicosController', () => {
  let controller: TecnicosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TecnicosController],
    }).compile();

    controller = module.get<TecnicosController>(TecnicosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
