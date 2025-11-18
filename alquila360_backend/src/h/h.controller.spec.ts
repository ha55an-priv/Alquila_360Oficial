import { Test, TestingModule } from '@nestjs/testing';
import { HController } from './h.controller';

describe('HController', () => {
  let controller: HController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HController],
    }).compile();

    controller = module.get<HController>(HController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
